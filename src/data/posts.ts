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
    id: 'dystopia-out',
    category: 'DROP',
    date: 'Apr 20, 2026',
    title: 'DYSTØPIA Arrives',
    excerpt: 'Twenty tracks tracing the fall from UTØPIA to DYSTØPIA. Out now on Bandcamp.',
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
