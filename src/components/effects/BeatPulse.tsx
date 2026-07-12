import { useEffect, useRef } from 'react'
import { signal } from '../../lib/audioSignal'
import { useExperience } from '../../store/useExperience'

/**
 * Full-screen neon edge-glow that breathes with the beat — sells the "the whole
 * site reacts to the song" feeling in the DOM layer (above content, below UI).
 */
export function BeatPulse() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reduced motion: skip the beat/drop pulsing entirely (a full-screen glow that
    // flashes on the drop is exactly the motion prefers-reduced-motion asks us to
    // drop). The element stays at its static opacity:0 — invisible.
    if (useExperience.getState().reducedMotion) return
    let raf = 0
    const loop = () => {
      const el = ref.current
      if (el) {
        const b = signal.beat
        const e = signal.energy
        const d = signal.drop
        el.style.opacity = String(0.02 + e * 0.04 + d * 0.3)
        el.style.boxShadow = `inset 0 0 ${60 + b * 70 + d * 200}px rgba(124,58,237,${0.05 + b * 0.1 + d * 0.4}), inset 0 0 ${28 + b * 26 + d * 70}px rgba(34,211,238,${0.03 + b * 0.05 + d * 0.2})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-30" style={{ opacity: 0 }} aria-hidden="true" />
}
