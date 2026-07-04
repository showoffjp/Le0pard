import type { FactionGlow } from './factions'

export type DropStatus = 'live' | 'locked'

export type Drop = {
  id: string
  title: string
  kind: string
  /** ISO datetime the drop goes (or went) live. */
  date: string
  status: DropStatus
  blurb: string
  /** Where a live drop sends you (external url or in-page #anchor). */
  href?: string
  glow: FactionGlow
}

/**
 * The next scheduled transmission the big countdown targets. Edit this date (and
 * the matching locked drop below) to schedule the next drop — when it passes,
 * the countdown flips to "TRANSMITTING NOW".
 */
export const NEXT_DROP_ISO = '2026-07-18T20:00:00Z'

// Newest first. `live` drops link out; `locked` drops are teased until their date.
export const drops: Drop[] = [
  {
    id: 'warsong',
    title: 'WARSØNG — First Transmission',
    kind: 'Prequel',
    date: NEXT_DROP_ISO,
    status: 'locked',
    blurb: 'The opening salvo before DYSTØPIA. Orchestral trap forged for the front line.',
    glow: 'ember',
  },
  {
    id: 'visuals-vol1',
    title: 'Per-Track Visuals — Vol. I',
    kind: 'World',
    date: '2026-07-04T20:00:00Z',
    status: 'live',
    blurb: 'A 3D scene for every track — play any song and the whole world shifts with it. Live now.',
    href: '#album',
    glow: 'cyan',
  },
  {
    id: 'live-av',
    title: 'The DYSTØPIA Live A/V Set',
    kind: 'Live',
    date: '2026-09-12T20:00:00Z',
    status: 'locked',
    blurb: 'Sound and the 3D world as one. First wave loading.',
    glow: 'purple',
  },
  {
    id: 'album',
    title: 'DYSTØPIA — The Album',
    kind: 'Album',
    date: '2026-04-20T20:00:00Z',
    status: 'live',
    blurb: 'Twenty tracks tracing the fall from UTØPIA to DYSTØPIA. Out now.',
    href: 'https://leopardomusic.bandcamp.com/album/dyst-pia',
    glow: 'blue',
  },
  {
    id: 'launch-film',
    title: 'DYSTØPIA — Launch Film',
    kind: 'Film',
    date: '2026-04-20T20:00:00Z',
    status: 'live',
    blurb: 'The cinematic premiere that opens the experience.',
    href: '#video',
    glow: 'cyan',
  },
]
