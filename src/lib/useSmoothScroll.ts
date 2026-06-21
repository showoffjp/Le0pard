import { useEffect } from 'react'
import Lenis from 'lenis'
import { useExperience } from '../store/useExperience'

/**
 * Owns the page's smooth scrolling (Lenis) and feeds global scroll progress +
 * a scrollTo() into the experience store. The 3D scene and HUD read from there.
 */
export function useSmoothScroll() {
  const setProgress = useExperience((s) => s.setProgress)
  const setScrollTo = useExperience((s) => s.setScrollTo)
  const reducedMotion = useExperience((s) => s.reducedMotion)

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0.1 : 1.15,
      lerp: reducedMotion ? 1 : 0.09,
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    const onScroll = (e: { progress: number }) => {
      setProgress(Number.isFinite(e.progress) ? e.progress : 0)
    }
    lenis.on('scroll', onScroll)

    setScrollTo((target, opts) => {
      lenis.scrollTo(target as never, {
        offset: opts?.offset ?? -80,
        duration: 1.25,
        immediate: opts?.immediate,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      })
    })

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setScrollTo(() => {})
    }
  }, [reducedMotion, setProgress, setScrollTo])
}

/** Tracks the pointer and writes a normalized [-1,1] vector into the store. */
export function usePointerTracking() {
  const setPointer = useExperience((s) => s.setPointer)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [setPointer])
}
