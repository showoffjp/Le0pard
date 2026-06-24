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

export type MerchCategory = 'apparel' | 'headwear' | 'drinkware' | 'print' | 'tech' | 'accessory' | 'home'
export type MerchMotif =
  | 'cover'
  | 'wordmark'
  | 'goggle'
  | 'flame'
  | 'octagon'
  | 'grid'
  | 'waveform'
  | 'orbit'
  | 'circuit'
  | 'glitch'
  | 'monogram'
  | 'barcode'
  | 'duality'
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
  /* ── Apparel ──────────────────────────────────────────────────────────── */
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
    id: 'tee-glitch',
    name: 'System Failure Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 34,
    blurb: 'RGB-split glitched DYSTØPIA wordmark — a corrupted-signal hit on midweight black.',
    motif: 'glitch',
    glow: 'mix',
    badge: 'New',
  },
  {
    id: 'tee-waveform',
    name: 'Equalizer Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 33,
    blurb: 'The reactive spectrum frozen in neon — a tall waveform bar print front and center.',
    motif: 'waveform',
    glow: 'blue',
  },
  {
    id: 'tank-barcode',
    name: 'Barcode Tank',
    category: 'apparel',
    typeLabel: 'Tank',
    price: 28,
    blurb: 'Breathable summer-fest tank with the LEOPARDØ // DYSTØPIA barcode down the front.',
    motif: 'barcode',
    glow: 'cyan',
  },
  {
    id: 'longsleeve-circuit',
    name: 'Circuit Long Sleeve',
    category: 'apparel',
    typeLabel: 'Long Sleeve',
    price: 42,
    blurb: 'Circuit-trace artwork on the chest with patterned ink running down both sleeves.',
    motif: 'circuit',
    glow: 'cyan',
  },
  {
    id: 'crew-monogram',
    name: 'LØ Monogram Crewneck',
    category: 'apparel',
    typeLabel: 'Crewneck',
    price: 54,
    blurb: 'Mid-heavy fleece crew with the gradient LØ monogram embroidered over the heart.',
    motif: 'monogram',
    glow: 'purple',
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
    id: 'hoodie-orbit',
    name: 'Orbit Rings Hoodie',
    category: 'apparel',
    typeLabel: 'Hoodie',
    price: 70,
    blurb: 'The interwoven gyroscope rings printed big across the back, glowing violet on black.',
    motif: 'orbit',
    glow: 'purple',
    badge: 'Fan Fave',
  },
  {
    id: 'zip-duality',
    name: 'UTØPIA / DYSTØPIA Zip Hoodie',
    category: 'apparel',
    typeLabel: 'Zip Hoodie',
    price: 76,
    blurb: 'Full-zip split down the journey — cool UTØPIA left, burning DYSTØPIA right.',
    motif: 'duality',
    glow: 'mix',
    badge: 'Limited',
  },

  /* ── Headwear ─────────────────────────────────────────────────────────── */
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
  },
  {
    id: 'beanie-visor',
    name: 'Visor Cuff Beanie',
    category: 'headwear',
    typeLabel: 'Beanie',
    price: 28,
    blurb: 'Ribbed cuffed beanie with the neon visor glyph woven into a tonal patch.',
    motif: 'goggle',
    glow: 'cyan',
  },
  {
    id: 'bucket-orbit',
    name: 'Orbit Bucket Hat',
    category: 'headwear',
    typeLabel: 'Bucket Hat',
    price: 36,
    blurb: 'Reversible bucket hat with the orbit-ring motif all-over on one side, blackout on the other.',
    motif: 'orbit',
    glow: 'blue',
    badge: 'New',
  },
  {
    id: 'trucker-flame',
    name: 'Flame Trucker',
    category: 'headwear',
    typeLabel: 'Trucker',
    price: 32,
    blurb: 'Foam-front trucker with mesh back and the embered Ø flame patch stitched on.',
    motif: 'flame',
    glow: 'ember',
  },

  /* ── Drinkware ────────────────────────────────────────────────────────── */
  {
    id: 'tumbler-cover',
    name: 'DYSTØPIA Insulated Tumbler',
    category: 'drinkware',
    typeLabel: '20oz Tumbler',
    price: 32,
    blurb: 'Double-wall vacuum 20oz tumbler wrapped in the album key art — keeps it cold 24h.',
    motif: 'cover',
    glow: 'mix',
    badge: 'New',
  },
  {
    id: 'bottle-flame',
    name: 'Flame Ø Water Bottle',
    category: 'drinkware',
    typeLabel: '25oz Bottle',
    price: 30,
    blurb: 'Stainless 25oz bottle with the ember flame Ø and a matte blackout finish.',
    motif: 'flame',
    glow: 'ember',
  },
  {
    id: 'mug-visor',
    name: 'Neon Visor Mug',
    category: 'drinkware',
    typeLabel: '11oz Mug',
    price: 18,
    blurb: 'Ceramic mug with the glowing visor glyph — neon stays vivid, dishwasher safe.',
    motif: 'goggle',
    glow: 'cyan',
  },
  {
    id: 'campmug-wordmark',
    name: 'LEOPARDØ Enamel Camp Mug',
    category: 'drinkware',
    typeLabel: 'Camp Mug',
    price: 24,
    blurb: 'Speckled enamel camp mug with a rolled rim and the LEOPARDØ wordmark.',
    motif: 'wordmark',
    glow: 'purple',
  },
  {
    id: 'pint-orbit',
    name: 'Orbit Pint Glass',
    category: 'drinkware',
    typeLabel: 'Pint Glass',
    price: 14,
    blurb: 'Heavy-base pint glass with the orbit rings printed in glowing violet.',
    motif: 'orbit',
    glow: 'purple',
  },
  {
    id: 'cancooler-octagon',
    name: 'Octagon Can Cooler',
    category: 'drinkware',
    typeLabel: 'Can Cooler',
    price: 12,
    blurb: 'Neoprene slim + standard can cooler with the octagon tech-frame.',
    motif: 'octagon',
    glow: 'blue',
  },

  /* ── Prints ───────────────────────────────────────────────────────────── */
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
    id: 'print-grid',
    name: 'Synthwave Horizon Print',
    category: 'print',
    typeLabel: '18×24 Print',
    price: 28,
    blurb: 'The UTØPIA sunrise over a neon grid — a glowing horizon on archival matte.',
    motif: 'grid',
    glow: 'cyan',
    badge: 'New',
  },
  {
    id: 'print-orbit',
    name: 'Orbit Rings Art Print',
    category: 'print',
    typeLabel: '18×24 Print',
    price: 30,
    blurb: 'The interwoven spectrum gyroscope rendered as line art in violet + cyan.',
    motif: 'orbit',
    glow: 'purple',
  },
  {
    id: 'canvas-duality',
    name: 'UTØPIA / DYSTØPIA Canvas',
    category: 'print',
    typeLabel: 'Gallery Canvas',
    price: 65,
    blurb: 'Gallery-wrapped canvas of the full narrative split — cool to burning, edge to edge.',
    motif: 'duality',
    glow: 'mix',
    badge: 'Limited',
  },
  {
    id: 'print-circuit',
    name: 'Circuit Blueprint Print',
    category: 'print',
    typeLabel: '12×16 Print',
    price: 22,
    blurb: 'A technical-blueprint take on the brand circuitry, foil-bright on deep navy.',
    motif: 'circuit',
    glow: 'cyan',
  },

  /* ── Tech ─────────────────────────────────────────────────────────────── */
  {
    id: 'case-cover',
    name: 'DYSTØPIA Phone Case',
    category: 'tech',
    typeLabel: 'Phone Case',
    price: 28,
    blurb: 'Impact-tough phone case wrapped in album art (iPhone + Pixel + Galaxy fits).',
    motif: 'cover',
    glow: 'mix',
  },
  {
    id: 'deskmat-circuit',
    name: 'Circuit XL Deskmat',
    category: 'tech',
    typeLabel: 'Deskmat',
    price: 34,
    blurb: 'Stitched-edge XL desk/mouse mat with the circuit artwork edge to edge (900×400mm).',
    motif: 'circuit',
    glow: 'cyan',
    badge: 'Fan Fave',
  },
  {
    id: 'sleeve-waveform',
    name: 'Waveform Laptop Sleeve',
    category: 'tech',
    typeLabel: 'Laptop Sleeve',
    price: 40,
    blurb: 'Padded sleeve (13–16") with the neon equalizer print and a soft-lined interior.',
    motif: 'waveform',
    glow: 'blue',
  },
  {
    id: 'airpods-octagon',
    name: 'Octagon AirPods Case',
    category: 'tech',
    typeLabel: 'AirPods Case',
    price: 20,
    blurb: 'Snap-on AirPods / Pro case with the octagon tech-frame and a carabiner clip.',
    motif: 'octagon',
    glow: 'purple',
  },
  {
    id: 'mousepad-grid',
    name: 'Synthwave Mousepad',
    category: 'tech',
    typeLabel: 'Mousepad',
    price: 16,
    blurb: 'Standard-size cloth mousepad with the glowing synthwave horizon.',
    motif: 'grid',
    glow: 'cyan',
  },

  /* ── Extras ───────────────────────────────────────────────────────────── */
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
  {
    id: 'tote-wordmark',
    name: 'LEOPARDØ Canvas Tote',
    category: 'accessory',
    typeLabel: 'Tote',
    price: 24,
    blurb: 'Heavyweight natural canvas tote with the LEOPARDØ wordmark screened large.',
    motif: 'wordmark',
    glow: 'purple',
  },
  {
    id: 'patch-flame',
    name: 'Flame Ø Iron-On Patch',
    category: 'accessory',
    typeLabel: 'Patch',
    price: 10,
    blurb: 'Embroidered iron-on flame Ø patch — jackets, bags, anywhere it fits.',
    motif: 'flame',
    glow: 'ember',
  },
  {
    id: 'socks-visor',
    name: 'Visor Crew Socks',
    category: 'accessory',
    typeLabel: 'Socks',
    price: 16,
    blurb: 'Cushioned crew socks with the visor glyph knit at the ankle.',
    motif: 'goggle',
    glow: 'cyan',
  },
  {
    id: 'lanyard-barcode',
    name: 'Barcode Lanyard',
    category: 'accessory',
    typeLabel: 'Lanyard',
    price: 12,
    blurb: 'Festival-ready lanyard with the LEOPARDØ barcode and a detachable buckle.',
    motif: 'barcode',
    glow: 'blue',
  },
  {
    id: 'keychain-monogram',
    name: 'LØ Acrylic Keychain',
    category: 'accessory',
    typeLabel: 'Keychain',
    price: 11,
    blurb: 'Double-sided acrylic LØ monogram keychain with a holo edge.',
    motif: 'monogram',
    glow: 'purple',
  },

  /* ── Home ─────────────────────────────────────────────────────────────── */
  {
    id: 'blanket-orbit',
    name: 'Orbit Throw Blanket',
    category: 'home',
    typeLabel: 'Throw Blanket',
    price: 58,
    blurb: 'Plush 50×60" throw with the orbit rings glowing across a deep-space field.',
    motif: 'orbit',
    glow: 'purple',
    badge: 'Cozy',
  },
  {
    id: 'flag-cover',
    name: 'DYSTØPIA Wall Flag',
    category: 'home',
    typeLabel: 'Wall Flag',
    price: 30,
    blurb: 'Big 3×5ft wall flag of the album key art — instant studio / dorm centerpiece.',
    motif: 'cover',
    glow: 'mix',
  },
  {
    id: 'pillow-grid',
    name: 'Synthwave Throw Pillow',
    category: 'home',
    typeLabel: 'Throw Pillow',
    price: 26,
    blurb: 'Double-sided 18" pillow with the neon horizon — cover + insert included.',
    motif: 'grid',
    glow: 'cyan',
  },
]

export const merchCategories: { id: MerchCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'print', label: 'Prints' },
  { id: 'tech', label: 'Tech' },
  { id: 'accessory', label: 'Extras' },
  { id: 'home', label: 'Home' },
]

export function merchBuyUrl(item: MerchItem): string {
  return item.buyUrl ?? STORE_CONFIG.fallbackUrl
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}
