#!/usr/bin/env node
/**
 * prepMedia — turn raw masters into the exact web files this site expects.
 *
 * The <master> can be a LOCAL PATH or an http(s) URL (a link to an uploaded
 * file — R2, Dropbox, S3, a public Drive direct-download link, …). URLs are
 * streamed to a temp file, processed, then discarded — nothing large lands in
 * the repo except the finished web encodes.
 *
 *   VIDEO  node scripts/prepMedia.mjs video <master> <key> [--mobile]
 *          → src/assets/video/<key>.mp4          web encode (H.264, ≤1080p, faststart)
 *          → src/assets/video/<key>.jpg          poster frame
 *          → src/assets/video/preview-<key>.mp4  tiny muted hover-preview clip
 *          → src/assets/video/<key>-mobile.mp4   (with --mobile; lighter phone encode)
 *          Wired by filename (import.meta.glob); key "launch" replaces the launch
 *          film, any other key is referenced from src/data/videos.ts.
 *
 *   AUDIO  node scripts/prepMedia.mjs audio <master> <trackNumber> [--kbps N | --vbr]
 *          → public/audio/NN.mp3
 *          Default 320 kbps CBR — maximum-practical-MP3 quality. Audio is fetched
 *          only on play (see AudioEngine preload), so the bigger file never touches
 *          page load. --kbps N sets a different CBR rate; --vbr uses ~190 kbps VBR.
 *
 * Batch a whole album (files/URLs in track order):
 *   i=1; for f in ~/Masters/*.wav; do node scripts/prepMedia.mjs audio "$f" $i; i=$((i+1)); done
 *
 * Requires ffmpeg + ffprobe on PATH (or set FFMPEG_DIR to a folder holding both,
 * e.g. a johnvansickle static build) and curl for URL inputs.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const VIDEO_DIR = join(ROOT, 'src/assets/video')
const AUDIO_DIR = join(ROOT, 'public/audio')

const bin = (name) => (process.env.FFMPEG_DIR ? join(process.env.FFMPEG_DIR, name) : name)

function run(tool, args) {
  return execFileSync(bin(tool), args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString()
}

function ffmpeg(args) {
  execFileSync(bin('ffmpeg'), ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: 'inherit',
  })
}

function probe(file) {
  const out = run('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration,bit_rate',
    '-show_entries', 'stream=codec_type,codec_name,width,height',
    '-of', 'json', file,
  ])
  const j = JSON.parse(out)
  const v = (j.streams || []).find((s) => s.codec_type === 'video')
  return {
    duration: Number(j.format?.duration ?? 0),
    bitrate: Number(j.format?.bit_rate ?? 0),
    width: v?.width,
    height: v?.height,
  }
}

function report(file) {
  const kb = statSync(file).size / 1024
  const p = probe(file)
  const size = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`
  const dims = p.width ? ` ${p.width}×${p.height}` : ''
  console.log(`  → ${file.replace(ROOT + '/', '')}  (${size},${dims} ${(p.bitrate / 1000).toFixed(0)} kbps, ${p.duration.toFixed(0)}s)`)
}

function die(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

const isUrl = (s) => /^https?:\/\//i.test(s)

/**
 * Resolve a master to a local readable path. A URL is streamed to a temp file
 * (curl → disk, never buffered in memory, so multi-GB masters are fine); the
 * returned `cleanup()` deletes it. A local path passes through untouched.
 */
function resolveSource(src) {
  if (!isUrl(src)) {
    if (!existsSync(src)) die(`master not found: ${src}`)
    return { path: src, cleanup: () => {} }
  }
  const ext = extname(new URL(src).pathname) || '.download'
  const tmp = join(tmpdir(), `prepmedia-${Date.now()}${ext}`)
  console.log(`Downloading ${src} …`)
  try {
    execFileSync('curl', ['-fSL', '--retry', '2', '-o', tmp, src], { stdio: ['ignore', 'ignore', 'inherit'] })
  } catch {
    die(`download failed: ${src}`)
  }
  if (!existsSync(tmp) || statSync(tmp).size === 0) die(`downloaded an empty file: ${src}`)
  return { path: tmp, cleanup: () => rmSync(tmp, { force: true }) }
}

