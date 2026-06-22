import { dystopia } from './music'
import { site } from './site'

// Video gallery data. `kind` decides the open behavior:
//  - 'x'        → opens the X/Twitter premiere in a new tab
//  - 'youtube'  → opens an embedded lightbox (set `embedId`)
//  - 'vimeo'    → opens an embedded lightbox (set `embedId`)
//  - 'soon'     → placeholder card, not yet released
export type VideoKind = 'x' | 'youtube' | 'vimeo' | 'soon'

export type Video = {
  id: string
  title: string
  subtitle: string
  kind: VideoKind
  date: string
  cover: string
  url?: string
  embedId?: string
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

export const videos: Video[] = [
  {
    id: 'dystopia-mv-card',
    title: 'DYSTØPIA — Official Video',
    subtitle: 'Title track',
    kind: 'x',
    date: '2026',
    cover: dystopia.coverSmall,
    url: site.links.video,
  },
  {
    id: 'utopia-visualizer',
    title: 'UTØPIA — Visualizer',
    subtitle: 'Track 01',
    kind: 'soon',
    date: 'Soon',
    cover: dystopia.coverSmall,
  },
  {
    id: 'warsong-teaser',
    title: 'WARSØNG — Teaser',
    subtitle: 'The prequel',
    kind: 'soon',
    date: 'Soon',
    cover: dystopia.coverSmall,
  },
  {
    id: 'live-av-recap',
    title: 'Live A/V — Recap',
    subtitle: 'DYSTØPIA set',
    kind: 'soon',
    date: 'Soon',
    cover: dystopia.coverSmall,
  },
]

export function embedUrl(v: Video): string | null {
  if (v.kind === 'youtube' && v.embedId)
    return `https://www.youtube.com/embed/${v.embedId}?autoplay=1&rel=0`
  if (v.kind === 'vimeo' && v.embedId)
    return `https://player.vimeo.com/video/${v.embedId}?autoplay=1`
  return null
}
