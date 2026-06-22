import { useEffect, useRef } from 'react'
import { signal } from '../../lib/audioSignal'

/**
 * Full-screen neon edge-glow that breathes with the beat — sells the "the whole
 * site reacts to the song" feeling in the DOM layer (above content, below UI).
 */
export function BeatPulse() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const el = ref.current
      if (el) {
        const b = signal.beat
        const e = signal.energy
        el.style.opacity = String(0.03 + e * 0.12)
        el.style.boxShadow = `inset 0 0 ${90 + b * 170}px rgba(124,58,237,${0.1 + b * 0.28}), inset 0 0 ${40 + b * 60}px rgba(34,211,238,${0.04 + b * 0.12})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-30" style={{ opacity: 0 }} aria-hidden="true" />
}
