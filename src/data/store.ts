// Storefront — the single source of truth for everything LEOPARDØ sells.
//
// ── PAYMENT WIRING (read me) ─────────────────────────────────────────────────
//  • MUSIC  → routed through Bandcamp, which already sells lossless FLAC/ALAC/WAV
//    + handles secure checkout and instant download delivery. Album buys point at
//    `dystopia.bandcampUrl`. For a per-track FLAC buy link, drop the track's own
//    Bandcamp track-page URL into TRACK_BUY_OVERRIDES below.
//  • MERCH  → wire real commerce in ONE place: the `BUY_LINKS` map at the bottom
//    of this file (keyed by product id). Paste a Stripe Payment Link
//    ("https://buy.stripe.com/…") or a Printful/Printify product URL. A product
//    can also carry an inline `buyUrl`, and `STORE_CONFIG.storeUrl` powers the
//    "Shop All" CTA. Until links are set, every Buy button falls back to
//    STORE_CONFIG.fallbackUrl so nothing ever 404s. Real product photos: set the
//    product's `image` path to swap the generative design plate for a mockup.
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

export type MerchCategory =
  | 'apparel'
  | 'headwear'
  | 'drinkware'
  | 'print'
  | 'tech'
  | 'accessory'
  | 'home'
  | 'tracks'
  | 'music'
  | 'bundle'
  | 'seasonal'
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
  | 'track'
  | 'tracklist'
  | 'leopard'
  | 'skyline'
  | 'ember'
  | 'crest'
  | 'vinyl'
  | 'bundle'
  | 'mandala'
  | 'eclipse'
  | 'pulse'
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
  /** Big line for text-based motifs (e.g. a song title for the `track` motif). */
  text?: string
  /** Small line above the big text (e.g. "Track 07"). */
  sub?: string
  /** Drop a real product photo path here to replace the rendered mock. */
  image?: string
  /** Stripe Payment Link or Printful product URL. */
  buyUrl?: string
}

