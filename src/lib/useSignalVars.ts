import { useEffect } from 'react'
import { signal } from './audioSignal'

/**
 * The "reactive bus" for the DOM. Mirrors the live audio signal onto CSS custom
 * properties on <html> every frame, so any element can react to the song with
 * pure CSS — buttons swell on the beat, text glows/bops, backgrounds morph.
 *
 * One rAF write per frame; no React re-renders. Values idle at 0 when nothing
 * plays, so the site only "comes alive" while music is driving the signal.
 */
export function useSignalVars() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const set = (k: string, v: number) => root.style.setProperty(k, v.toFixed(3))
    const loop = () => {
      set('--s-level', signal.level)
      set('--s-beat', signal.beat)
      set('--s-bass', signal.bass)
      set('--s-mid', signal.mid)
      set('--s-treble', signal.treble)
      set('--s-energy', signal.energy)
      set('--s-drop', signal.drop)
      set('--s-buildup', signal.buildup)
      set('--s-impact', signal.impact)
      set('--s-intensity', signal.intensity)
      // derived: trippy hue swing that spikes on drops
      set('--s-hue', signal.drop * 60 + signal.energy * 16)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
}
