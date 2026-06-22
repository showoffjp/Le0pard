import { create } from 'zustand'
import { dystopia } from '../data/music'

type AudioState = {
  playing: boolean
  trackIndex: number
  /** True after the first play — used to reveal the Now Playing dock. */
  started: boolean
  play: (i?: number) => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
}

const count = dystopia.tracks.length

export const useAudio = create<AudioState>((set) => ({
  playing: false,
  trackIndex: 0,
  started: false,
  play: (i) => set((s) => ({ playing: true, started: true, trackIndex: i ?? s.trackIndex })),
  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing, started: true })),
  next: () => set((s) => ({ trackIndex: (s.trackIndex + 1) % count, playing: true, started: true })),
  prev: () =>
    set((s) => ({ trackIndex: (s.trackIndex - 1 + count) % count, playing: true, started: true })),
}))
