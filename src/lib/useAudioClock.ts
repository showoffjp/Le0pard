import { useEffect } from 'react'
import { useAudio } from '../store/useAudio'
import { tickSignal, ambient } from './audioSignal'
import { isLive, tickLive } from './audioReactor'

/**
 * Single requestAnimationFrame loop that advances the audio-reactive signal.
 * Uses the LIVE analyser when Reactive Mode is on, otherwise the synthetic
 * beat. Runs for the whole app lifetime; idles to zero when nothing is playing.
 */
export function useAudioClock() {
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (isLive()) {
        tickLive(now / 1000, dt)
      } else {
        const { playing, trackIndex } = useAudio.getState()
        tickSignal(now / 1000, dt, playing || ambient.active, trackIndex)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
}
