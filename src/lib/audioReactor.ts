/**
 * Manages the optional LIVE audio source for the reactor.
 *
 * Today: "Reactive Mode" captures the playing browser tab's audio via
 * getDisplayMedia and feeds a real WebAudio AnalyserNode → genuine bass-drop
 * sync to whatever is actually playing (Bandcamp included).
 *
 * Tomorrow (option 1, zero rework): `attachMediaElement` wires a self-hosted /
 * CORS-enabled <audio> element into the very same analyser path.
 */
import { tickLiveFromAnalyser } from './audioSignal'

export type ReactiveStatus = 'off' | 'connecting' | 'on' | 'denied' | 'unsupported'

let ctx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let data: Uint8Array | null = null
let stream: MediaStream | null = null
// Hold a reference so the source node isn't garbage-collected.
let source: AudioNode | null = null
let live = false

export function isLive() {
  return live && !!analyser && !!data
}

export function tickLive(_elapsed: number, dt: number) {
  if (analyser && data) tickLiveFromAnalyser(analyser, data, dt)
}

/** Fill `out` with the current byte frequency spectrum (for the canvas visualizer). */
export function sampleFrequency(out: Uint8Array): boolean {
  if (!analyser) return false
  analyser.getByteFrequencyData(out as Uint8Array<ArrayBuffer>)
  return true
}

/** Fill `out` with the current time-domain waveform. */
export function sampleWaveform(out: Uint8Array): boolean {
  if (!analyser) return false
  analyser.getByteTimeDomainData(out as Uint8Array<ArrayBuffer>)
  return true
}

export function analyserSampleRate(): number {
  return analyser?.context.sampleRate ?? 48000
}

function AudioCtor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null
  return window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || null
}

function buildAnalyser(srcNode: AudioNode) {
  const a = ctx!.createAnalyser()
  a.fftSize = 1024
  // Low smoothing so bass transients/drops aren't flattened out (snappy + in-time).
  a.smoothingTimeConstant = 0.28
  // Wide dB window spanning the real bass range (~-58..-6 dBFS) so a hot master
  // isn't clipped flat at max — preserves the dynamics drop detection needs.
  a.minDecibels = -58
  a.maxDecibels = -6
  srcNode.connect(a)
  source = srcNode
  analyser = a
  data = new Uint8Array(a.frequencyBinCount)
}

/** Capture the playing tab's audio and start analyzing it. */
export async function enableLiveCapture(): Promise<ReactiveStatus> {
  const md = navigator.mediaDevices as MediaDevices | undefined
  const Ctor = AudioCtor()
  if (!md || typeof md.getDisplayMedia !== 'function' || !Ctor) return 'unsupported'

  try {
    const s = await md.getDisplayMedia({ video: true, audio: true })
    const audioTracks = s.getAudioTracks()
    // We only want the audio — release the screen/tab video immediately.
    s.getVideoTracks().forEach((t) => t.stop())
    if (audioTracks.length === 0) {
      s.getTracks().forEach((t) => t.stop())
      return 'denied'
    }
    stream = s
    ctx = new Ctor()
    if (ctx.state === 'suspended') await ctx.resume()
    const src = ctx.createMediaStreamSource(new MediaStream(audioTracks))
    buildAnalyser(src)
    // Do NOT route to destination — avoids echoing the captured audio.
    live = true
    audioTracks[0].addEventListener('ended', () => {
      void disableLiveCapture()
    })
    return 'on'
  } catch {
    await disableLiveCapture()
    return 'denied'
  }
}

/**
 * OPTION 1 (later): analyze a self-hosted / CORS-enabled audio element.
 * Routes through to the speakers so the clip stays audible.
 */
export async function attachMediaElement(el: HTMLMediaElement): Promise<ReactiveStatus> {
  const Ctor = AudioCtor()
  if (!Ctor) return 'unsupported'
  try {
    ctx = ctx ?? new Ctor()
    if (ctx.state === 'suspended') await ctx.resume()
    const src = ctx.createMediaElementSource(el)
    src.connect(ctx.destination)
    buildAnalyser(src)
    live = true
    return 'on'
  } catch {
    return 'denied'
  }
}

export async function disableLiveCapture() {
  live = false
  if (source) {
    try {
      source.disconnect()
    } catch {
      /* noop */
    }
    source = null
  }
  analyser = null
  data = null
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  if (ctx) {
    try {
      await ctx.close()
    } catch {
      /* noop */
    }
    ctx = null
  }
}
