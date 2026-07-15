#!/usr/bin/env node
/**
 * prepMedia — turn raw masters into the exact web files this site expects.
 *
 *   VIDEO  node scripts/prepMedia.mjs video <master> <key> [--mobile]
 *          → src/assets/video/<key>.mp4          web encode (H.264, ≤1080p, faststart)
 *          → src/assets/video/<key>.jpg          poster frame
 *          → src/assets/video/preview-<key>.mp4  tiny muted hover-preview clip
 *          → src/assets/video/<key>-mobile.mp4   (with --mobile; lighter phone encode)
 *          The site auto-wires these by filename (import.meta.glob) — using the
 *          key "launch" replaces the launch film; any other key is available to
 *          reference from src/data/videos.ts. Zero code changes needed.
 *
 *   AUDIO  node scripts/prepMedia.mjs audio <master> <trackNumber>
 *          → public/audio/NN.mp3   (~190 kbps VBR — twice the fidelity of the
 *            original 96 kbps encodes; audio is fetched on play, so the larger
 *            file costs nothing at page load)
 *
 * Requires ffmpeg + ffprobe on PATH (or set FFMPEG_DIR to a folder containing
 * both, e.g. a johnvansickle static build). Masters are read-only inputs; the
 * repo never stores them.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
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

function prepVideo(master, key, { mobile }) {
  if (!existsSync(master)) die(`master not found: ${master}`)
  if (!/^[a-z0-9-]+$/.test(key)) die(`key must be lowercase letters/digits/dashes, got "${key}"`)
  mkdirSync(VIDEO_DIR, { recursive: true })
  const src = probe(master)
  if (!src.width) die(`no video stream in ${master}`)
  console.log(`Master: ${master} (${src.width}×${src.height}, ${src.duration.toFixed(0)}s)`)

  // Main web encode. CRF 23 / preset slow ≈ visually transparent for neon
  // content; cap at 1080p (the fixed 3D world sits over it — 4K is wasted
  // bytes). faststart so playback begins before the download completes.
  const main = join(VIDEO_DIR, `${key}.mp4`)
  console.log('Encoding web video…')
  ffmpeg([
    '-i', master,
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
    '-i', master,
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
    '-i', master,
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
      '-i', master,
      '-vf', "scale='min(854,iw)':-2",
      '-c:v', 'libx264', '-profile:v', 'main', '-crf', '27', '-preset', 'slow',
      '-c:a', 'aac', '-b:a', '96k',
      '-movflags', '+faststart',
      mob,
    ])
    report(mob)
  }
  console.log('✓ done — run `npm run build` and the site picks these up by filename.')
}

function prepAudio(master, nn) {
  if (!existsSync(master)) die(`master not found: ${master}`)
  const n = Number(nn)
  if (!Number.isInteger(n) || n < 1 || n > 99) die(`track number must be 1–99, got "${nn}"`)
  mkdirSync(AUDIO_DIR, { recursive: true })
  const out = join(AUDIO_DIR, `${String(n).padStart(2, '0')}.mp3`)
  console.log(`Encoding track ${n}…`)
  // VBR -q:a 2 ≈ 190 kbps — near-transparent MP3 for dense orchestral trap.
  // (The originals were 96 kbps; audio only downloads on play, so the doubled
  // size never touches initial page load.)
  ffmpeg(['-i', master, '-vn', '-c:a', 'libmp3lame', '-q:a', '2', out])
  report(out)
  console.log('✓ done — the player reads /audio/NN.mp3 by track order, no code changes.')
}

const [mode, master, arg, ...rest] = process.argv.slice(2)
const flags = new Set(rest)
if (mode === 'video' && master && arg) prepVideo(master, arg, { mobile: flags.has('--mobile') })
else if (mode === 'audio' && master && arg) prepAudio(master, arg)
else {
  console.log(`Usage:
  node scripts/prepMedia.mjs video <master> <key> [--mobile]
  node scripts/prepMedia.mjs audio <master> <trackNumber>

Examples:
  node scripts/prepMedia.mjs video ~/Masters/UTOPIA_FINAL.mov launch --mobile
  node scripts/prepMedia.mjs video ~/Masters/OBTAIN.mov visual1
  node scripts/prepMedia.mjs audio ~/Masters/01\\ UTOPIA.wav 1

Batch a whole album (files named in track order):
  i=1; for f in ~/Masters/*.wav; do node scripts/prepMedia.mjs audio "$f" $i; i=$((i+1)); done`)
  process.exit(mode ? 1 : 0)
}
