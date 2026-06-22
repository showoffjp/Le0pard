// Storefront — the single source of truth for everything LEOPARDØ sells.
//
// ── PAYMENT WIRING (read me) ─────────────────────────────────────────────────
//  • MUSIC  → routed through Bandcamp, which already sells lossless FLAC/ALAC/WAV
//    + handles secure checkout and instant download delivery. Album buys point at
//    `dystopia.bandcampUrl`. For a per-track FLAC buy link, drop the track's own
//    Bandcamp track-page URL into TRACK_BUY_OVERRIDES below.
//  • MERCH  → each product has an optional `buyUrl`. Paste in a Stripe Payment
//    Link ("https://buy.stripe.com/…") or a Printful / Printify product URL.
//    Until one is set, the Buy button falls back to STORE_CONFIG.fallbackUrl so
//    nothing ever 404s.
//
// No secrets live in this repo — Stripe Payment Links + Bandcamp are just URLs,
// so the store goes fully live the moment you replace the placeholders.
// ─────────────────────────────────────────────────────────────────────────────

import { dystopia, type Track } from './music'

export const STORE_CONFIG = {
  currency: 'USD',
  /** Where a not-yet-wired Buy button points. Defaults to the Bandcamp page. */
  fallbackUrl: dystopia.bandcampUrl,
  /** Optional hosted storefront landing (Stripe storefront / Printful, etc.). */
  storeUrl: dystopia.bandcampUrl,
} as const

/* ───────────────────────────────── MUSIC ──────────────────────────────────── */

export type MusicTier = {
  id: string
  name: string
  format: string
  formats: string[]
  price: string
  blurb: string
  url: string
  highlight?: boolean
}

export const musicTiers: MusicTier[] = [
  {
    id: 'album-flac',
    name: 'DYSTØPIA — Full Album',
    format: 'FLAC · 24-bit Lossless',
    formats: ['FLAC', 'ALAC', 'WAV', '320 MP3'],
    price: '$9.50+',
    blurb:
      'All 20 tracks in studio-grade lossless, plus instant streaming and the full digital booklet.',
    url: dystopia.bandcampUrl,
    highlight: true,
  },
  {
    id: 'single-track',
    name: 'Single Tracks',
    format: 'FLAC · Per-Track',
    formats: ['FLAC', '320 MP3'],
    price: '$1.00+',
    blurb: 'Cherry-pick any track in lossless — choose a title below to grab it on its own.',
    url: dystopia.bandcampUrl,
  },
]

/**
 * Point a track's Buy link straight at its Bandcamp track page.
 * e.g. { 'DYSTØPIA': 'https://leopardomusic.bandcamp.com/track/dyst-pia' }
 * Anything not listed falls back to the album page.
 */
export const TRACK_BUY_OVERRIDES: Record<string, string> = {}

export function trackBuyUrl(track: Track): string {
  return TRACK_BUY_OVERRIDES[track.title] ?? dystopia.bandcampUrl
}

/* ───────────────────────────────── MERCH ──────────────────────────────────── */

export type MerchCategory = 'apparel' | 'headwear' | 'print' | 'accessory'
export type MerchMotif = 'cover' | 'wordmark' | 'goggle' | 'flame' | 'octagon'
export type Glow = 'purple' | 'blue' | 'cyan' | 'ember' | 'mix'

export type MerchItem = {
  id: string
  name: string
  category: MerchCategory
  /** Short product-type tag shown on the art plate, e.g. "Tee", "Dad Hat". */
  typeLabel: string
  price: number
  blurb: string
  motif: MerchMotif
  glow: Glow
  badge?: string
  /** Drop a real product photo path here to replace the rendered mock. */
  image?: string
  /** Stripe Payment Link or Printful product URL. */
  buyUrl?: string
}

export const merch: MerchItem[] = [
  {
    id: 'tee-dystopia',
    name: 'DYSTØPIA Album Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 34,
    blurb: 'Heavyweight black tee with the full DYSTØPIA cover art screened across the front.',
    motif: 'cover',
    glow: 'mix',
    badge: 'Bestseller',
  },
  {
    id: 'tee-goggle',
    name: 'Neon Visor Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 32,
    blurb: 'The leopard visor glyph in glowing neon — minimal front hit, oversized back print.',
    motif: 'goggle',
    glow: 'cyan',
  },
  {
    id: 'hoodie-flame',
    name: 'Flame Wordmark Hoodie',
    category: 'apparel',
    typeLabel: 'Hoodie',
    price: 68,
    blurb: 'Premium heavyweight hoodie with the embered Ø flame wordmark stitched at the chest.',
    motif: 'flame',
    glow: 'ember',
    badge: 'Heavyweight',
  },
  {
    id: 'hat-dad',
    name: 'LEOPARDØ Dad Hat',
    category: 'headwear',
    typeLabel: 'Dad Hat',
    price: 30,
    blurb: 'Unstructured cotton cap, low profile, with the embroidered LEOPARDØ wordmark.',
    motif: 'wordmark',
    glow: 'purple',
  },
  {
    id: 'hat-snapback',
    name: 'Octagon Snapback',
    category: 'headwear',
    typeLabel: 'Snapback',
    price: 34,
    blurb: 'Structured snapback with the octagonal tech-frame embroidered in violet thread.',
    motif: 'octagon',
    glow: 'cyan',
    badge: 'New',
  },
  {
    id: 'poster-dystopia',
    name: 'DYSTØPIA Tour Poster',
    category: 'print',
    typeLabel: '18×24 Print',
    price: 25,
    blurb: 'Museum-grade giclée print of the album key art on heavyweight matte stock.',
    motif: 'cover',
    glow: 'mix',
  },
  {
    id: 'pin-octagon',
    name: 'Octagon Enamel Pin',
    category: 'accessory',
    typeLabel: 'Pin',
    price: 12,
    blurb: 'Hard-enamel pin of the signature tech-frame with a glow-in-the-dark core.',
    motif: 'octagon',
    glow: 'purple',
  },
  {
    id: 'stickers',
    name: 'Sticker Pack',
    category: 'accessory',
    typeLabel: 'Stickers',
    price: 9,
    blurb: 'Five weatherproof die-cut vinyls — visor, wordmark, octagon, flame and cover.',
    motif: 'goggle',
    glow: 'blue',
  },
]

export const merchCategories: { id: MerchCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'print', label: 'Prints' },
  { id: 'accessory', label: 'Extras' },
]

export function merchBuyUrl(item: MerchItem): string {
  return item.buyUrl ?? STORE_CONFIG.fallbackUrl
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}
