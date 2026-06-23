import { useEffect, useRef } from 'react'
import { signal } from '../../lib/audioSignal'
import { useExperience } from '../../store/useExperience'

/**
 * Sells "the entire site reacts" in the DOM layer: the whole page bounces to the
 * beat + sways with the bass every frame, a full-screen neon flash fires on each
 * bass DROP, and the page shakes + scale-punches on impact. Reads the shared
 * signal each frame — never re-renders. Respects reduced motion.
 */
export function DropFlash() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const main = document.getElementById('experience-content')
    let moving = false

    const loop = () => {
      const d = signal.drop
      const reduced = useExperience.getState().reducedMotion
      const el = ref.current
      if (el) el.style.opacity = String(Math.min(0.85, d * 0.85))

      if (main) {
        if (reduced) {
          if (moving) {
            main.style.transform = ''
            moving = false
          }
        } else {
          const tm = performance.now()
          const beat = signal.beat
          const bass = signal.bass
          // continuous bounce to the beat + bass sway (the site moves with the music)
          const bob = -(beat * 11 + bass * 6)
          const sway = Math.sin(tm * 0.0013) * bass * 6
          // explosive shake + scale punch on the drop
          const shx = Math.sin(tm * 0.13) * 16 * d
          const shy = Math.cos(tm * 0.11) * 13 * d
          const x = sway + shx
          const y = bob + shy
          const s = 1 + bass * 0.012 + d * 0.05
          if (Math.abs(x) + Math.abs(y) > 0.12 || s > 1.001) {
            main.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
            moving = true
          } else if (moving) {
            main.style.transform = ''
            moving = false
          }
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
