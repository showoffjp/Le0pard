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

/* ── Track Series: a distinct typographic tee for every song on DYSTØPIA ────── */
const TRACK_GLOWS: Glow[] = ['cyan', 'blue', 'purple', 'mix', 'ember']
const trackMerch: MerchItem[] = dystopia.tracks.map((t, i) => ({
  id: `track-tee-${t.n}`,
  name: `${t.title} — Track Tee`,
  category: 'tracks',
  typeLabel: 'Track Tee',
  price: 32,
  blurb: `Track ${String(t.n).padStart(2, '0')} of DYSTØPIA — the “${t.title}” title in living neon on a black heavyweight tee.`,
  motif: 'track',
  glow: TRACK_GLOWS[i % TRACK_GLOWS.length],
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
  glow: TRACK_GLOWS[(i + 2) % TRACK_GLOWS.length],
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

export const merch: MerchItem[] = [
  ...baseMerch,
  ...themedMerch,
  ...trackMerch,
  ...trackPosters,
  ...mantraMerch,
  ...seasonalMerch,
]

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

export function merchBuyUrl(item: MerchItem): string {
  return item.buyUrl ?? STORE_CONFIG.fallbackUrl
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`
}
