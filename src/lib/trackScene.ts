import { Color } from 'three'
import { dystopia } from '../data/music'

/**
 * Per-track "scene" character — one signature flavor per song, layered on top of
 * the scroll-driven UTØPIA→DYSTØPIA palette so the WHOLE WORLD feels distinct
 * for every track: a signature accent hue, fog + grid tints, a bloom lean, a
 * camera-drift phase, plus the original distortion/spin/warmth biases.
 *
 * The accent follows the album's narrative arc — early tracks lean cyan/blue
 * (UTØPIA), late tracks lean violet/purple with ember at the end (DYSTØPIA) —
 * with a deterministic per-track jitter so neighbors still feel different.
 * Deterministic + cached (no per-frame alloc). Accents stay on-brand: cyan /
 * blue / indigo / violet / purple / ember — no pink/magenta.
 */
const ACCENTS = ['#22d3ee', '#3b82f6', '#6366f1', '#7c5cff', '#a855f7', '#ff6a00']
const FOG_BASE = new Color('#06122a')
const GRID_BASE = new Color('#7c3aed')

export type TrackScene = {
  accent: Color
  distort: number
  spin: number
  warmth: number
  /** Fog color leaned toward the accent (pre-mixed — lerp the scene fog to it). */
  fog: Color
  /** Neon-grid section-line color for this track. */
  grid: Color
  /** Per-track bloom lean (±) that climbs slightly across the album arc. */
  bloom: number
  /** Camera-drift phase so each track orbits the core differently. */
  orbit: number
}

const cache = new Map<number, TrackScene>()

function h(n: number, k: number) {
  const x = Math.sin((n + 1) * 99.13 + k * 47.7) * 43758.5453
  return x - Math.floor(x)
}

export function trackScene(index: number): TrackScene {
  const i = index < 0 ? 0 : index
  const cached = cache.get(i)
  if (cached) return cached
  const n = Math.max(2, dystopia.tracks.length)
  const arc = Math.min(1, i / (n - 1)) // 0 = UTØPIA … 1 = DYSTØPIA
  const slot = Math.round(arc * (ACCENTS.length - 1) + (h(i, 1) - 0.5) * 1.4)
  const accent = new Color(ACCENTS[Math.min(ACCENTS.length - 1, Math.max(0, slot))])
  const scene: TrackScene = {
    accent,
    distort: 0.03 + h(i, 2) * 0.12,
    spin: (h(i, 3) - 0.5) * 0.18,
    warmth: h(i, 4),
    fog: FOG_BASE.clone().lerp(accent, 0.3).multiplyScalar(0.8),
    grid: GRID_BASE.clone().lerp(accent, 0.65),
    bloom: (h(i, 5) - 0.5) * 0.3 + arc * 0.2,
    orbit: h(i, 6) * Math.PI * 2,
  }
  cache.set(i, scene)
  return scene
}
