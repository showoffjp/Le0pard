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
      const { reducedMotion: reduced, lowPower } = useExperience.getState()
      const el = ref.current
      if (el) el.style.opacity = String(Math.min(0.5, d * 0.5))

      if (main) {
        if (reduced) {
          if (moving) {
            main.style.transform = ''
            moving = false
          }
        } else {
          const tm = performance.now()
          const I = signal.intensity
          // motion tracks MACRO-dynamics + drops, never the constant loudness —
          // the page sits perfectly still while reading and only moves on a real
          // surge/drop. On low-power (mobile) we damp the translate and DROP the
          // scale entirely — scaling the whole content layer re-rasterizes it
          // every frame, which is the worst offender for phone jank.
          const k = lowPower ? 0.45 : 1
          const bob = -(I * 26 + d * 6) * k
          const sway = Math.sin(tm * 0.0013) * I * 12 * k
          const shx = Math.sin(tm * 0.13) * 13 * d * k
          const shy = Math.cos(tm * 0.11) * 11 * d * k
          const x = sway + shx
          const y = bob + shy
          const s = lowPower ? 1 : 1 + I * 0.012 + d * 0.05
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
