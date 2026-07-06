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
  /** Macro-dynamics: how loud NOW is vs the song's recent baseline. ~0 during
   *  steady playback (even loud), spikes only on real build-ups/drops/surges.
   *  Everything "big" (background, page motion, flashes) is gated by this. */
  intensity: number
  /** Spectral brightness 0..1 — where the energy sits (dark/bassy → bright/airy).
   *  Tracks the *melody* moving, so colors can shimmer with the tune. Idles 0.5. */
  tone: number
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
  intensity: 0,
  tone: 0.5,
}

/**
 * Per-bar frequency spectrum for an accurate equalizer. Filled straight from the
 * live FFT (log-spaced bands, fast attack / slower release) so the dock bars
 * mirror exactly what's playing. Idles to 0 in synthetic mode / when silent.
 */
export const BAR_COUNT = 28
export const spectrum = new Float32Array(BAR_COUNT)

/**
 * "Ambient" mode: keep the synthetic signal alive even when the audio player
 * isn't playing — used while the muted launch film plays on entry, so the whole
 * site is reacting from the moment it loads. The first user gesture welds the
 * film to the real analyser (isLive()), which then takes over seamlessly.
 */
export const ambient = { active: false }

function hash(n: number) {
  let x = (n + 1) * 2654435761
  x = (x ^ (x >>> 15)) >>> 0
  return x
}

export type TrackParams = { bpm: number; bassWeight: number; trebleWeight: number; drive: number; phrase: number }

/** Deterministic per-track character so every song drives a distinct vibe. */
export function trackParams(index: number): TrackParams {
  const h = hash(index < 0 ? 0 : index)
  // Unsigned shifts (>>>): h is a uint32, and a signed >> would ToInt32 it
  // negative for any hash ≥ 2^31, making the % results negative and pushing the
  // weights below their documented floors for ~half the tracks (track 0 included).
  return {
    bpm: 80 + (h % 68), // 80..147
    bassWeight: 0.85 + ((h >>> 3) % 30) / 100, // 0.85..1.14
    trebleWeight: 0.7 + ((h >>> 7) % 50) / 100, // 0.70..1.19
    drive: 0.82 + ((h >>> 11) % 38) / 100, // 0.82..1.19
    phrase: (h >>> 5) % 2 === 0 ? 16 : 8, // beats per phrase → drop cadence
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
  signal.drop = damp(signal.drop, 0, 5, dt)
  // impact lingers longer so the post-drop explosion/mutation is felt
  signal.impact = damp(signal.impact, 0, 0.8, dt)
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
    (0.18 + 0.82 * (bass * 0.86 + mid * 0.08 + treble * 0.06)) * p.drive + signal.buildup * 0.14,
  )

  signal.beat = damp(signal.beat, kick * L, 22, dt)
  signal.bass = damp(signal.bass, bass * L, 16, dt)
  signal.mid = damp(signal.mid, mid * L, 12, dt)
  signal.treble = damp(signal.treble, treble * L, 22, dt)
  signal.energy = damp(signal.energy, energy * L, 10, dt)
  signal.tone = damp(signal.tone, L > 0.1 ? clamp01(0.34 + treble * 0.5 - bass * 0.12) : 0.5, 3, dt)

  decayTransients(dt)
}

let liveSince = 0
let bassRef = 0 // valley follower (onset baseline)
let bassSlow = 0 // slow average (build-up)
let macroAvg = 0 // ~0.7s loudness
let baseAvg = 0 // ~11s loudness baseline

/** Average of an FFT band, normalized 0..1. Module-scope so the per-frame live
 *  tick doesn't allocate a fresh closure on every call. */
function bandAvg(data: Uint8Array, n: number, lo: number, hi: number) {
  const a = Math.max(0, lo)
  const b = Math.min(n - 1, hi)
  let s = 0
  for (let i = a; i <= b; i++) s += data[i]
  return s / ((b - a + 1) * 255)
}

/** Peak of an FFT band, normalized 0..1. */
function bandPeak(data: Uint8Array, n: number, lo: number, hi: number) {
  const a = Math.max(0, lo)
  const b = Math.min(n - 1, hi)
  let m = 0
  for (let i = a; i <= b; i++) if (data[i] > m) m = data[i]
  return m / 255
}

