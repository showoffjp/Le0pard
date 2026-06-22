import { useEffect, useRef } from 'react'
import { signal } from '../../lib/audioSignal'
import { useExperience } from '../../store/useExperience'

/**
 * Sells "the entire site reacts" in the DOM layer: a full-screen neon flash on
 * every bass DROP, plus a brief screen shake of the page content. Reads the
 * shared signal each frame — never re-renders. Respects reduced motion.
 */
export function DropFlash() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const main = document.getElementById('experience-content')
    let shaking = false

    const loop = () => {
      const d = signal.drop
      const reduced = useExperience.getState().reducedMotion
      const el = ref.current
      if (el) el.style.opacity = String(Math.min(0.6, d * 0.62))

      if (main) {
        if (!reduced && d > 0.02) {
          const tm = performance.now()
          const x = Math.sin(tm * 0.09) * 7 * d
          const y = Math.cos(tm * 0.11) * 6 * d
          main.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
          shaking = true
        } else if (shaking) {
          main.style.transform = ''
          shaking = false
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      if (main) main.style.transform = ''
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        opacity: 0,
        background:
          'radial-gradient(circle at 50% 42%, rgba(168,85,247,.5), rgba(34,211,238,.18) 42%, transparent 72%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}
