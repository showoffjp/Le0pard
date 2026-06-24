import { create } from 'zustand'
import { dystopia } from '../data/music'

/**
 * The single source of truth for playback. The AudioEngine component reads this
 * and drives one <audio> element; the visualizer is welded to that element via
 * a WebAudio analyser, so the whole site reacts to the real track playing.
 */
type AudioState = {
  trackIndex: number
  playing: boolean
  /** True after the first play — reveals the Now Playing dock. */
  started: boolean
  currentTime: number
  duration: number
  /** A seek request the engine applies to the <audio> element, then clears. */
  pendingSeek: number | null
  play: (i?: number) => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (t: number) => void
  clearSeek: () => void
  setMeta: (m: { currentTime?: number; duration?: number }) => void
}

const count = dystopia.tracks.length
const fresh = (i: number, s: AudioState) => i !== s.trackIndex

export const useAudio = create<AudioState>((set) => ({
  trackIndex: 0,
  playing: false,
  started: false,
  currentTime: 0,
  duration: 0,
  pendingSeek: null,
  play: (i) =>
    set((s) => ({
      playing: true,
      started: true,
      trackIndex: i ?? s.trackIndex,
      currentTime: i != null && fresh(i, s) ? 0 : s.currentTime,
      duration: i != null && fresh(i, s) ? 0 : s.duration,
    })),
  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing, started: true })),
  next: () =>
    set((s) => ({
      trackIndex: (s.trackIndex + 1) % count,
      playing: true,
      started: true,
      currentTime: 0,
      duration: 0,
    })),
  prev: () =>
    set((s) => ({
      trackIndex: (s.trackIndex - 1 + count) % count,
      playing: true,
      started: true,
      currentTime: 0,
      duration: 0,
    })),
  seek: (t) => set({ pendingSeek: t }),
  clearSeek: () => set({ pendingSeek: null }),
  setMeta: (m) => set(m),
}))
