/**
 * Live, mutable audio-reactive signal — read every frame by the 3D scene and
 * the DOM visualizer; it never triggers React re-renders.
 *
 * Real frequency analysis from the Bandcamp <iframe> is impossible (cross-origin),
 * so until self-hosted preview audio exists this synthesizes a believable,
 * per-track beat/energy spectrum. Swap `tickSignal` for a WebAudio AnalyserNode
 * feed later and every consumer keeps working unchanged.
 */
export type Signal = {
  energy: number // overall loudness 0..1
  bass: number
  mid: number
  treble: number
  beat: number // spikes on each kick, decays
  level: number // 0 idle → 1 fully playing (eased)
}

export const signal: Signal = { energy: 0, bass: 0, mid: 0, treble: 0, beat: 0, level: 0 }

function hash(n: number) {
  let x = (n + 1) * 2654435761
  x = (x ^ (x >>> 15)) >>> 0
  return x
}

export type TrackParams = { bpm: number; bassWeight: number; trebleWeight: number; drive: number }

/** Deterministic per-track character so every song drives a distinct vibe. */
export function trackParams(index: number): TrackParams {
  const h = hash(index < 0 ? 0 : index)
  return {
    bpm: 80 + (h % 68), // 80..147
    bassWeight: 0.85 + ((h >> 3) % 30) / 100, // 0.85..1.14
    trebleWeight: 0.7 + ((h >> 7) % 50) / 100, // 0.70..1.19
    drive: 0.82 + ((h >> 11) % 38) / 100, // 0.82..1.19
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const damp = (a: number, b: number, lambda: number, dt: number) =>
  a + (b - a) * (1 - Math.exp(-lambda * dt))

export function tickSignal(elapsed: number, dt: number, playing: boolean, trackIndex: number) {
  const p = trackParams(trackIndex)
  signal.level = damp(signal.level, playing ? 1 : 0, 3, dt)

  const beatHz = p.bpm / 60
  const phase = (elapsed * beatHz) % 1
  const kick = Math.pow(1 - phase, 5)
  const offPhase = (elapsed * beatHz + 0.5) % 1
  const hat = Math.pow(1 - offPhase, 9) * 0.6

  const bass = clamp01((0.3 + 0.7 * kick) * p.bassWeight)
  const mid = clamp01(0.3 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * 5.3 + trackIndex)))
  const treble = clamp01((0.2 + 0.5 * (0.5 + 0.5 * Math.sin(elapsed * 11.7))) * p.trebleWeight + hat)
  const energy = clamp01((0.22 + 0.78 * (bass * 0.5 + mid * 0.22 + treble * 0.28)) * p.drive)

  const L = signal.level
  signal.beat = damp(signal.beat, kick * L, 22, dt)
  signal.bass = damp(signal.bass, bass * L, 16, dt)
  signal.mid = damp(signal.mid, mid * L, 12, dt)
  signal.treble = damp(signal.treble, treble * L, 22, dt)
  signal.energy = damp(signal.energy, energy * L, 10, dt)
}
