// Generates a neon product-mockup SVG for every product into src/assets/merch/.
// Each is a category-specific silhouette wearing its motif as a glowing emblem,
// tinted by the product's glow, on a dark studio backdrop. Re-run any time:
//   node scripts/genMerchMockups.mjs
import { build } from 'esbuild'
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const OUT = 'src/assets/merch'
mkdirSync(OUT, { recursive: true })

// ── load live product data ──
const tmp = join(mkdtempSync(join(tmpdir(), 'm-')), 'store.mjs')
await build({ entryPoints: ['src/data/store.ts'], bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'silent' })
const { merch } = await import('file://' + tmp)

const GLOW = {
  purple: ['#a855f7', '#7c5cff'],
  blue: ['#3b82f6', '#6366f1'],
  cyan: ['#22d3ee', '#3b82f6'],
  ember: ['#ff6a00', '#ff2d00'],
  mix: ['#22d3ee', '#a855f7'],
}
const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
const W = 800, H = 800, CX = 400

// The printable area per archetype — the emblem is CLIPPED to this so it can
// never spill outside the product. `box` (derived) is the emblem's safe centre+radius.
const R = (x, y, w, h) => ({ clip: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>`, box: { cx: x + w / 2, cy: y + h / 2, r: (Math.min(w, h) / 2) * 0.92 } })
const C = (cx, cy, cr) => ({ clip: `<circle cx="${cx}" cy="${cy}" r="${cr}"/>`, box: { cx, cy, r: cr * 0.86 } })
function clipbox(kind) {
  switch (kind) {
    case 'tee': return R(308, 305, 184, 230)
    case 'hoodie': return R(312, 362, 176, 200)
    case 'bottoms': return R(322, 252, 156, 170)
    case 'cap': return R(302, 338, 196, 70)
    case 'beanie': return R(302, 300, 196, 145)
    case 'bottle': return R(340, 306, 120, 286)
    case 'mug': return R(294, 314, 172, 212)
    case 'glass': return R(348, 300, 104, 264)
    case 'can': return R(340, 274, 120, 292)
    case 'poster': return R(260, 210, 280, 380)
    case 'disc': return C(400, 400, 148)
    case 'cassette': return R(304, 300, 192, 76)
    case 'box': return R(312, 360, 176, 184)
    case 'phone': return R(336, 238, 128, 308)
    case 'mat': return R(236, 374, 328, 144)
    case 'laptop': return R(262, 250, 276, 196)
    case 'panel': return R(254, 244, 292, 312)
    case 'deck': return R(350, 214, 100, 372)
    case 'pillow': return R(288, 298, 224, 224)
    case 'umbrella': return R(262, 270, 276, 124)
    case 'fabric': return R(276, 264, 248, 282)
    case 'badge': return C(400, 400, 148)
    default: return R(258, 258, 284, 284)
  }
}
// font size that fits `len` chars within ~1.8r wide and `cap`·r tall
const fit = (len, r, cap = 0.6) => Math.min(r * cap, (1.8 * r) / Math.max(3, len * 0.62))

function archetype(p) {
  const t = p.typeLabel.toLowerCase(), c = p.category
  if (c === 'music') return /cassette/.test(t) ? 'cassette' : /box/.test(t) ? 'box' : 'disc'
  if (c === 'bundle') return 'box'
  if (c === 'print' || /poster|print|canvas|tapestry|postcard|holo|lenticular/.test(t)) return 'poster'
  if (c === 'headwear') return /beanie|balaclava|trapper/.test(t) ? 'beanie' : 'cap'
  if (c === 'drinkware') return /mug/.test(t) ? 'mug' : /glass|pint|wine|shot/.test(t) ? 'glass' : /can/.test(t) ? 'can' : 'bottle'
  if (c === 'tech') return /phone|case|grip|button/.test(t) ? 'phone' : /mat|pad/.test(t) ? 'mat' : /sleeve|laptop/.test(t) ? 'laptop' : 'phone'
  if (c === 'home') return /sign|mirror|clock/.test(t) ? 'panel' : /deck/.test(t) ? 'deck' : /pillow/.test(t) ? 'pillow' : 'textile'
  if (c === 'accessory') {
    if (/pin|sticker|magnet|keychain|patch|freshener|chain/.test(t)) return 'badge'
    if (/tote|bandana|mask|socks|lanyard|scarf/.test(t)) return 'fabric'
    if (/candle|incense|lighter|flask/.test(t)) return 'bottle'
    if (/umbrella/.test(t)) return 'umbrella'
    if (/wallet/.test(t)) return 'box'
    return 'badge'
  }
  // apparel / seasonal / track tees
  if (/hoodie|zip|crew|varsity|windbreaker/.test(t)) return 'hoodie'
  if (/joggers|shorts/.test(t)) return 'bottoms'
  if (/scarf/.test(t)) return 'fabric'
  return 'tee'
}

const FABRIC = 'url(#fab)', FABRIC2 = '#0c0a14'

// silhouettes → { shape, box:{cx,cy,r} } where the emblem is placed
function silhouette(kind, a) {
  const stroke = `stroke="${a}" stroke-opacity="0.55" stroke-width="2"`
  switch (kind) {
    case 'tee':
      return { box: { cx: CX, cy: 400, r: 120 }, shape: `
        <path d="M250 250 L330 210 Q400 250 470 210 L550 250 L600 330 L540 370 L540 600 Q400 630 260 600 L260 370 L200 330 Z" fill="${FABRIC}" ${stroke}/>
        <path d="M330 210 Q400 270 470 210" fill="none" ${stroke}/>` }
    case 'hoodie':
      return { box: { cx: CX, cy: 420, r: 110 }, shape: `
        <path d="M250 270 L320 230 Q400 200 480 230 L550 270 L610 350 L548 392 L548 610 Q400 642 252 610 L252 392 L190 350 Z" fill="${FABRIC}" ${stroke}/>
        <path d="M320 230 Q400 320 480 230 L470 250 Q400 330 330 250 Z" fill="${FABRIC2}" ${stroke}/>
        <rect x="330" y="500" width="140" height="70" rx="10" fill="none" ${stroke}/>` }
    case 'bottoms':
      return { box: { cx: CX, cy: 300, r: 90 }, shape: `
        <path d="M300 220 L500 220 L520 600 L430 600 L400 360 L370 600 L280 600 Z" fill="${FABRIC}" ${stroke}/>
        <rect x="300" y="220" width="200" height="36" fill="${FABRIC2}" ${stroke}/>` }
    case 'cap':
      return { box: { cx: CX, cy: 360, r: 95 }, shape: `
        <path d="M250 400 Q400 250 560 380 L560 410 L250 420 Z" fill="${FABRIC}" ${stroke}/>
        <path d="M250 420 Q360 470 520 440 L560 410 L250 410 Z" fill="${FABRIC2}" ${stroke}/>` }
    case 'beanie':
      return { box: { cx: CX, cy: 350, r: 95 }, shape: `
        <path d="M280 460 Q280 250 520 250 Q520 460 520 460 Z" fill="${FABRIC}" ${stroke}/>
        <rect x="270" y="450" width="260" height="60" rx="14" fill="${FABRIC2}" ${stroke}/>` }
    case 'bottle':
      return { box: { cx: CX, cy: 420, r: 78 }, shape: `
        <rect x="372" y="200" width="56" height="50" rx="8" fill="${FABRIC2}" ${stroke}/>
        <path d="M340 250 L460 250 L470 320 L470 620 Q400 645 330 620 L330 320 Z" fill="${FABRIC}" ${stroke}/>` }
    case 'mug':
      return { box: { cx: 380, cy: 410, r: 86 }, shape: `
        <rect x="280" y="300" width="200" height="240" rx="20" fill="${FABRIC}" ${stroke}/>
        <path d="M480 350 Q560 350 560 430 Q560 500 480 500" fill="none" ${stroke} stroke-width="16"/>` }
    case 'glass':
      return { box: { cx: CX, cy: 430, r: 76 }, shape: `<path d="M330 280 L470 280 L450 600 L350 600 Z" fill="${FABRIC}" fill-opacity="0.55" ${stroke}/>` }
    case 'can':
      return { box: { cx: CX, cy: 420, r: 80 }, shape: `<rect x="330" y="260" width="140" height="320" rx="22" fill="${FABRIC}" ${stroke}/>` }
    case 'poster':
      return { box: { cx: CX, cy: 400, r: 150 }, shape: `
        <rect x="232" y="180" width="336" height="440" rx="6" fill="${FABRIC2}" ${stroke}/>
        <rect x="252" y="200" width="296" height="400" rx="4" fill="${FABRIC}" stroke="${a}" stroke-opacity="0.3"/>` }
    case 'disc':
      return { box: { cx: CX, cy: 400, r: 150 }, shape: `
        <circle cx="${CX}" cy="400" r="190" fill="#0c0a14" ${stroke}/>
        <circle cx="${CX}" cy="400" r="150" fill="none" stroke="${a}" stroke-opacity="0.15"/>
        <circle cx="${CX}" cy="400" r="14" fill="#04050a" ${stroke}/>` }
    case 'cassette':
      return { box: { cx: CX, cy: 400, r: 120 }, shape: `
        <rect x="240" y="280" width="320" height="240" rx="14" fill="${FABRIC}" ${stroke}/>
        <circle cx="340" cy="400" r="34" fill="#04050a" ${stroke}/><circle cx="460" cy="400" r="34" fill="#04050a" ${stroke}/>` }
    case 'box':
      return { box: { cx: CX, cy: 410, r: 120 }, shape: `
        <path d="M250 320 L400 250 L550 320 L550 560 L400 630 L250 560 Z" fill="${FABRIC}" ${stroke}/>
        <path d="M250 320 L400 390 L550 320 M400 390 L400 630" fill="none" ${stroke}/>` }
    case 'phone':
      return { box: { cx: CX, cy: 410, r: 96 }, shape: `<rect x="312" y="200" width="176" height="400" rx="34" fill="${FABRIC}" ${stroke}/><rect x="332" y="232" width="136" height="320" rx="14" fill="${FABRIC2}"/>` }
    case 'mat':
      return { box: { cx: CX, cy: 430, r: 150 }, shape: `<path d="M200 380 L600 340 L620 540 L180 580 Z" fill="${FABRIC}" ${stroke}/>` }
    case 'laptop':
      return { box: { cx: CX, cy: 380, r: 130 }, shape: `<rect x="250" y="240" width="300" height="220" rx="12" fill="${FABRIC}" ${stroke}/><path d="M210 480 L590 480 L610 520 L190 520 Z" fill="${FABRIC2}" ${stroke}/>` }
    case 'panel':
      return { box: { cx: CX, cy: 400, r: 150 }, shape: `<rect x="240" y="230" width="320" height="340" rx="16" fill="${FABRIC}" ${stroke}/>` }
    case 'deck':
      return { box: { cx: CX, cy: 400, r: 70 }, shape: `<path d="M360 180 Q330 200 340 240 L340 560 Q330 600 360 620 L440 620 Q470 600 460 560 L460 240 Q470 200 440 180 Z" fill="${FABRIC}" ${stroke}/>` }
    case 'pillow':
      return { box: { cx: CX, cy: 410, r: 120 }, shape: `<path d="M260 270 Q400 250 540 270 Q560 410 540 550 Q400 570 260 550 Q240 410 260 270 Z" fill="${FABRIC}" ${stroke}/>` }
    case 'umbrella':
      return { box: { cx: CX, cy: 360, r: 110 }, shape: `<path d="M220 420 Q400 220 580 420 Q500 380 460 420 Q420 360 400 420 Q380 360 340 420 Q300 380 220 420 Z" fill="${FABRIC}" ${stroke}/><line x1="400" y1="420" x2="400" y2="600" ${stroke}/>` }
    case 'fabric':
      return { box: { cx: CX, cy: 410, r: 130 }, shape: `<path d="M250 250 Q400 230 550 250 L560 560 Q400 600 240 560 Z" fill="${FABRIC}" ${stroke}/>` }
    case 'badge':
      return { box: { cx: CX, cy: 400, r: 130 }, shape: `<circle cx="${CX}" cy="400" r="160" fill="${FABRIC}" ${stroke}/><circle cx="${CX}" cy="400" r="160" fill="none" stroke="${a}" stroke-opacity="0.25" stroke-width="6"/>` }
    default:
      return { box: { cx: CX, cy: 400, r: 140 }, shape: `<rect x="240" y="240" width="320" height="320" rx="16" fill="${FABRIC}" ${stroke}/>` }
  }
}

// emblem (motif → glowing mark), centered at (cx,cy) scaled to ~r
function emblem(p, a, b, box) {
  const { cx, cy, r } = box
  const m = p.motif
  const g = `fill="none" stroke="${a}" stroke-width="${Math.max(2, r * 0.03)}" stroke-linecap="round" stroke-linejoin="round"`
  const T = (s, size, fill = a, y = cy) =>
    `<text x="${cx}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${size}" fill="${fill}" letter-spacing="1">${esc(s)}</text>`
  switch (m) {
    case 'track': {
      const t = (p.text || 'DYSTØPIA').toString()
      return `${T(p.sub || 'DYSTØPIA', fit(8, r, 0.15), a, cy - r * 0.6)}${T(t, fit(t.length, r, 0.6))}${T('LEOPARDØ', fit(8, r, 0.14), '#9aa3b2', cy + r * 0.6)}`
    }
    case 'wordmark':
      return T('LEOPARDØ', fit(8, r, 0.34))
    case 'monogram':
      return T('LØ', r * 0.95)
    case 'glitch': {
      const s = fit(8, r, 0.42)
      return `<g>${T('DYSTØPIA', s, b, cy - 3)}${T('DYSTØPIA', s, '#22d3ee', cy + 3)}${T('DYSTØPIA', s, '#fff')}</g>`
    }
    case 'octagon':
      return `<path d="M${cx - r * 0.5} ${cy - r * 0.8} H${cx + r * 0.5} L${cx + r * 0.8} ${cy - r * 0.5} V${cy + r * 0.5} L${cx + r * 0.5} ${cy + r * 0.8} H${cx - r * 0.5} L${cx - r * 0.8} ${cy + r * 0.5} V${cy - r * 0.5} Z" ${g}/>${T('LØ', r * 0.4, '#fff')}`
    case 'flame':
    case 'ember':
      return `${T('Ø', r * 1.1, a)}${Array.from({ length: 7 }, (_, i) => { const x = cx - r * 0.6 + (i * r * 0.2); const y = cy - r * 0.5 - (i % 3) * r * 0.2; return `<circle cx="${x}" cy="${y}" r="${r * 0.04}" fill="${b}"/>` }).join('')}`
    case 'orbit':
      return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.9}" ry="${r * 0.34}" transform="rotate(18 ${cx} ${cy})" ${g}/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.8}" ry="${r * 0.3}" transform="rotate(-34 ${cx} ${cy})" stroke="${b}" fill="none" stroke-width="${r * 0.03}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.12}" fill="${a}"/>`
    case 'circuit':
      return `<path d="M${cx - r * 0.8} ${cy - r * 0.4} H${cx - r * 0.1} V${cy + r * 0.4} H${cx + r * 0.7}" ${g}/><path d="M${cx + r * 0.8} ${cy - r * 0.2} H${cx + r * 0.2} V${cy - r * 0.6}" ${g}/><circle cx="${cx - r * 0.1}" cy="${cy - r * 0.4}" r="${r * 0.06}" fill="${b}"/><circle cx="${cx + r * 0.2}" cy="${cy - r * 0.6}" r="${r * 0.06}" fill="${b}"/><rect x="${cx - r * 0.18}" y="${cy + r * 0.22}" width="${r * 0.36}" height="${r * 0.36}" rx="4" ${g}/>`
    case 'barcode':
      return Array.from({ length: 18 }, (_, i) => { const x = cx - r * 0.8 + i * (r * 1.6 / 18); const w = (i % 3 ? 1 : 2.5) * (r * 0.03); return `<rect x="${x}" y="${cy - r * 0.5}" width="${w}" height="${r}" fill="${a}"/>` }).join('')
    case 'waveform':
      return Array.from({ length: 14 }, (_, i) => { const x = cx - r * 0.8 + i * (r * 1.55 / 14); const h = (0.2 + Math.abs(Math.sin(i * 1.7)) * 0.9) * r; return `<rect x="${x}" y="${cy + r * 0.55 - h}" width="${r * 0.07}" height="${h}" rx="2" fill="${i % 2 ? b : a}"/>` }).join('')
    case 'pulse':
      return `<path d="M${cx - r} ${cy} H${cx - r * 0.35} L${cx - r * 0.2} ${cy - r * 0.6} L${cx} ${cy + r * 0.6} L${cx + r * 0.15} ${cy} H${cx + r}" ${g}/>`
    case 'duality':
      return `${T('UØ', r * 0.5, '#22d3ee', cy - r * 0.4)}${T('DØ', r * 0.5, '#ff6a00', cy + r * 0.4)}<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#fff" stroke-opacity="0.4"/>`
    case 'leopard':
      return Array.from({ length: 9 }, (_, i) => { const ang = i * 0.9; const x = cx + Math.cos(ang) * r * (0.3 + (i % 3) * 0.22); const y = cy + Math.sin(ang * 1.3) * r * (0.3 + (i % 2) * 0.3); return `<circle cx="${x}" cy="${y}" r="${r * 0.1}" fill="none" stroke="${i % 2 ? b : a}" stroke-width="${r * 0.04}"/>` }).join('') + T('LEOPARDØ', r * 0.16, '#fff')
    case 'skyline':
      return `<circle cx="${cx}" cy="${cy - r * 0.2}" r="${r * 0.28}" fill="${a}"/>` + Array.from({ length: 11 }, (_, i) => { const x = cx - r * 0.85 + i * (r * 1.7 / 11); const h = (0.4 + Math.abs(Math.sin(i * 2.3)) * 0.8) * r; return `<rect x="${x}" y="${cy + r * 0.6 - h}" width="${r * 0.12}" height="${h}" fill="#0c0a14" stroke="${b}" stroke-opacity="0.6"/>` }).join('')
    case 'mandala':
      return `<circle cx="${cx}" cy="${cy}" r="${r * 0.85}" ${g}/><circle cx="${cx}" cy="${cy}" r="${r * 0.6}" stroke="${b}" fill="none" stroke-width="${r * 0.025}"/>` + Array.from({ length: 8 }, (_, i) => { const ang = (i / 8) * Math.PI * 2; return `<ellipse cx="${cx + Math.cos(ang) * r * 0.55}" cy="${cy + Math.sin(ang) * r * 0.55}" rx="${r * 0.1}" ry="${r * 0.26}" transform="rotate(${(ang * 180) / Math.PI + 90} ${cx + Math.cos(ang) * r * 0.55} ${cy + Math.sin(ang) * r * 0.55})" stroke="${a}" fill="none" stroke-width="${r * 0.02}"/>` }).join('') + `<circle cx="${cx}" cy="${cy}" r="${r * 0.1}" fill="${a}"/>`
    case 'eclipse':
      return `<circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="#04050a" stroke="${a}" stroke-width="${r * 0.05}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="none" stroke="${b}" stroke-opacity="0.5" stroke-width="${r * 0.04}"/>`
    case 'crest':
      return `<path d="M${cx} ${cy - r * 0.8} L${cx + r * 0.6} ${cy - r * 0.4} V${cy + r * 0.2} Q${cx + r * 0.6} ${cy + r * 0.7} ${cx} ${cy + r * 0.85} Q${cx - r * 0.6} ${cy + r * 0.7} ${cx - r * 0.6} ${cy + r * 0.2} V${cy - r * 0.4} Z" ${g}/>${T('LØ', r * 0.4, '#fff', cy - r * 0.05)}${T('EST 2026', r * 0.12, a, cy + r * 0.4)}`
    case 'vinyl':
      return `<circle cx="${cx}" cy="${cy}" r="${r * 0.85}" fill="none" stroke="${a}" stroke-width="${r * 0.5}" stroke-opacity="0.12"/><circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="${a}"/>${T('Ø', r * 0.3, '#fff')}<circle cx="${cx}" cy="${cy}" r="${r * 0.05}" fill="#04050a"/>`
    case 'bundle':
      return `<rect x="${cx - r * 0.6}" y="${cy - r * 0.3}" width="${r * 0.7}" height="${r * 0.7}" rx="6" transform="rotate(-8 ${cx} ${cy})" fill="none" stroke="${b}" stroke-width="${r * 0.03}"/><rect x="${cx - r * 0.1}" y="${cy - r * 0.45}" width="${r * 0.7}" height="${r * 0.7}" rx="6" transform="rotate(8 ${cx} ${cy})" ${g}/>${T('×', r * 0.5, '#fff')}`
    case 'tracklist':
      return Array.from({ length: 8 }, (_, i) => `<line x1="${cx - r * 0.7}" y1="${cy - r * 0.6 + i * r * 0.17}" x2="${cx + r * 0.7}" y2="${cy - r * 0.6 + i * r * 0.17}" stroke="${i % 2 ? b : a}" stroke-width="${r * 0.03}" stroke-opacity="0.8"/>`).join('') + T('DYSTØPIA', r * 0.16, '#fff', cy + r * 0.8)
    case 'goggle':
      return `<path d="M${cx - r * 0.85} ${cy - r * 0.2} L${cx - r * 0.1} ${cy - r * 0.35} L${cx - r * 0.05} ${cy + r * 0.1} L${cx - r * 0.85} ${cy + r * 0.25} Z" fill="${a}" fill-opacity="0.3" stroke="${a}" stroke-width="${r * 0.03}"/><path d="M${cx + r * 0.85} ${cy - r * 0.2} L${cx + r * 0.1} ${cy - r * 0.35} L${cx + r * 0.05} ${cy + r * 0.1} L${cx + r * 0.85} ${cy + r * 0.25} Z" fill="${b}" fill-opacity="0.3" stroke="${b}" stroke-width="${r * 0.03}"/>`
    case 'grid':
      return `<circle cx="${cx}" cy="${cy - r * 0.2}" r="${r * 0.4}" fill="${a}"/><rect x="${cx - r * 0.4}" y="${cy - r * 0.5}" width="${r * 0.8}" height="${r * 0.6}" fill="#04050a" opacity="0.5"/>` + Array.from({ length: 5 }, (_, i) => `<line x1="${cx - r}" y1="${cy + r * 0.2 + i * r * 0.15}" x2="${cx + r}" y2="${cy + r * 0.2 + i * r * 0.15}" stroke="${b}" stroke-opacity="0.6" stroke-width="2"/>`).join('')
    case 'cover':
    default:
      return `<rect x="${cx - r * 0.85}" y="${cy - r * 0.85}" width="${r * 1.7}" height="${r * 1.7}" rx="8" fill="#0c0a14" stroke="${a}" stroke-width="${r * 0.03}"/>${T('Ø', r * 0.7, a)}${T('DYSTØPIA', r * 0.16, '#fff', cy + r * 0.62)}`
  }
}

