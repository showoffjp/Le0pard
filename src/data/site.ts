// Real artist + release metadata (sourced from leopardomusic.bandcamp.com)
export const site = {
  artist: 'LEOPARDØ',
  album: 'DYSTØPIA',
  tagline: 'Symphonic trap from a burning future.',
  location: 'Charleston, South Carolina',
  releaseDate: 'April 20, 2026',
  releaseYear: 2026,
  description:
    'Massive cinematic horns and strings smashing straight into those heavy 808s and sharp trap beats, all soaked in hard-hitting oriental melodies that feel like ancient war drums pounding through a burning future.',
  bio:
    'LEOPARDØ is a producer and artist redefining the soundscape with a bold fusion of raw energy and symphonic grandeur — trap’s gritty, bass-heavy rhythms welded to sweeping orchestral arrangements.',
  genres: ['Electronic', 'Trap', 'Brass Trap', 'Epic / Cinematic', 'Orchestral'],
  links: {
    bandcamp: 'https://leopardomusic.bandcamp.com/album/dyst-pia',
    bandcampArtist: 'https://leopardomusic.bandcamp.com/',
    video: 'https://x.com/i/status/2046436853092319257',
  },
} as const

export type Site = typeof site
