import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useExperience } from '../store/useExperience'

gsap.registerPlugin(ScrollTrigger)

/**
 * Owns smooth scrolling (Lenis) and wires it to GSAP ScrollTrigger so we can
 * scrub cinematic, layered animations to scroll. Also feeds global scroll
 * progress + scrollTo() into the experience store for the 3D scene + HUD.
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
      ScrollTrigger.update()
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

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Make ScrollTrigger measure correctly once fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh()
    const refreshId = window.setTimeout(refresh, 350)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(refreshId)
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.off('scroll', onScroll)
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
