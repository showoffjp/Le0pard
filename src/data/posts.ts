import { site } from './site'

// Editable news/drops/promotions feed. Swap copy + links freely; `href` is
// optional — omit it to render a "Soon" badge instead of a link.
export type PostCategory = 'DROP' | 'VIDEO' | 'NEWS' | 'PROMO' | 'SHOW'

export type Post = {
  id: string
  category: PostCategory
  date: string
  title: string
  excerpt: string
  href?: string
  /** Full article body (paragraphs). When set, the card opens an in-page reader. */
  body?: string[]
  /** Optional in-reader call-to-action. */
  cta?: { label: string; href: string }
}

export type Promo = {
  badge: string
  title: string
  body: string
  cta: { label: string; href: string }
}

export const featuredPromo: Promo = {
  badge: 'Out Now',
  title: 'DYSTØPIA is streaming everywhere',
  body: 'The full 20-track descent from UTØPIA to DYSTØPIA — cinematic brass and strings over war-drum trap. Stream it, then own it in lossless.',
  cta: { label: 'Stream / Buy', href: site.links.bandcamp },
}

export const posts: Post[] = [
  {
    id: 'track-series',
    category: 'DROP',
    date: 'Now Live',
    title: 'A Tee For Every Song',
    excerpt:
      'The Track Series just dropped — a neon-typographic tee (and art print) for all 20 songs, colored from cool UTØPIA to burning DYSTØPIA.',
    body: [
      'Every track on DYSTØPIA now has its own piece. The Track Series is twenty neon-typographic tees — one for each song — each rendered in living type and printed on heavyweight black.',
      'The catch: the whole run is colored along the album’s arc. UTØPIA and the early tracks glow cool cyan and blue; the middle shifts through violet; and by SACRIMØNY and DYSTØPIA the type itself is on fire. Line them up and you’re looking at the fall from utopia to ruin.',
      'Each design comes as a tee and a matching art print, so you can wear the song or frame it. Tap into the Track Series filter in the store to see all forty.',
    ],
    cta: { label: 'Shop the Track Series', href: '#store' },
    href: '#store',
  },
  {
    id: 'store-expanded',
    category: 'PROMO',
    date: 'New',
    title: 'The Store Just Went Massive',
    excerpt:
      '100+ drops across apparel, drinkware, tech, prints, home, vinyl, bundles and a full seasonal run. Shop the whole catalog on-site.',
    body: [
      'The shop is no longer a handful of tees. It’s a full storefront now — well over a hundred and fifty drops across apparel, headwear, drinkware, tech, prints, home goods, physical music and multi-item bundles.',
      'Highlights: the per-song Track Series, vinyl (including a limited ember-splatter pressing), a collector box set, a seasonal capsule, and a stack of on-brand designs — from the octagon tech-frame to the oriental mandala and the neon eclipse.',
      'Every product opens a quick-view with sizes, and the whole thing is filterable by category. Dig in.',
    ],
    cta: { label: 'Browse the store', href: '#store' },
    href: '#store',
  },
  {
    id: 'dystopia-out',
    category: 'DROP',
    date: 'Apr 20, 2026',
    title: 'DYSTØPIA Arrives',
    excerpt: 'Twenty tracks tracing the fall from UTØPIA to DYSTØPIA. Out now on Bandcamp.',
    body: [
      'DYSTØPIA is out. Twenty tracks tracing one descent — from the hopeful sprawl of UTØPIA to the burning skyline of the title track.',
      'It’s symphonic trap at full scale: massive cinematic horns and strings smashing straight into heavy 808s, all soaked in oriental melodies that move like ancient war drums through a collapsing future.',
      'Stream it, then own it in lossless — FLAC, ALAC, WAV and 320 on Bandcamp.',
    ],
    cta: { label: 'Stream / Buy', href: site.links.bandcamp },
    href: site.links.bandcamp,
  },
  {
    id: 'video-premiere',
    category: 'VIDEO',
    date: 'Apr 18, 2026',
    title: 'Official DYSTØPIA Video',
    excerpt: 'The cinematic visual for the title track — a burning skyline and a future on the brink.',
    href: site.links.video,
  },
  {
    id: 'warsong',
    category: 'NEWS',
    date: 'Feb 2026',
    title: 'WARSØNG: Where It Began',
    excerpt: 'Revisit the opening salvo — the orchestral-trap blueprint that lit the fuse.',
    href: site.links.bandcampArtist,
  },
  {
    id: 'vinyl',
    category: 'PROMO',
    date: 'Coming Soon',
    title: 'Limited Holographic Vinyl',
    excerpt: 'A short run of neon-etched DYSTØPIA vinyl, pressed for the faithful. Drop incoming.',
  },
  {
    id: 'live-av',
    category: 'SHOW',
    date: 'TBA',
    title: 'Live A/V Experience',
    excerpt: 'DYSTØPIA reimagined as an immersive audiovisual set — sound and the burning city as one.',
  },
  {
    id: 'origins',
    category: 'NEWS',
    date: 'Jan 2026',
    title: 'From Charleston to the Future',
    excerpt: 'The story behind the symphonic-trap fusion — ancient war drums for a collapsing tomorrow.',
    href: site.links.bandcampArtist,
  },
]
