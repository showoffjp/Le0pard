import { create } from 'zustand'
import { dystopia } from '../data/music'
import {
  enableLiveCapture,
  disableLiveCapture,
  type ReactiveStatus,
} from '../lib/audioReactor'

type AudioState = {
  playing: boolean
  trackIndex: number
  /** True after the first play — used to reveal the Now Playing dock. */
  started: boolean
  /** Live-capture ("Reactive Mode") connection state. */
  reactiveStatus: ReactiveStatus
  play: (i?: number) => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  /** Ask permission to capture + analyze the playing tab's real audio. */
  enableReactive: () => Promise<void>
  disableReactive: () => void
}

const count = dystopia.tracks.length

export const useAudio = create<AudioState>((set) => ({
  playing: false,
  trackIndex: 0,
  started: false,
  reactiveStatus: 'off',
  play: (i) => set((s) => ({ playing: true, started: true, trackIndex: i ?? s.trackIndex })),
  pause: () => set({ playing: false }),
  toggle: () => set((s) => ({ playing: !s.playing, started: true })),
  next: () => set((s) => ({ trackIndex: (s.trackIndex + 1) % count, playing: true, started: true })),
  prev: () =>
    set((s) => ({ trackIndex: (s.trackIndex - 1 + count) % count, playing: true, started: true })),

  enableReactive: async () => {
    set({ reactiveStatus: 'connecting' })
    const status = await enableLiveCapture()
    set(status === 'on' ? { reactiveStatus: status, started: true } : { reactiveStatus: status })
  },
  disableReactive: () => {
    void disableLiveCapture()
    set({ reactiveStatus: 'off' })
  },
}))