function makeSVG(p) {
  const [a, b] = GLOW[p.glow] || GLOW.mix
  const kind = archetype(p)
  const { shape } = silhouette(kind, a)
  const { clip, box } = clipbox(kind)
  const em = emblem(p, a, b, box)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="34%" r="75%">
      <stop offset="0%" stop-color="#141022"/><stop offset="55%" stop-color="#0a0812"/><stop offset="100%" stop-color="#04050a"/>
    </radialGradient>
    <radialGradient id="halo" cx="50%" cy="42%" r="52%">
      <stop offset="0%" stop-color="${a}" stop-opacity="0.26"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fab" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1d1830"/><stop offset="55%" stop-color="#140f1f"/><stop offset="100%" stop-color="#0a0712"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>
    <clipPath id="cp">${clip}</clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <ellipse cx="${CX}" cy="690" rx="230" ry="42" fill="${a}" opacity="0.16"/>
  <g>${shape}</g>
  <g clip-path="url(#cp)">
    <g filter="url(#glow)" opacity="0.9">${em}</g>
    <g>${em}</g>
  </g>
  <text x="40" y="60" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="3" fill="#e6e9f2">LEOPARD<tspan fill="${a}">Ø</tspan></text>
  <text x="40" y="752" font-family="Arial, sans-serif" font-weight="800" font-size="22" fill="#cbd2e0">${esc(p.name)}</text>
  <text x="760" y="752" text-anchor="end" font-family="monospace" font-size="14" letter-spacing="2" fill="#6b7280">${esc(p.typeLabel.toUpperCase())}</text>
</svg>`
}

let n = 0
for (const p of merch) {
  writeFileSync(join(OUT, `${p.id}.svg`), makeSVG(p))
  n++
}
console.log('generated', n, 'mockups →', OUT)
