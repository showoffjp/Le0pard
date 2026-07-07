import { dystopia } from './music'
import { site } from './site'

// Video gallery data. `kind` decides the open behavior:
//  - 'x'        → opens the X/Twitter premiere in a new tab
//  - 'youtube'  → opens an embedded lightbox (set `embedId`)
//  - 'vimeo'    → opens an embedded lightbox (set `embedId`)
//  - 'drive'    → plays a self-hosted file if present, else the Drive /preview embed
//  - 'soon'     → placeholder card, not yet released
export type VideoKind = 'x' | 'youtube' | 'vimeo' | 'drive' | 'soon'

export type Video = {
  id: string
  title: string
  subtitle: string
  kind: VideoKind
  date: string
  cover: string
  url?: string
  embedId?: string
  /** Google Drive file id (the long token in /file/d/<id>/view). */
  driveId?: string
  /** A self-hosted, web-optimized file (src/assets/video/<key>.mp4). Wins over Drive. */
  file?: string
  /** A tiny muted clip for gallery hover-previews (src/assets/video/preview-<key>.mp4). */
  preview?: string
}

// ── Self-hosted assets (web-optimized MP4s + poster frames) ───────────────────
// Drop <key>.mp4 + <key>.jpg in src/assets/video/ and they're used directly,
// with no dependency on Google Drive's embed player.
const FILES = import.meta.glob('../assets/video/*.{mp4,webm}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const POSTERS = import.meta.glob('../assets/video/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
function asset(map: Record<string, string>, key: string): string | undefined {
  for (const [path, url] of Object.entries(map)) {
    const base = path.split('/').pop()?.replace(/\.[^.]+$/, '')
    if (base === key) return url
  }
  return undefined
}

/** A real poster frame straight from the Drive file (needs link-sharing on). */
export function driveThumb(id: string, w = 1600): string {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
}

/** Fallback poster when neither a self-hosted nor Drive thumbnail is available. */
export const POSTER_FALLBACK = dystopia.cover

// ── Drive file ids + their self-hosted asset keys ─────────────────────────────
const DRIVE = {
  visual1: '1SbjcrJjCF-0RxUHuiXFoPUFq9ba45TWQ',
  visual2: '1eyPOEitMzne6AsO2b3kZqwEH20X78m1x',
  visual3: '1O95QuayBocuCJ6VqkT3nGsPsVc0YqPZ9',
  launch: '1ciDgOEjvL9Vd1AWNwkT2v0vo4i49N3kS',
}

/**
 * Build a video. Source precedence for each asset: an explicit hosted URL wins,
 * then the self-hosted file in src/assets/video/<key>.*, then Drive.
 *
 * To use a CDN-hosted film (Cloudflare R2, Vercel Blob, …) instead of committing
 * a large file to the repo, pass its absolute URL as `fileUrl` (+ `previewUrl` /
 * `coverUrl`). `driveId` is optional — omit it for a film that isn't on Drive.
 */
function film(p: {
  id: string
  title: string
  subtitle: string
  date: string
  key: string
  driveId?: string
  /** Absolute URL of a hosted MP4 (overrides the local <key>.mp4). */
  fileUrl?: string
  /** Absolute URL of a hosted hover-preview clip. */
  previewUrl?: string
  /** Absolute URL of a hosted poster frame. */
  coverUrl?: string
}): Video {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    kind: 'drive',
    date: p.date,
    driveId: p.driveId,
    file: p.fileUrl ?? asset(FILES, p.key),
    preview: p.previewUrl ?? asset(FILES, `preview-${p.key}`),
    cover: p.coverUrl ?? asset(POSTERS, p.key) ?? (p.driveId ? driveThumb(p.driveId) : POSTER_FALLBACK),
  }
}

/**
 * The hero of the Video section — the launch film. It also auto-plays on entry
 * and drives the reactive visualizer (see LaunchVideo). Rename the title any time.
 */
export const featuredVideo: Video = film({
  id: 'drive-launch-film',
  title: 'DYSTØPIA — Launch Film',
  subtitle: 'Premiere · auto-plays on entry',
  date: '2026',
  key: 'launch',
  driveId: DRIVE.launch,
})

/** Kept accessible as a secondary action — the X/Twitter premiere. */
export const officialVideo: Video = {
  id: 'dystopia-mv',
  title: 'DYSTØPIA — Official Music Video',
  subtitle: `On X · ${site.artist}`,
  kind: 'x',
  date: 'Apr 18, 2026',
  cover: dystopia.cover,
  url: site.links.video,
}

// ── Gallery ───────────────────────────────────────────────────────────────────
// Self-hosted first (native <video>), Drive /preview as fallback. Rename titles
// to the real film names any time.
export const videos: Video[] = [
  film({ id: 'drive-visual-1', title: 'DYSTØPIA — Visual I', subtitle: 'The world ignites', date: '2026', key: 'visual1', driveId: DRIVE.visual1 }),
  film({ id: 'drive-visual-2', title: 'DYSTØPIA — Visual II', subtitle: 'Descent', date: '2026', key: 'visual2', driveId: DRIVE.visual2 }),
  film({ id: 'drive-visual-3', title: 'DYSTØPIA — Visual III', subtitle: 'Aftermath', date: '2026', key: 'visual3', driveId: DRIVE.visual3 }),
  officialVideo,
]

/** The film LaunchVideo auto-plays on entry (same id as the featured hero). */
export const launchVideo: Video = featuredVideo

export function embedUrl(v: Video): string | null {
  if (v.kind === 'youtube' && v.embedId)
    return `https://www.youtube.com/embed/${v.embedId}?autoplay=1&rel=0`
  if (v.kind === 'vimeo' && v.embedId)
    return `https://player.vimeo.com/video/${v.embedId}?autoplay=1`
  if (v.kind === 'drive' && v.driveId)
    return `https://drive.google.com/file/d/${v.driveId}/preview`
  return null
}
