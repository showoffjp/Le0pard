/**
 * Live, mutable audio-reactive signal — read every frame by the 3D scene and
 * the DOM visualizer; it never triggers React re-renders.
 *
 * Two sources can drive it (see useAudioClock + audioReactor):
 *   • SYNTHETIC  — a musically-structured fake beat with build-ups + drops,
 *     used when nothing real is being analyzed.
 *   • LIVE       — a real WebAudio AnalyserNode (captured tab audio today, a
 *     self-hosted <audio> element tomorrow). Every consumer stays identical.
 *
 * The `drop` engine is the headline: `buildup` ramps before a hit, `drop` is the
 * sharp impulse at the moment of the bass drop (the "splat"), `impact` is the
 * slower aftermath that powers the blob's mutation phase, and `dropId` bumps on
 * every drop so visuals can mutate into a *unique* shape each time.
 */
export type Signal = {
  energy: number // overall loudness 0..1
  bass: number
  mid: number
  treble: number
  beat: number // spikes on each kick, decays
  level: number // 0 idle → 1 fully playing (eased)
  buildup: number // 0..1 riser anticipating a drop
  drop: number // 0..1 sharp impulse at the drop (the splat trigger)
  impact: number // 0..1 slower aftermath (drives the mutation phase)
  dropId: number // increments on every drop — unique mutation seed
}

export const signal: Signal = {
  energy: 0,
  bass: 0,
  mid: 0,
  treble: 0,
  beat: 0,
  level: 0,
  buildup: 0,
  drop: 0,
  impact: 0,
  dropId: 0,
}

/**
 * Per-bar frequency spectrum for an accurate equalizer. Filled straight from the
 * live FFT (log-spaced bands, fast attack / slower release) so the dock bars
 * mirror exactly what's playing. Idles to 0 in synthetic mode / when silent.
 */
export const BAR_COUNT = 28
export const spectrum = new Float32Array(BAR_COUNT)

function hash(n: number) {
  let x = (n + 1) * 2654435761
  x = (x ^ (x >>> 15)) >>> 0
  return x
}

export type TrackParams = { bpm: number; bassWeight: number; trebleWeight: number; drive: number; phrase: number }

/** Deterministic per-track character so every song drives a distinct vibe. */
export function trackParams(index: number): TrackParams {
  const h = hash(index < 0 ? 0 : index)
  return {
    bpm: 80 + (h % 68), // 80..147
    bassWeight: 0.85 + ((h >> 3) % 30) / 100, // 0.85..1.14
    trebleWeight: 0.7 + ((h >> 7) % 50) / 100, // 0.70..1.19
    drive: 0.82 + ((h >> 11) % 38) / 100, // 0.82..1.19
    phrase: (h >> 5) % 2 === 0 ? 16 : 8, // beats per phrase → drop cadence
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const damp = (a: number, b: number, lambda: number, dt: number) =>
  a + (b - a) * (1 - Math.exp(-lambda * dt))

/** Fire a drop: spike the impulse + bump the id so consumers can mutate uniquely. */
export function emitDrop(strength = 1) {
  const s = clamp01(strength)
  if (s > signal.drop) signal.drop = s
  if (s > signal.impact) signal.impact = s
  signal.dropId++
}

/** Decay the one-shot transients every frame (shared by every signal source). */
function decayTransients(dt: number) {
  signal.drop = damp(signal.drop, 0, 6, dt)
  // impact lingers longer so the post-drop explosion/mutation is felt
  signal.impact = damp(signal.impact, 0, 0.85, dt)
}

let lastPhrase = -1

/** SYNTHETIC source — believable beat with phrase-based build-ups + drops. */
export function tickSignal(elapsed: number, dt: number, playing: boolean, trackIndex: number) {
  const p = trackParams(trackIndex)
  signal.level = damp(signal.level, playing ? 1 : 0, 3, dt)
  const L = signal.level

  const beatHz = p.bpm / 60
  const beats = elapsed * beatHz
  const phase = beats % 1
  const kick = Math.pow(1 - phase, 5)
  const offPhase = (beats + 0.5) % 1
  const hat = Math.pow(1 - offPhase, 9) * 0.6

  // Phrase structure → riser then drop on every phrase boundary.
  const phraseBeats = p.phrase
  const riserBeats = 4
  const phrase = Math.floor(beats / phraseBeats)
  const posInPhrase = beats - phrase * phraseBeats
  const rising = clamp01((posInPhrase - (phraseBeats - riserBeats)) / riserBeats)
  signal.buildup = damp(signal.buildup, rising * L, 6, dt)

  if (playing && lastPhrase >= 0 && phrase !== lastPhrase) {
    emitDrop(0.88 + (hash(phrase) % 24) / 100)
  }
  lastPhrase = phrase

  const bass = clamp01((0.3 + 0.7 * kick) * p.bassWeight + signal.drop * 0.55)
  const mid = clamp01(0.3 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * 5.3 + trackIndex)))
  const treble = clamp01(
    (0.2 + 0.5 * (0.5 + 0.5 * Math.sin(elapsed * 11.7))) * p.trebleWeight + hat + rising * 0.45,
  )
  const energy = clamp01(
    (0.22 + 0.78 * (bass * 0.5 + mid * 0.22 + treble * 0.28)) * p.drive + signal.buildup * 0.18,
  )

  signal.beat = damp(signal.beat, kick * L, 22, dt)
  signal.bass = damp(signal.bass, bass * L, 16, dt)
  signal.mid = damp(signal.mid, mid * L, 12, dt)
  signal.treble = damp(signal.treble, treble * L, 22, dt)
  signal.energy = damp(signal.energy, energy * L, 10, dt)

  decayTransients(dt)
}

