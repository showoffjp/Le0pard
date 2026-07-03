import { create } from 'zustand'

const KEY = 'leopardo-omega'

function readUnlocked(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * The hidden "ØMEGA Signal". Unlocked by the secret key sequence or by entering a
 * secret handle in the citizen form. Persists so a finder keeps ØMEGA status.
 */
type SecretState = {
  unlocked: boolean
  /** True while the ØMEGA TRANSMISSION overlay is showing. */
  open: boolean
  /** Just unlocked this session (drives the reveal animation). */
  fresh: boolean
  unlock: () => void
  show: () => void
  hide: () => void
}

export const useSecret = create<SecretState>((set, get) => ({
  unlocked: readUnlocked(),
  open: false,
  fresh: false,
  unlock: () => {
    if (get().unlocked) {
      set({ open: true })
      return
    }
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* storage blocked */
    }
    set({ unlocked: true, open: true, fresh: true })
  },
  show: () => set({ open: true }),
  hide: () => set({ open: false, fresh: false }),
}))
