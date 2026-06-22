import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useExperience } from '../../store/useExperience'
import { cn } from '../../lib/cn'

/** Scroll-scrubbed vertical parallax — gives DOM layers real depth. */
export function Parallax({
  children,
  className,
  speed = 26,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  useLayoutEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 0.4 },
        {
          yPercent: speed * 0.4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [speed, reduced])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