const baseMerch: MerchItem[] = [
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

/* ── More designs: album/world-themed drops ───────────────────────────────── */
const themedMerch: MerchItem[] = [
  // Apparel
  {
    id: 'tee-ember',
    name: 'Burning Future Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 34,
    blurb: 'Ember sparks rising around the Ø — the burning future, screened on heavyweight black.',
    motif: 'ember',
    glow: 'ember',
    badge: 'New',
  },
  {
    id: 'tee-leopard',
    name: 'Neon Leopard Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 33,
    blurb: 'LEOPARDØ in full — a neon rosette print glowing violet and cyan across the front.',
    motif: 'leopard',
    glow: 'purple',
  },
  {
    id: 'tee-skyline',
    name: 'War Drum Skyline Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 34,
    blurb: 'A burning dystopian skyline under a neon sun — cinematic back print, small front hit.',
    motif: 'skyline',
    glow: 'ember',
  },
  {
    id: 'tee-brass',
    name: 'Brass Trap Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 32,
    blurb: 'The spectrum as a wall of horns — equalizer artwork for symphonic-trap heads.',
    motif: 'waveform',
    glow: 'blue',
  },
  {
    id: 'tee-tracklist',
    name: 'Full Tracklist Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 36,
    blurb: 'All twenty DYSTØPIA titles laid out as a tour back-print on midweight black.',
    motif: 'tracklist',
    glow: 'mix',
    badge: 'Bestseller',
  },
  {
    id: 'hoodie-crest',
    name: 'LEOPARDØ Crest Hoodie',
    category: 'apparel',
    typeLabel: 'Hoodie',
    price: 70,
    blurb: 'Heavyweight hoodie with the EST·2026 crest emblem embroidered at the chest.',
    motif: 'crest',
    glow: 'purple',
  },

  // Headwear
  {
    id: 'beanie-leopard',
    name: 'Leopard Print Beanie',
    category: 'headwear',
    typeLabel: 'Beanie',
    price: 28,
    blurb: 'Cuffed knit beanie with an all-over neon rosette jacquard.',
    motif: 'leopard',
    glow: 'purple',
  },
  {
    id: 'snapback-crest',
    name: 'Crest Snapback',
    category: 'headwear',
    typeLabel: 'Snapback',
    price: 34,
    blurb: 'Structured snapback with the LEOPARDØ crest stitched across the front panels.',
    motif: 'crest',
    glow: 'blue',
  },

  // Drinkware
  {
    id: 'tumbler-ember',
    name: 'Ember Travel Tumbler',
    category: 'drinkware',
    typeLabel: '16oz Tumbler',
    price: 32,
    blurb: 'Spill-proof travel tumbler wrapped in rising embers on matte black.',
    motif: 'ember',
    glow: 'ember',
  },
  {
    id: 'bottle-leopard',
    name: 'Leopard Water Bottle',
    category: 'drinkware',
    typeLabel: '25oz Bottle',
    price: 30,
    blurb: 'Stainless bottle with the neon leopard rosette wrap.',
    motif: 'leopard',
    glow: 'cyan',
  },

  // Prints
  {
    id: 'poster-tracklist',
    name: 'DYSTØPIA Tracklist Poster',
    category: 'print',
    typeLabel: '18×24 Print',
    price: 26,
    blurb: 'The full twenty-track running order set in neon type on archival matte.',
    motif: 'tracklist',
    glow: 'mix',
    badge: 'New',
  },
  {
    id: 'print-skyline',
    name: 'Burning Skyline Print',
    category: 'print',
    typeLabel: '18×24 Print',
    price: 28,
    blurb: 'The dystopian skyline at the burning hour — heavy ember glow on matte stock.',
    motif: 'skyline',
    glow: 'ember',
  },
  {
    id: 'print-leopard',
    name: 'Neon Leopard Print',
    category: 'print',
    typeLabel: '12×16 Print',
    price: 24,
    blurb: 'The rosette mark blown up into a glowing gallery piece.',
    motif: 'leopard',
    glow: 'purple',
  },
  {
    id: 'print-crest',
    name: 'LEOPARDØ Crest Print',
    category: 'print',
    typeLabel: '12×16 Print',
    price: 24,
    blurb: 'The EST·2026 crest, foil-bright on deep void black.',
    motif: 'crest',
    glow: 'blue',
  },

  // Tech
  {
    id: 'mousepad-orbit',
    name: 'Orbit Mousepad',
    category: 'tech',
    typeLabel: 'Mousepad',
    price: 16,
    blurb: 'Standard cloth mousepad with the interwoven orbit rings.',
    motif: 'orbit',
    glow: 'purple',
  },
  {
    id: 'deskmat-leopard',
    name: 'Leopard XL Deskmat',
    category: 'tech',
    typeLabel: 'Deskmat',
    price: 34,
    blurb: 'Stitched-edge XL deskmat with the neon rosette pattern edge to edge.',
    motif: 'leopard',
    glow: 'purple',
  },
  {
    id: 'grip-octagon',
    name: 'Octagon Phone Grip',
    category: 'tech',
    typeLabel: 'Phone Grip',
    price: 14,
    blurb: 'Collapsible phone grip + stand with the octagon tech-frame.',
    motif: 'octagon',
    glow: 'cyan',
  },
  {
    id: 'grip-orbit',
    name: 'Orbit Phone Grip',
    category: 'tech',
    typeLabel: 'Phone Grip',
    price: 14,
    blurb: 'Collapsible grip with the glowing orbit rings.',
    motif: 'orbit',
    glow: 'purple',
  },
  {
    id: 'case-ember',
    name: 'Burning Future Phone Case',
    category: 'tech',
    typeLabel: 'Phone Case',
    price: 28,
    blurb: 'Tough phone case with the ember Ø (iPhone + Pixel + Galaxy fits).',
    motif: 'ember',
    glow: 'ember',
  },

  // Extras
  {
    id: 'pin-crest',
    name: 'Crest Enamel Pin',
    category: 'accessory',
    typeLabel: 'Pin',
    price: 12,
    blurb: 'Hard-enamel LEOPARDØ crest pin with gold-line plating.',
    motif: 'crest',
    glow: 'purple',
  },
  {
    id: 'stickers-ember',
    name: 'Ember Sticker Sheet',
    category: 'accessory',
    typeLabel: 'Stickers',
    price: 9,
    blurb: 'A sheet of weatherproof ember, flame, crest and rosette die-cuts.',
    motif: 'ember',
    glow: 'ember',
  },
  {
    id: 'bandana-leopard',
    name: 'Leopard Bandana',
    category: 'accessory',
    typeLabel: 'Bandana',
    price: 16,
    blurb: 'All-over neon rosette bandana — wear it, fly it, tie it on.',
    motif: 'leopard',
    glow: 'cyan',
  },
  {
    id: 'tote-tracklist',
    name: 'Tracklist Tote',
    category: 'accessory',
    typeLabel: 'Tote',
    price: 24,
    blurb: 'Heavy canvas tote with the full twenty-track list screened on the side.',
    motif: 'tracklist',
    glow: 'mix',
  },
  {
    id: 'keychain-flame',
    name: 'Flame Ø Keychain',
    category: 'accessory',
    typeLabel: 'Keychain',
    price: 11,
    blurb: 'Double-sided acrylic flame Ø keychain with a holo edge.',
    motif: 'flame',
    glow: 'ember',
  },

  // Home
  {
    id: 'blanket-leopard',
    name: 'Leopard Throw Blanket',
    category: 'home',
    typeLabel: 'Throw Blanket',
    price: 58,
    blurb: 'Plush 50×60" throw with the glowing rosette pattern across a void field.',
    motif: 'leopard',
    glow: 'purple',
    badge: 'Cozy',
  },
  {
    id: 'tapestry-skyline',
    name: 'Burning Skyline Tapestry',
    category: 'home',
    typeLabel: 'Tapestry',
    price: 48,
    blurb: 'Big wall tapestry of the dystopian skyline — instant burning-future backdrop.',
    motif: 'skyline',
    glow: 'ember',
    badge: 'Limited',
  },

  /* ── Music: physical formats ────────────────────────────────────────────── */
  {
    id: 'vinyl-2lp',
    name: 'DYSTØPIA — 2×LP Vinyl',
    category: 'music',
    typeLabel: '2×LP Vinyl',
    price: 40,
    blurb: 'Double heavyweight black vinyl in a gatefold sleeve with the full artwork.',
    motif: 'vinyl',
    glow: 'purple',
    badge: 'Limited',
  },
  {
    id: 'vinyl-splatter',
    name: 'DYSTØPIA — Ember Splatter LP',
    category: 'music',
    typeLabel: '2×LP Vinyl',
    price: 48,
    blurb: 'Limited ember-splatter pressing — violet wax shot with orange. Numbered to 500.',
    motif: 'vinyl',
    glow: 'ember',
    badge: '/500',
  },
  {
    id: 'cd-digipak',
    name: 'DYSTØPIA — CD Digipak',
    category: 'music',
    typeLabel: 'CD',
    price: 15,
    blurb: 'Six-panel digipak CD with the full lyric + art booklet.',
    motif: 'cover',
    glow: 'mix',
  },
  {
    id: 'cassette',
    name: 'DYSTØPIA — Cassette',
    category: 'music',
    typeLabel: 'Cassette',
    price: 14,
    blurb: 'Limited violet-shell cassette with a foil-stamped J-card.',
    motif: 'cover',
    glow: 'cyan',
  },

  /* ── Bundles ────────────────────────────────────────────────────────────── */
  {
    id: 'bundle-starter',
    name: 'Starter Bundle',
    category: 'bundle',
    typeLabel: 'Bundle',
    price: 49,
    blurb: 'Any album tee + the sticker pack + an enamel pin. Save vs. buying separately.',
    motif: 'bundle',
    glow: 'cyan',
    badge: 'Save $6',
  },
  {
    id: 'bundle-stage',
    name: 'Stage Bundle',
    category: 'bundle',
    typeLabel: 'Bundle',
    price: 119,
    blurb: 'A hoodie + a cap + the insulated tumbler — the full fit. Save vs. separately.',
    motif: 'bundle',
    glow: 'purple',
    badge: 'Save $13',
  },
  {
    id: 'bundle-collector',
    name: 'Collector Bundle',
    category: 'bundle',
    typeLabel: 'Bundle',
    price: 189,
    blurb: 'The 2×LP + gallery canvas + tote + the full pin set. For the true believers.',
    motif: 'bundle',
    glow: 'ember',
    badge: 'Limited',
  },
  {
    id: 'bundle-track',
    name: 'Track Series — Any 3 Tees',
    category: 'bundle',
    typeLabel: 'Bundle',
    price: 84,
    blurb: 'Pick any three Track Series tees and save — build your own run of the record.',
    motif: 'bundle',
    glow: 'blue',
    badge: 'Save $12',
  },
]

/* ── Track Series: a distinct typographic tee for every song on DYSTØPIA ──────
 * The glow follows the album's UTØPIA → DYSTØPIA arc: cool & hopeful at the top
 * of the record, burning by the end — so the per-song merch tells the story. */
function arcGlow(i: number, n: number): Glow {
  const p = n <= 1 ? 0 : i / (n - 1)
  if (p < 0.28) return 'cyan'
  if (p < 0.5) return 'blue'
  if (p < 0.72) return 'purple'
  if (p < 0.9) return 'mix'
  return 'ember'
}
const trackMerch: MerchItem[] = dystopia.tracks.map((t, i) => ({
  id: `track-tee-${t.n}`,
  name: `${t.title} — Track Tee`,
  category: 'tracks',
  typeLabel: 'Track Tee',
  price: 32,
  blurb: `Track ${String(t.n).padStart(2, '0')} of DYSTØPIA — the “${t.title}” title in living neon on a black heavyweight tee.`,
  motif: 'track',
  glow: arcGlow(i, dystopia.tracks.length),
  text: t.title,
  sub: `Track ${String(t.n).padStart(2, '0')}`,
  ...(t.n === 1 || t.n === 20 ? { badge: 'Era' } : {}),
}))

// A neon type Art Print for every song too — same key art, different format.
const trackPosters: MerchItem[] = dystopia.tracks.map((t, i) => ({
  id: `track-poster-${t.n}`,
  name: `${t.title} — Art Print`,
  category: 'tracks',
  typeLabel: '12×16 Print',
  price: 20,
  blurb: `Track ${String(t.n).padStart(2, '0')} of DYSTØPIA as a neon-type art print — archival matte, ready to frame.`,
  motif: 'track',
  glow: arcGlow(i, dystopia.tracks.length),
  text: t.title,
  sub: `Track ${String(t.n).padStart(2, '0')}`,
}))

/* ── Mantra tees: the album's own words (real taglines, not invented lyrics) ── */
const mantraMerch: MerchItem[] = [
  {
    id: 'mantra-symphonic',
    name: 'Symphonic Trap Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 33,
    blurb: 'The ethos on your chest — “Symphonic Trap” set in living neon type.',
    motif: 'track',
    glow: 'blue',
    text: 'SYMPHONIC TRAP',
    sub: 'LEOPARDØ',
  },
  {
    id: 'mantra-fall',
    name: 'The Fall Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 33,
    blurb: 'The whole arc of the record — UTØPIA to DYSTØPIA — on heavyweight black.',
    motif: 'track',
    glow: 'mix',
    text: 'THE FALL',
    sub: 'UTØPIA → DYSTØPIA',
  },
  {
    id: 'mantra-wardrums',
    name: 'Ancient War Drums Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 33,
    blurb: 'Ancient war drums pounding through a burning future — the LEOPARDØ creed.',
    motif: 'track',
    glow: 'ember',
    text: 'WAR DRUMS',
    sub: 'ANCIENT MELODIES',
  },
  {
    id: 'mantra-charleston',
    name: 'Charleston SC Tee',
    category: 'apparel',
    typeLabel: 'Tee',
    price: 33,
    blurb: 'Reppin’ home — Charleston, South Carolina, where the burning future was forged.',
    motif: 'track',
    glow: 'cyan',
    text: 'CHARLESTON SC',
    sub: 'LEOPARDØ · EST 2026',
  },
]

/* ── Seasonal drop: limited holiday / winter colorways + bundle ──────────────── */
const seasonalMerch: MerchItem[] = [
  {
    id: 'seasonal-polar-tee',
    name: 'PØLAR Frost Tee',
    category: 'seasonal',
    typeLabel: 'Tee',
    price: 34,
    blurb: 'Winter-drop colorway of the PØLAR track tee — icy neon on black.',
    motif: 'track',
    glow: 'cyan',
    text: 'PØLAR',
    sub: 'Winter Drop',
    badge: 'Seasonal',
  },
  {
    id: 'seasonal-beanie',
    name: 'Winter Ember Beanie',
    category: 'seasonal',
    typeLabel: 'Beanie',
    price: 30,
    blurb: 'Cuffed knit beanie with the ember spark mark — warmth from a burning future.',
    motif: 'ember',
    glow: 'ember',
    badge: 'Seasonal',
  },
  {
    id: 'seasonal-crew',
    name: 'Ember Holiday Crewneck',
    category: 'seasonal',
    typeLabel: 'Crewneck',
    price: 56,
    blurb: 'Cozy heavyweight crew in the limited holiday ember colorway.',
    motif: 'ember',
    glow: 'ember',
    badge: 'Seasonal',
  },
  {
    id: 'seasonal-utopia-ls',
    name: 'New Dawn — UTØPIA Long Sleeve',
    category: 'seasonal',
    typeLabel: 'Long Sleeve',
    price: 42,
    blurb: 'A new-year long sleeve built on the UTØPIA title — the hopeful dawn before the fall.',
    motif: 'track',
    glow: 'blue',
    text: 'UTØPIA',
    sub: 'New Dawn',
    badge: 'Seasonal',
  },
  {
    id: 'seasonal-bundle',
    name: 'Holiday Bundle',
    category: 'seasonal',
    typeLabel: 'Bundle',
    price: 99,
    blurb: 'Limited holiday drop — beanie + crewneck + sticker sheet at a seasonal price.',
    motif: 'bundle',
    glow: 'ember',
    badge: 'Seasonal',
  },
]

/* ── More drops: new product types + two fresh designs ──────────────────────── */
const extraMerch: MerchItem[] = [
  // Apparel
  { id: 'tee-mandala', name: 'Oriental Mandala Tee', category: 'apparel', typeLabel: 'Tee', price: 34, blurb: 'The album’s oriental melodies as a glowing mandala — front and center on black.', motif: 'mandala', glow: 'purple', badge: 'New' },
  { id: 'tee-eclipse', name: 'Burning Eclipse Tee', category: 'apparel', typeLabel: 'Tee', price: 34, blurb: 'A neon eclipse over a dead sun — the burning future in one mark.', motif: 'eclipse', glow: 'ember' },
  { id: 'shorts-grid', name: 'Synthwave Mesh Shorts', category: 'apparel', typeLabel: 'Shorts', price: 36, blurb: 'Breathable mesh shorts with the neon-grid horizon down the side.', motif: 'grid', glow: 'cyan' },
  { id: 'joggers-mono', name: 'LØ Monogram Joggers', category: 'apparel', typeLabel: 'Joggers', price: 58, blurb: 'Tapered fleece joggers with the embroidered LØ monogram at the hip.', motif: 'monogram', glow: 'purple' },
  { id: 'windbreaker-duality', name: 'Duality Windbreaker', category: 'apparel', typeLabel: 'Windbreaker', price: 74, blurb: 'Packable windbreaker split cool-to-hot across the back — UTØPIA to DYSTØPIA.', motif: 'duality', glow: 'mix', badge: 'Limited' },
  { id: 'jersey-octagon', name: 'Octagon Baseball Jersey', category: 'apparel', typeLabel: 'Jersey', price: 56, blurb: 'Button-up baseball jersey with the octagon tech-frame across the chest.', motif: 'octagon', glow: 'blue' },
  { id: 'varsity-crest', name: 'Crest Varsity Jacket', category: 'apparel', typeLabel: 'Varsity Jacket', price: 124, blurb: 'Wool-body varsity with leather sleeves and the LEOPARDØ crest chenille patch.', motif: 'crest', glow: 'ember', badge: 'Limited' },

  // Headwear
  { id: 'balaclava-leopard', name: 'Leopard Balaclava', category: 'headwear', typeLabel: 'Balaclava', price: 26, blurb: 'Knit balaclava with an all-over neon rosette — for the cold burning future.', motif: 'leopard', glow: 'purple' },
  { id: 'visor-octagon', name: 'Octagon Sport Visor', category: 'headwear', typeLabel: 'Visor', price: 24, blurb: 'Lightweight sport visor with the octagon mark embroidered front and center.', motif: 'octagon', glow: 'cyan' },

  // Drinkware
  { id: 'thermos-cover', name: 'DYSTØPIA Thermos', category: 'drinkware', typeLabel: '32oz Thermos', price: 34, blurb: 'Vacuum thermos wrapped in album art — 24h cold, 12h hot.', motif: 'cover', glow: 'mix' },
  { id: 'flask-flame', name: 'Flame Hip Flask', category: 'drinkware', typeLabel: 'Hip Flask', price: 22, blurb: 'Stainless 6oz flask laser-etched with the ember flame Ø.', motif: 'flame', glow: 'ember' },
  { id: 'shotglass-octagon', name: 'Octagon Shot Glass Set', category: 'drinkware', typeLabel: 'Shot Set (×4)', price: 18, blurb: 'Four heavy-base shot glasses with the octagon tech-frame.', motif: 'octagon', glow: 'purple' },
  { id: 'coasters-mandala', name: 'Mandala Coaster Set', category: 'drinkware', typeLabel: 'Coasters (×6)', price: 20, blurb: 'Six cork-back neoprene coasters with the glowing mandala.', motif: 'mandala', glow: 'purple' },

  // Tech
  { id: 'keycaps-octagon', name: 'Octagon Keycap Set', category: 'tech', typeLabel: 'Keycaps', price: 30, blurb: 'Artisan keycap set in neon violet — escape, enter, and the octagon spacebar.', motif: 'octagon', glow: 'cyan', badge: 'New' },
  { id: 'charger-orbit', name: 'Orbit Wireless Charger', category: 'tech', typeLabel: 'Charger', price: 34, blurb: '15W wireless pad that lights the orbit rings as it charges.', motif: 'orbit', glow: 'purple' },
  { id: 'usb-album', name: 'DYSTØPIA USB (Lossless)', category: 'tech', typeLabel: 'USB Drive', price: 24, blurb: 'Etched USB loaded with the full lossless album + art — a physical download.', motif: 'vinyl', glow: 'blue' },
  { id: 'webcam-octagon', name: 'Octagon Webcam Cover', category: 'tech', typeLabel: 'Webcam Cover', price: 8, blurb: 'Slim sliding webcam cover with the octagon mark.', motif: 'octagon', glow: 'cyan' },

  // Extras
  { id: 'chain-monogram', name: 'LØ Pendant Chain', category: 'accessory', typeLabel: 'Chain', price: 28, blurb: 'Stainless LØ pendant on an 22" box chain.', motif: 'monogram', glow: 'purple' },
  { id: 'wallet-leopard', name: 'Leopard Bifold Wallet', category: 'accessory', typeLabel: 'Wallet', price: 32, blurb: 'Vegan-leather bifold with the neon rosette interior.', motif: 'leopard', glow: 'purple' },
  { id: 'pinset', name: 'Full Pin Set (×6)', category: 'accessory', typeLabel: 'Pin Set', price: 34, blurb: 'Every mark as a hard-enamel pin — octagon, flame, crest, visor, orbit, LØ.', motif: 'crest', glow: 'mix', badge: 'Value' },
  { id: 'candle-ember', name: 'Ember Soy Candle', category: 'accessory', typeLabel: 'Candle', price: 22, blurb: 'Hand-poured soy candle — smoked amber + cedar, in a frosted violet jar.', motif: 'ember', glow: 'ember' },
  { id: 'incense-mandala', name: 'Mandala Incense Holder', category: 'accessory', typeLabel: 'Incense', price: 18, blurb: 'Cast incense holder etched with the mandala + a starter pack of sticks.', motif: 'mandala', glow: 'purple' },
  { id: 'airfreshener-flame', name: 'Flame Air Freshener', category: 'accessory', typeLabel: 'Air Freshener', price: 8, blurb: 'Hang the flame Ø in the whip — ember-spice scent.', motif: 'flame', glow: 'ember' },

  // Home
  { id: 'neonsign-wordmark', name: 'LEOPARDØ LED Sign', category: 'home', typeLabel: 'LED Sign', price: 89, blurb: 'A real LED neon-style sign of the LEOPARDØ wordmark — USB powered.', motif: 'wordmark', glow: 'purple', badge: 'Limited' },
  { id: 'rug-orbit', name: 'Orbit Area Rug', category: 'home', typeLabel: 'Area Rug', price: 78, blurb: 'Plush 3×5ft rug with the gyroscope orbit rings glowing on a void field.', motif: 'orbit', glow: 'purple' },
  { id: 'clock-octagon', name: 'Octagon Wall Clock', category: 'home', typeLabel: 'Wall Clock', price: 38, blurb: 'Silent-sweep wall clock built into the octagon tech-frame.', motif: 'octagon', glow: 'cyan' },
  { id: 'doormat-skyline', name: 'Skyline Doormat', category: 'home', typeLabel: 'Doormat', price: 34, blurb: 'Coir doormat with the burning skyline — enter the world.', motif: 'skyline', glow: 'ember' },
  { id: 'mirror-eclipse', name: 'Eclipse LED Mirror', category: 'home', typeLabel: 'LED Mirror', price: 64, blurb: 'Round LED-backlit mirror ringed like a neon eclipse.', motif: 'eclipse', glow: 'ember', badge: 'Limited' },

  // Prints
  { id: 'postcards', name: 'Art Postcard Set (×8)', category: 'print', typeLabel: 'Postcards', price: 14, blurb: 'Eight mini art prints — one for each key design.', motif: 'mandala', glow: 'cyan' },
  { id: 'holo-print', name: 'Holographic DYSTØPIA Print', category: 'print', typeLabel: 'Holo Print', price: 30, blurb: 'A foil-holographic print of the duality split — it shifts as you move.', motif: 'duality', glow: 'mix', badge: 'Limited' },

  // Music
  { id: 'vinyl-7inch', name: 'UTØPIA / DYSTØPIA 7"', category: 'music', typeLabel: '7" Single', price: 14, blurb: 'The two era-defining tracks on a 7" — UTØPIA b/w DYSTØPIA.', motif: 'vinyl', glow: 'cyan' },
  { id: 'boxset', name: 'DYSTØPIA Collector Box Set', category: 'music', typeLabel: 'Box Set', price: 129, blurb: '2×LP + CD + cassette + art book + pin set in a foil-stamped box.', motif: 'bundle', glow: 'ember', badge: 'Limited' },

  // Bundles
  { id: 'bundle-vinyl', name: 'Vinyl Lover Bundle', category: 'bundle', typeLabel: 'Bundle', price: 79, blurb: 'The 2×LP + a slipmat + the art print — spin it right.', motif: 'bundle', glow: 'purple', badge: 'Save $9' },
  { id: 'bundle-tee5', name: 'Build-Your-Own 5 Tee Pack', category: 'bundle', typeLabel: 'Bundle', price: 135, blurb: 'Pick any five tees (Track Series included) and save big.', motif: 'bundle', glow: 'cyan', badge: 'Save $25' },

  // Fun extras + lifestyle
  { id: 'youth-tee', name: 'Youth Album Tee', category: 'apparel', typeLabel: 'Youth Tee', price: 26, blurb: 'The album cover tee sized down for the next-gen fan (XS–XL youth).', motif: 'cover', glow: 'mix' },
  { id: 'onesie', name: 'DYSTØPIA Baby Onesie', category: 'apparel', typeLabel: 'Onesie', price: 22, blurb: 'Soft snap-bottom onesie with the LEOPARDØ wordmark — future heads only.', motif: 'wordmark', glow: 'purple' },
  { id: 'deck-orbit', name: 'Orbit Skate Deck', category: 'home', typeLabel: 'Skate Deck', price: 65, blurb: '7-ply maple deck with the gyroscope orbit rings — ride it or hang it.', motif: 'orbit', glow: 'purple', badge: 'Limited' },
  { id: 'towel-duality', name: 'Duality Beach Towel', category: 'home', typeLabel: 'Beach Towel', price: 34, blurb: 'Oversized microfiber towel split UTØPIA-to-DYSTØPIA.', motif: 'duality', glow: 'mix' },
  { id: 'yogamat-mandala', name: 'Mandala Yoga Mat', category: 'home', typeLabel: 'Yoga Mat', price: 44, blurb: 'Grippy 5mm mat centered on the glowing mandala — flow through the future.', motif: 'mandala', glow: 'purple' },
  { id: 'petbandana', name: 'Leopard Pet Bandana', category: 'accessory', typeLabel: 'Pet Bandana', price: 14, blurb: 'Tie-on pet bandana in the neon rosette — your hound runs the burning future too.', motif: 'leopard', glow: 'cyan' },

  // Wave 3 — new "pulse" design + more lifestyle
  { id: 'tee-pulse', name: 'Live Signal Tee', category: 'apparel', typeLabel: 'Tee', price: 33, blurb: 'The reactive waveform frozen as a heartbeat line — DYSTØPIA, live.', motif: 'pulse', glow: 'cyan', badge: 'New' },
  { id: 'scarf-leopard', name: 'Leopard Knit Scarf', category: 'apparel', typeLabel: 'Scarf', price: 30, blurb: 'Chunky knit scarf with the neon rosette woven end to end.', motif: 'leopard', glow: 'purple' },
  { id: 'trapper-leopard', name: 'Leopard Trapper Hat', category: 'headwear', typeLabel: 'Trapper Hat', price: 36, blurb: 'Sherpa-lined trapper in the rosette print — warmth for the cold dystopia.', motif: 'leopard', glow: 'purple' },
  { id: 'winetumbler-mandala', name: 'Mandala Wine Tumbler', category: 'drinkware', typeLabel: 'Wine Tumbler', price: 22, blurb: 'Insulated stemless wine tumbler etched with the mandala.', motif: 'mandala', glow: 'purple' },
  { id: 'gamingmat-circuit', name: 'Circuit XXL Gaming Mat', category: 'tech', typeLabel: 'Gaming Mat', price: 40, blurb: 'Full-desk XXL gaming mat (1200×600mm) in the circuit artwork.', motif: 'circuit', glow: 'cyan' },
  { id: 'popsocket-octagon', name: 'Octagon Phone Button', category: 'tech', typeLabel: 'Phone Button', price: 12, blurb: 'Swappable grip-button with the octagon mark.', motif: 'octagon', glow: 'purple' },
  { id: 'lighter-flame', name: 'Flame Metal Lighter', category: 'accessory', typeLabel: 'Lighter', price: 14, blurb: 'Refillable metal flip lighter engraved with the ember Ø.', motif: 'flame', glow: 'ember' },
  { id: 'facemask-octagon', name: 'Octagon Face Mask', category: 'accessory', typeLabel: 'Face Mask', price: 12, blurb: 'Adjustable two-layer mask with the octagon tech-frame.', motif: 'octagon', glow: 'cyan' },
  { id: 'umbrella-skyline', name: 'Skyline Storm Umbrella', category: 'accessory', typeLabel: 'Umbrella', price: 32, blurb: 'Auto-open umbrella printed with the burning skyline inside the canopy.', motif: 'skyline', glow: 'ember' },
  { id: 'tapestry-mandala', name: 'Mandala Wall Tapestry', category: 'home', typeLabel: 'Tapestry', price: 44, blurb: 'Big wall tapestry of the glowing mandala — instant focal point.', motif: 'mandala', glow: 'purple' },
  { id: 'curtains-grid', name: 'Synthwave Blackout Curtains', category: 'home', typeLabel: 'Curtains', price: 54, blurb: 'Blackout curtain pair with the neon-grid horizon along the hem.', motif: 'grid', glow: 'cyan' },
  { id: 'magnets-octagon', name: 'Magnet Set (×6)', category: 'home', typeLabel: 'Magnets', price: 12, blurb: 'Six die-cut fridge magnets — every mark in the set.', motif: 'octagon', glow: 'blue' },
  { id: 'lenticular-eclipse', name: 'Lenticular Eclipse Print', category: 'print', typeLabel: 'Lenticular', price: 34, blurb: 'Tilt-to-animate lenticular print — the eclipse comes alive as you move.', motif: 'eclipse', glow: 'ember', badge: 'Limited' },
  { id: 'minidisc', name: 'DYSTØPIA MiniDisc', category: 'music', typeLabel: 'MiniDisc', price: 18, blurb: 'A numbered MiniDisc pressing for the format faithful.', motif: 'vinyl', glow: 'cyan', badge: 'Limited' },
  { id: 'bundle-desk', name: 'Desk Setup Bundle', category: 'bundle', typeLabel: 'Bundle', price: 79, blurb: 'Deskmat + mousepad + keycaps + a phone grip — kit the whole battlestation.', motif: 'bundle', glow: 'cyan', badge: 'Save $11' },
]

export const merch: MerchItem[] = [
  ...baseMerch,
  ...themedMerch,
  ...trackMerch,
  ...trackPosters,
  ...mantraMerch,
  ...seasonalMerch,
  ...extraMerch,
]

/** A curated "Featured Drops" shelf shown above the grid on the All view. */
const FEATURED_IDS = [
  'tee-dystopia',
  'hoodie-orbit',
  'vinyl-2lp',
  'tee-tracklist',
  'tumbler-cover',
  'bundle-collector',
  'tee-glitch',
  'track-tee-1',
]
export const featuredMerch: MerchItem[] = FEATURED_IDS.map((id) => merch.find((m) => m.id === id)).filter(
  (m): m is MerchItem => Boolean(m),
)

export const merchCategories: { id: MerchCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'tracks', label: 'Track Series' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'print', label: 'Prints' },
  { id: 'tech', label: 'Tech' },
  { id: 'accessory', label: 'Extras' },
  { id: 'home', label: 'Home' },
  { id: 'music', label: 'Music' },
  { id: 'bundle', label: 'Bundles' },
  { id: 'seasonal', label: 'Seasonal' },
]

/**
 * Central buy-link map — the one place to wire real commerce. Paste a Stripe
 * Payment Link ("https://buy.stripe.com/…") or a Printful/Printify product URL
 * keyed by the product `id`. Anything not listed (and without an inline `buyUrl`)
 * falls back to STORE_CONFIG.fallbackUrl, so the store never 404s pre-launch.
 *
 *   export const BUY_LINKS = {
 *     'tee-dystopia': 'https://buy.stripe.com/abc123',
 *     'hoodie-orbit': 'https://leopardo.printful.me/product/orbit-hoodie',
 *   }
 *
 * Resolution order: item.buyUrl → BUY_LINKS[id] → STORE_CONFIG.fallbackUrl.
 */
export const BUY_LINKS: Record<string, string> = {}

export function merchBuyUrl(item: MerchItem): string {
  return item.buyUrl ?? BUY_LINKS[item.id] ?? STORE_CONFIG.fallbackUrl
}

/** True once any real commerce link is wired (toggles "live checkout" copy). */
export const isStoreWired =
  Object.keys(BUY_LINKS).length > 0 || merch.some((m) => Boolean(m.buyUrl))

export function formatPrice(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}
