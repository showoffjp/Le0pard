import { useEffect } from 'react'
import { useAudio } from '../store/useAudio'
import { tickSignal } from './audioSignal'

/**
 * Single requestAnimationFrame loop that advances the audio-reactive signal.
 * Runs for the whole app lifetime; idles to zero when nothing is playing.
 */
export function useAudioClock() {
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { playing, trackIndex } = useAudio.getState()
      tickSignal(now / 1000, dt, playing, trackIndex)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
}