function prepVideo(master, key, { mobile }) {
  if (!/^[a-z0-9-]+$/.test(key)) die(`key must be lowercase letters/digits/dashes, got "${key}"`)
  const source = resolveSource(master)
  try {
    mkdirSync(VIDEO_DIR, { recursive: true })
    const src = probe(source.path)
    if (!src.width) die(`no video stream in ${master}`)
    console.log(`Master: ${master} (${src.width}×${src.height}, ${src.duration.toFixed(0)}s)`)

    // Main web encode. CRF 23 / preset slow ≈ visually transparent for neon
    // content; cap at 1080p (the fixed 3D world sits over it — 4K is wasted
    // bytes). faststart so playback begins before the download completes.
    const main = join(VIDEO_DIR, `${key}.mp4`)
    console.log('Encoding web video…')
    ffmpeg([
      '-i', source.path,
      '-vf', "scale='min(1920,iw)':-2",
      '-c:v', 'libx264', '-profile:v', 'high', '-crf', '23', '-preset', 'slow',
      '-c:a', 'aac', '-b:a', '160k',
      '-movflags', '+faststart',
      main,
    ])
    report(main)

    // Poster frame from ~20% in (past any black-in), matching <key>.jpg wiring.
    const poster = join(VIDEO_DIR, `${key}.jpg`)
    ffmpeg([
      '-ss', String(Math.max(1, src.duration * 0.2)),
      '-i', source.path,
      '-frames:v', '1',
      '-vf', "scale='min(1600,iw)':-2",
      '-q:v', '3',
      poster,
    ])
    report(poster)

    // Muted hover-preview: 6 s from ~15% in, 480p, aggressive CRF — the gallery
    // plays these on hover, so they must be a few hundred KB, not megabytes.
    const preview = join(VIDEO_DIR, `preview-${key}.mp4`)
    ffmpeg([
      '-ss', String(Math.max(0, src.duration * 0.15)),
      '-t', '6',
      '-i', source.path,
      '-vf', "scale='min(854,iw)':-2",
      '-c:v', 'libx264', '-crf', '30', '-preset', 'slow',
      '-an',
      '-movflags', '+faststart',
      preview,
    ])
    report(preview)

    if (mobile) {
      // Lighter phone encode (the launch film picks <key>-mobile.mp4 on small
      // screens so phones never pull the desktop file).
      const mob = join(VIDEO_DIR, `${key}-mobile.mp4`)
      console.log('Encoding mobile variant…')
      ffmpeg([
        '-i', source.path,
        '-vf', "scale='min(854,iw)':-2",
        '-c:v', 'libx264', '-profile:v', 'main', '-crf', '27', '-preset', 'slow',
        '-c:a', 'aac', '-b:a', '96k',
        '-movflags', '+faststart',
        mob,
      ])
      report(mob)
    }
    console.log('✓ done — run `npm run build` and the site picks these up by filename.')
  } finally {
    source.cleanup()
  }
}

function prepAudio(master, nn, { kbps, vbr }) {
  const n = Number(nn)
  if (!Number.isInteger(n) || n < 1 || n > 99) die(`track number must be 1–99, got "${nn}"`)
  const source = resolveSource(master)
  try {
    mkdirSync(AUDIO_DIR, { recursive: true })
    const out = join(AUDIO_DIR, `${String(n).padStart(2, '0')}.mp3`)
    // Default 320 kbps CBR (maximum-practical MP3). --vbr → -q:a 2 (~190 kbps,
    // near-transparent, lighter). --kbps N → a specific CBR rate. Audio only
    // downloads on play, so the larger high-quality file never hits page load.
    const codecArgs = vbr ? ['-q:a', '2'] : ['-b:a', `${kbps || 320}k`]
    console.log(`Encoding track ${n} (${vbr ? '~190 kbps VBR' : `${kbps || 320} kbps CBR`})…`)
    ffmpeg(['-i', source.path, '-vn', '-c:a', 'libmp3lame', ...codecArgs, out])
    report(out)
    console.log('✓ done — the player reads /audio/NN.mp3 by track order, no code changes.')
  } finally {
    source.cleanup()
  }
}

const [mode, master, arg, ...rest] = process.argv.slice(2)
const flags = new Set(rest)
const flagValue = (name) => {
  const i = rest.indexOf(name)
  return i >= 0 ? rest[i + 1] : undefined
}

if (mode === 'video' && master && arg) {
  prepVideo(master, arg, { mobile: flags.has('--mobile') })
} else if (mode === 'audio' && master && arg) {
  const kbpsRaw = flagValue('--kbps')
  const kbps = kbpsRaw ? Number(kbpsRaw) : undefined
  if (kbpsRaw && (!Number.isFinite(kbps) || kbps < 64 || kbps > 320)) die(`--kbps must be 64–320, got "${kbpsRaw}"`)
  prepAudio(master, arg, { kbps, vbr: flags.has('--vbr') })
} else {
  console.log(`Usage:
  node scripts/prepMedia.mjs video <master|url> <key> [--mobile]
  node scripts/prepMedia.mjs audio <master|url> <trackNumber> [--kbps N | --vbr]

Examples:
  node scripts/prepMedia.mjs video ~/Masters/UTOPIA_FINAL.mov launch --mobile
  node scripts/prepMedia.mjs video https://cdn.example.com/OBTAIN.mov visual1
  node scripts/prepMedia.mjs audio "~/Masters/01 UTOPIA.wav" 1            # 320 kbps
  node scripts/prepMedia.mjs audio https://cdn.example.com/01.wav 1 --kbps 256
  node scripts/prepMedia.mjs audio ~/Masters/02.wav 2 --vbr               # lighter

Batch an album (files or URLs, in track order):
  i=1; for f in ~/Masters/*.wav; do node scripts/prepMedia.mjs audio "$f" $i; i=$((i+1)); done`)
  process.exit(mode ? 1 : 0)
}
