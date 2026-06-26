import { useEffect } from 'react'
import { dystopia } from '../data/music'
import { site } from '../data/site'

/** "5:14" → ISO-8601 "PT5M14S" for schema.org durations. */
function isoDuration(d: string): string {
  const [m, s] = d.split(':').map(Number)
  return `PT${m || 0}M${s || 0}S`
}

/**
 * schema.org JSON-LD (MusicGroup + MusicAlbum with its tracks) so search engines
 * and social cards can show rich results for the artist and album. Built from the
 * site/music data (single source of truth) and injected into <head>; uses the
 * live origin so the URLs are correct on whatever domain serves the site.
 */
export function StructuredData() {
  useEffect(() => {
    const origin = window.location.origin
    const artist = {
      '@type': 'MusicGroup',
      '@id': `${origin}/#artist`,
      name: site.artist,
      url: origin,
      genre: site.genres as unknown as string[],
      description: site.bio,
      foundingLocation: site.location,
      sameAs: [site.links.bandcampArtist],
    }
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        artist,
        {
          '@type': 'MusicAlbum',
          '@id': `${origin}/#album-dystopia`,
          name: dystopia.title,
          byArtist: { '@id': `${origin}/#artist` },
          numTracks: dystopia.tracks.length,
          datePublished: '2026-04-20',
          image: `${origin}${dystopia.cover}`,
          genre: site.genres as unknown as string[],
          url: dystopia.bandcampUrl,
          description: dystopia.blurb,
          track: {
            '@type': 'ItemList',
            numberOfItems: dystopia.tracks.length,
            itemListElement: dystopia.tracks.map((t) => ({
              '@type': 'ListItem',
              position: t.n,
              item: {
                '@type': 'MusicRecording',
                name: t.title,
                duration: isoDuration(t.duration),
                byArtist: { '@id': `${origin}/#artist` },
              },
            })),
          },
        },
      ],
    }
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'ld-json-leopardo'
    el.text = JSON.stringify(data)
    document.getElementById('ld-json-leopardo')?.remove()
    document.head.appendChild(el)
    return () => {
      document.getElementById('ld-json-leopardo')?.remove()
    }
  }, [])
  return null
}
