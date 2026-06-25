import { dystopia } from './music'
import { site } from './site'

// Video gallery data. `kind` decides the open behavior:
//  - 'x'        → opens the X/Twitter premiere in a new tab
//  - 'youtube'  → opens an embedded lightbox (set `embedId`)
//  - 'vimeo'    → opens an embedded lightbox (set `embedId`)
//  - 'drive'    → opens an embedded lightbox playing a Google Drive file (set `driveId`)
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
}

/** A real poster frame straight from the Drive file (needs link-sharing on). */
export function driveThumb(id: string, w = 1600): string {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
}

/** Fallback poster when a Drive thumbnail can't load (e.g. sharing not yet set). */
export const POSTER_FALLBACK = dystopia.cover

// ── Drive file ids ────────────────────────────────────────────────────────────
const DRIVE = {
  visual1: '1SbjcrJjCF-0RxUHuiXFoPUFq9ba45TWQ',
  visual2: '1eyPOEitMzne6AsO2b3kZqwEH20X78m1x',
  visual3: '1O95QuayBocuCJ6VqkT3nGsPsVc0YqPZ9',
  launch: '1ciDgOEjvL9Vd1AWNwkT2v0vo4i49N3kS',
}

/**
 * The hero of the Video section — the launch film. It also auto-plays on entry
 * and drives the reactive visualizer (see LaunchVideo). Rename the title/subtitle
 * to the real film name any time.
 */
export const featuredVideo: Video = {
  id: 'drive-launch-film',
  title: 'DYSTØPIA — Launch Film',
  subtitle: 'Premiere · auto-plays on entry',
  kind: 'drive',
  date: '2026',
  cover: driveThumb(DRIVE.launch),
  driveId: DRIVE.launch,
}

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

// ── Gallery (Google Drive embeds) ─────────────────────────────────────────────
// Each Drive file must be shared "Anyone with the link → Viewer" so both the
// /preview embed and the poster thumbnail load. Rename titles/subtitles to taste.
export const videos: Video[] = [
  {
    id: 'drive-visual-1',
    title: 'DYSTØPIA — Visual I',
    subtitle: 'The world ignites',
    kind: 'drive',
    date: '2026',
    cover: driveThumb(DRIVE.visual1),
    driveId: DRIVE.visual1,
  },
  {
    id: 'drive-visual-2',
    title: 'DYSTØPIA — Visual II',
    subtitle: 'Descent',
    kind: 'drive',
    date: '2026',
    cover: driveThumb(DRIVE.visual2),
    driveId: DRIVE.visual2,
  },
  {
    id: 'drive-visual-3',
    title: 'DYSTØPIA — Visual III',
    subtitle: 'Aftermath',
    kind: 'drive',
    date: '2026',
    cover: driveThumb(DRIVE.visual3),
    driveId: DRIVE.visual3,
  },
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
