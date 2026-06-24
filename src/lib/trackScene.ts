import { Color } from 'three'

/**
 * Per-track "scene" character — one signature flavor per song, layered on top of
 * the scroll-driven UTØPIA→DYSTØPIA palette so the core orb feels distinct for
 * every track: a signature accent hue, a touch more/less molten distortion, a
 * subtle spin bias, and a warmth lean. Deterministic + cached (no per-frame alloc).
 *
 * Accents stay on-brand: cyan / blue / indigo / violet / purple, with ember used
 * sparingly (1 of 6) — no pink/magenta.
 */
const ACCENTS = ['#22d3ee', '#3b82f6', '#6366f1', '#7c5cff', '#a855f7', '#ff6a00']

export type TrackScene = { accent: Color; distort: number; spin: number; warmth: number }

const cache = new Map<number, TrackScene>()

function h(n: number, k: number) {
  const x = Math.sin((n + 1) * 99.13 + k * 47.7) * 43758.5453
  return x - Math.floor(x)
}

export function trackScene(index: number): TrackScene {
  const i = index < 0 ? 0 : index
  const cached = cache.get(i)
  if (cached) return cached
  const scene: TrackScene = {
    accent: new Color(ACCENTS[Math.floor(h(i, 1) * ACCENTS.length) % ACCENTS.length]),
    distort: 0.03 + h(i, 2) * 0.12,
    spin: (h(i, 3) - 0.5) * 0.18,
    warmth: h(i, 4),
  }
  cache.set(i, scene)
  return scene
}