let liveBassAvg = 0
let liveSince = 0

/** LIVE source — real frequency analysis with onset-based drop detection. */
export function tickLiveFromAnalyser(analyser: AnalyserNode, data: Uint8Array, dt: number) {
  analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>)
  const n = data.length
  const band = (lo: number, hi: number) => {
    const a = Math.max(0, lo)
    const b = Math.min(n - 1, hi)
    let s = 0
    for (let i = a; i <= b; i++) s += data[i]
    return s / ((b - a + 1) * 255)
  }

  // fftSize 1024 → 512 bins (~46 Hz/bin @ 48k): sub/bass, mids, highs.
  const bass = clamp01(band(1, 8) * 1.7)
  const mid = clamp01(band(9, 60) * 1.15)
  const treble = clamp01(band(61, 200) * 1.3)
  const energy = clamp01((bass * 0.6 + mid * 0.24 + treble * 0.2) * 1.18)

  signal.level = damp(signal.level, energy > 0.03 ? 1 : 0, 3, dt)
  signal.bass = damp(signal.bass, bass, 24, dt)
  signal.mid = damp(signal.mid, mid, 16, dt)
  signal.treble = damp(signal.treble, treble, 26, dt)
  signal.energy = damp(signal.energy, energy, 14, dt)
  signal.beat = damp(signal.beat, bass, 28, dt)

  // Onset-based drop detection: a sharp surge in low-end above its moving avg.
  liveSince += dt
  signal.buildup = damp(signal.buildup, clamp01((bass - liveBassAvg) * 3.2), 5, dt)
  if (bass > 0.42 && bass > liveBassAvg * 1.3 && liveSince > 0.26) {
    emitDrop(clamp01(0.82 + (bass - liveBassAvg) * 1.4))
    liveSince = 0
  }
  liveBassAvg += (bass - liveBassAvg) * (1 - Math.exp(-2.4 * dt))

  // Accurate equalizer: log-spaced bars across the real FFT.
  const loBin = 1
  const hiBin = Math.max(loBin + 1, Math.floor(n * 0.66))
  const ratio = hiBin / loBin
  const release = 1 - Math.exp(-9 * dt)
  for (let b = 0; b < BAR_COUNT; b++) {
    const f0 = Math.floor(loBin * Math.pow(ratio, b / BAR_COUNT))
    const f1 = Math.max(f0 + 1, Math.floor(loBin * Math.pow(ratio, (b + 1) / BAR_COUNT)))
    let sum = 0
    let cnt = 0
    for (let i = f0; i < f1 && i < n; i++) {
      sum += data[i]
      cnt++
    }
    // gentle high-frequency tilt so quieter highs still register
    const target = clamp01((cnt ? sum / cnt / 255 : 0) * (1 + (b / BAR_COUNT) * 0.9))
    const prev = spectrum[b]
    spectrum[b] = target > prev ? target : prev + (target - prev) * release
  }

  decayTransients(dt)
}
