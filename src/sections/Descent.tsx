import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useExperience } from '../store/useExperience'

/**
 * A sticky, scroll-scrubbed interlude: the word UTØPIA dissolves and DYSTØPIA
 * ignites in its place as you scroll — the album's arc made literal.
 */
export function Descent() {
  const section = useRef<HTMLElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  useLayoutEffect(() => {
    if (reduced) return
    const root = section.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.set('[data-dyst]', { opacity: 0, scale: 0.78, filter: 'blur(16px)' })
      gsap.set('[data-line]', { scaleX: 0 })
      gsap.set('[data-sub]', { opacity: 0, y: 12 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      tl.to('[data-utopia]', { opacity: 0, scale: 1.5, filter: 'blur(16px)', ease: 'none' }, 0)
        .to('[data-dyst]', { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none' }, 0)
        .to('[data-line]', { scaleX: 1, ease: 'none' }, 0)
        .to('[data-sub]', { opacity: 1, y: 0, ease: 'none' }, 0.25)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={section} className="relative z-10 h-[200vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
        <div
          data-sub
          className="font-mono text-[0.65rem] uppercase tracking-widest3 text-neon-cyan/70"
        >
          The Descent
        </div>

        <div className="relative mt-5 flex items-center justify-center">
          <h2
            data-utopia
            className="gradient-cool absolute font-display text-[clamp(2.6rem,14vw,11rem)] font-black uppercase leading-none tracking-tight"
          >
            UTØPIA
          </h2>
          <h2
            data-dyst
            className="gradient-flow font-display text-[clamp(2.6rem,14vw,11rem)] font-black uppercase leading-none tracking-tight"
          >
            DYSTØPIA
          </h2>
        </div>

        <div
          data-line
          className="mt-9 h-px w-[min(82vw,640px)] origin-center bg-gradient-to-r from-transparent via-neon-purple to-transparent"
        />

        <p data-sub className="mt-7 max-w-md text-sm leading-relaxed text-slate-400">
          Scroll, and watch a perfect world burn into the future LEOPARDØ scored.
        </p>
      </div>
    </section>
  )
}