/** LIVE source — real frequency analysis with onset-based drop detection. */
export function tickLiveFromAnalyser(analyser: AnalyserNode, data: Uint8Array, dt: number) {
  analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>)
  const n = data.length

  // Peak SUB-bass (where the kick/drop lives) — punchy and absolute (no AGC) so
  // quiet parts stay quiet and loud drops genuinely stand out.
  const bass = clamp01(bandPeak(data, n, 1, 5) * 1.25)
  const mid = clamp01(bandAvg(data, n, 9, 60) * 1.1)
  const treble = clamp01(bandAvg(data, n, 61, 200) * 1.2)
  const energy = clamp01(bass * 0.9 + mid * 0.06 + treble * 0.04)

  signal.level = damp(signal.level, energy > 0.06 ? 1 : 0, 3, dt)
  signal.bass = damp(signal.bass, bass, 32, dt)
  signal.mid = damp(signal.mid, mid, 18, dt)
  signal.treble = damp(signal.treble, treble, 24, dt)
  signal.energy = damp(signal.energy, energy, 24, dt)
  signal.beat = damp(signal.beat, bass, 36, dt)

  // Macro-dynamics: current loudness vs the song's ~11s baseline. Near 0 during
  // steady playback (even when loud); only build-ups / drops / big surges push it
  // up. The whole-page "big" reactions are gated by this so the site stays calm.
  const full = clamp01(bass * 0.45 + mid * 0.35 + treble * 0.2)
  // While not fully playing (incl. the first ~second after pressing play) keep the
  // averages GLUED to the current level so there is no cold-start surge — that
  // false jump from zero was making it explode a second into the song.
  const lev = signal.level
  if (lev < 0.6) {
    macroAvg = full
    baseAvg = full
  } else {
    macroAvg += (full - macroAvg) * (1 - Math.exp(-0.33 * dt)) // ~3s phrase loudness
    baseAvg += (full - baseAvg) * (1 - Math.exp(-0.04 * dt)) // ~25s section baseline
  }
  // SECTION-level surge with a gentle knee → nuanced + gradual; only a genuinely
  // big jump above the recent baseline reaches full. Zeroed until truly playing.
  signal.intensity = damp(signal.intensity, clamp01((macroAvg - baseAvg - 0.04) / 0.2) * lev, 4, dt)

  // Valley-relative onset on ABSOLUTE bass; strength scales with the onset AND
  // the absolute level, so a quiet groove gives tiny pops while a real loud drop
  // explodes. (Validated on the real audio: catches UTØPIA's 0:46 drop.)
  liveSince += dt
  bassSlow += (bass - bassSlow) * (1 - Math.exp(-0.4 * dt))
  signal.buildup = damp(signal.buildup, clamp01((bass - bassSlow) * 2.2), 5, dt)
  const onset = bass - bassRef
  // Drops fire on the bass hits, but ONLY while the section is already intense (a
  // real drop section) — so shocks sync to the kick during the big moments and
  // never fire during calm/steady playback.
  if (liveSince > 0.25 && signal.intensity > 0.2 && bass > 0.5 && onset > 0.1) {
    emitDrop(clamp01(0.55 + onset * 1.6 + signal.intensity * 0.3))
    liveSince = 0
  }
  if (bass < bassRef) bassRef = bass
  else bassRef += (bass - bassRef) * (1 - Math.exp(-1.0 * dt))

  // Accurate equalizer: log-spaced bars across the *content* range. The source
  // tops out ~8 kHz, so map ~40 Hz–9 kHz to keep every bar alive + punchy.
  const sr = analyser.context.sampleRate || 48000
  const binHz = sr / 2 / n
  const loBin = Math.max(1, Math.floor(40 / binHz))
  const hiBin = Math.max(loBin + 2, Math.min(n - 1, Math.floor(9000 / binHz)))
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
    // gentle high tilt + gamma curve for visual punch
    const v = clamp01((cnt ? sum / cnt / 255 : 0) * (1 + (b / BAR_COUNT) * 0.8))
    const target = Math.pow(v, 0.82)
    const prev = spectrum[b]
    spectrum[b] = target > prev ? target : prev + (target - prev) * release
  }

  // Spectral brightness (centroid in log-band space → perceptually even). High
  // when the melody/airy highs lead, low when it's all sub-bass; follows the tune.
  let cNum = 0
  let cDen = 0
  for (let b = 0; b < BAR_COUNT; b++) {
    cNum += b * spectrum[b]
    cDen += spectrum[b]
  }
  const toneRaw = cDen > 0.001 ? cNum / cDen / (BAR_COUNT - 1) : 0.5
  signal.tone = damp(signal.tone, lev > 0.1 ? clamp01(toneRaw) : 0.5, 3, dt)

  decayTransients(dt)
}
