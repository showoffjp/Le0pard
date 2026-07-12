import { useEffect, useRef } from 'react'
import { useExperience } from '../../store/useExperience'

const isCoarse =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

/** A neon glow follower that trails the cursor (desktop only). */
export function NeonCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCoarse) return
    // Reduced motion: the ring tracks the pointer instantly instead of trailing
    // with inertia, so there's no decorative lag/motion — the glow still shows.
    const reduced = useExperience.getState().reducedMotion
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`
      if (reduced && ring.current) ring.current.style.transform = `translate(${mx}px, ${my}px)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    if (!reduced) {
      const loop = () => {
        rx += (mx - rx) * 0.18
        ry += (my - ry) * 0.18
        if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  if (isCoarse) return null

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-4 -mt-4 h-8 w-8 rounded-full border border-neon-purple/60 mix-blend-screen"
        style={{ transform: 'translate(-100px, -100px)', boxShadow: '0 0 14px rgba(124,92,255,.5)' }}
        aria-hidden="true"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-1 -mt-1 h-2 w-2 rounded-full bg-neon-cyan mix-blend-screen"
        style={{ transform: 'translate(-100px, -100px)', boxShadow: '0 0 12px #22d3ee' }}
        aria-hidden="true"
      />
    </>
  )
}
