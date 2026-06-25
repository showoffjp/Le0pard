export type Track = {
  n: number
  title: string
  duration: string // "m:ss"
}

export type Album = {
  id: string
  title: string
  era: 'utopia' | 'dystopia' | 'war'
  year: number
  date: string
  cover: string
  coverSmall: string
  bandcampUrl: string
  bandcampEmbedId?: string
  blurb: string
  tracks: Track[]
}

const dystopiaTracks: Track[] = [
  { n: 1, title: 'UTØPIA', duration: '5:14' },
  { n: 2, title: 'CØNUNDRUM', duration: '3:08' },
  { n: 3, title: 'DISTØRT', duration: '2:58' },
  { n: 4, title: 'FACTIØN', duration: '3:19' },
  { n: 5, title: 'NØTICE', duration: '3:04' },
  { n: 6, title: 'NØMAD', duration: '4:02' },
  { n: 7, title: 'SØUL', duration: '3:14' },
  { n: 8, title: 'TAKEDØWN', duration: '3:09' },
  { n: 9, title: 'TRACTIØN', duration: '3:17' },
  { n: 10, title: 'MEHTØPIA', duration: '3:47' },
  { n: 11, title: 'ATØNE', duration: '3:05' },
  { n: 12, title: 'GHØST', duration: '3:07' },
  { n: 13, title: 'MØTIVATE', duration: '3:26' },
  { n: 14, title: 'CLØSURE', duration: '4:04' },
  { n: 15, title: 'ABSCØND', duration: '2:34' },
  { n: 16, title: 'PØLAR', duration: '3:14' },
  { n: 17, title: 'TRADITIØN', duration: '3:02' },
  { n: 18, title: 'BØAST', duration: '2:57' },
  { n: 19, title: 'SACRIMØNY', duration: '2:29' },
  { n: 20, title: 'DYSTØPIA', duration: '4:01' },
]

export const dystopia: Album = {
  id: 'dystopia',
  title: 'DYSTØPIA',
  era: 'dystopia',
  year: 2026,
  date: 'April 20, 2026',
  cover: '/img/dystopia-cover.jpg',
  coverSmall: '/img/dystopia-cover-700.jpg',
  bandcampUrl: 'https://leopardomusic.bandcamp.com/album/dyst-pia',
  bandcampEmbedId: '2599802161',
  blurb:
    'Twenty tracks tracing the fall from UTØPIA to DYSTØPIA — cinematic brass and strings detonating over heavy 808s and war-drum trap.',
  tracks: dystopiaTracks,
}

export const warsong: Album = {
  id: 'warsong',
  title: 'WARSØNG',
  era: 'war',
  year: 2026,
  date: 'February 2026',
  cover: '/img/dystopia-cover-350.jpg',
  coverSmall: '/img/dystopia-cover-350.jpg',
  bandcampUrl: 'https://leopardomusic.bandcamp.com/',
  blurb: 'The opening salvo — orchestral trap forged for the front line.',
  tracks: [],
}

export const albums: Album[] = [dystopia, warsong]

/** Total runtime helper for stat displays. */
export function albumRuntime(album: Album): { minutes: number; label: string } {
  const seconds = album.tracks.reduce((sum, t) => {
    const [m, s] = t.duration.split(':').map(Number)
    return sum + m * 60 + s
  }, 0)
  const minutes = Math.round(seconds / 60)
  return { minutes, label: `${minutes} min` }
}

/** Self-hosted audio path for a track (in /public/audio, numbered by order). */
export function trackAudioUrl(track: Track): string {
  return `/audio/${String(track.n).padStart(2, '0')}.mp3`
}
