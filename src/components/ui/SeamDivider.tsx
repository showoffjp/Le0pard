import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useExperience } from '../../store/useExperience'
import { GoggleMark } from './GoggleMark'

/** An animated "act break" between sections — neon seams draw out from the
 *  leopard-visor glyph as it scrolls into view. */
export function SeamDivider({ label }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  useLayoutEffect(() => {
    if (reduced) return
    const root = ref.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.from('[data-seam]', {
        scaleX: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 92%' },
      })
      gsap.from('[data-seam-mark]', {
        opacity: 0,
        scale: 0.6,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 92%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div
      ref={ref}
      className="relative z-10 mx-auto flex max-w-7xl items-center gap-5 px-5 py-12 md:px-8"
    >
      <div
        data-seam
        className="h-px flex-1 origin-right bg-gradient-to-l from-neon-purple/70 via-neon-violet/30 to-transparent"
      />
      <div data-seam-mark className="flex flex-col items-center gap-1.5">
        <GoggleMark
          className="h-5 w-auto"
          style={{ filter: 'drop-shadow(0 0 9px rgba(124,92,255,.55))' }}
        />
        {label && (
          <span className="font-mono text-[0.52rem] uppercase tracking-widest3 text-slate-600">
            {label}
          </span>
        )}
      </div>
      <div
        data-seam
        className="h-px flex-1 origin-left bg-gradient-to-r from-neon-purple/70 via-neon-violet/30 to-transparent"
      />
    </div>
  )
}
