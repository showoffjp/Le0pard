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

export const featuredVideo: Video = {
  id: 'dystopia-mv',
  title: 'DYSTØPIA',
  subtitle: `Official Music Video · ${site.artist}`,
  kind: 'x',
  date: 'Apr 18, 2026',
  cover: dystopia.cover,
  url: site.links.video,
}

// ── Google Drive embeds ───────────────────────────────────────────────────────
// Each Drive file must be shared as "Anyone with the link → Viewer" for the
// /preview embed to play. Rename the titles/subtitles below to taste.
export const videos: Video[] = [
  {
    id: 'drive-visual-1',
    title: 'DYSTØPIA — Visual I',
    subtitle: 'Drive premiere',
    kind: 'drive',
    date: '2026',
    cover: dystopia.coverSmall,
    driveId: '1SbjcrJjCF-0RxUHuiXFoPUFq9ba45TWQ',
  },
  {
    id: 'drive-visual-2',
    title: 'DYSTØPIA — Visual II',
    subtitle: 'Drive premiere',
    kind: 'drive',
    date: '2026',
    cover: dystopia.coverSmall,
    driveId: '1eyPOEitMzne6AsO2b3kZqwEH20X78m1x',
  },
  {
    id: 'drive-visual-3',
    title: 'DYSTØPIA — Visual III',
    subtitle: 'Drive premiere',
    kind: 'drive',
    date: '2026',
    cover: dystopia.coverSmall,
    driveId: '1O95QuayBocuCJ6VqkT3nGsPsVc0YqPZ9',
  },
  {
    id: 'drive-launch-film',
    title: 'DYSTØPIA — Launch Film',
    subtitle: 'Auto-plays on entry',
    kind: 'drive',
    date: '2026',
    cover: dystopia.coverSmall,
    driveId: '1ciDgOEjvL9Vd1AWNwkT2v0vo4i49N3kS',
  },
]

/**
 * The film that auto-plays when the site launches and drives the reactive
 * visualizer (same path as the songs). Drive can't autoplay-with-sound or be
 * audio-analyzed cross-origin, so the LaunchVideo component prefers a
 * self-hosted file dropped in `src/assets/video/` (see that folder's README);
 * the Drive id is the gallery fallback so the film is always watchable.
 */
export const launchVideo: Video = videos[videos.length - 1]

export function embedUrl(v: Video): string | null {
  if (v.kind === 'youtube' && v.embedId)
    return `https://www.youtube.com/embed/${v.embedId}?autoplay=1&rel=0`
  if (v.kind === 'vimeo' && v.embedId)
    return `https://player.vimeo.com/video/${v.embedId}?autoplay=1`
  if (v.kind === 'drive' && v.driveId)
    return `https://drive.google.com/file/d/${v.driveId}/preview`
  return null
}
