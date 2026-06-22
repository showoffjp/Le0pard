import { create } from 'zustand'

type Pointer = { x: number; y: number }

type ScrollTo = (target: string | number, opts?: { offset?: number; immediate?: boolean }) => void

type ExperienceState = {
  /** Global scroll progress, 0 → 1 across the whole page. */
  progress: number
  /** Normalized pointer position, each axis in [-1, 1]. */
  pointer: Pointer
  /** True once the intro loader has handed off. */
  ready: boolean
  /** True when the user prefers reduced motion. */
  reducedMotion: boolean
  /** Mobile-tier devices get a lighter 3D scene. */
  lowPower: boolean
  /** Mobile nav overlay state. */
  menuOpen: boolean
  /** Smooth scroll-to, wired up by the Lenis controller. */
  scrollTo: ScrollTo

  setProgress: (p: number) => void
  setPointer: (p: Pointer) => void
  setReady: (r: boolean) => void
  setMenuOpen: (m: boolean) => void
  setScrollTo: (fn: ScrollTo) => void
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const isLowPower =
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(max-width: 820px)').matches ||
    (navigator.hardwareConcurrency ?? 8) <= 4)

export const useExperience = create<ExperienceState>((set) => ({
  progress: 0,
  pointer: { x: 0, y: 0 },
  ready: false,
  reducedMotion: !!prefersReduced,
  lowPower: !!isLowPower,
  menuOpen: false,
  scrollTo: () => {},

  setProgress: (progress) => set({ progress }),
  setPointer: (pointer) => set({ pointer }),
  setReady: (ready) => set({ ready }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setScrollTo: (scrollTo) => set({ scrollTo }),
}))
