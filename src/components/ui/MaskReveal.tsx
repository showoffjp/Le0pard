import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useExperience } from '../../store/useExperience'
import { cn } from '../../lib/cn'

/** Line-mask reveal: content rises into view from behind a clip. Preserves
 *  gradients (animates the whole line, not per-letter). */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  useLayoutEffect(() => {
    if (reduced) return
    const root = wrap.current
    const inner = root?.querySelector('[data-mask-inner]')
    if (!root || !inner) return
    const ctx = gsap.context(() => {
      gsap.from(inner, {
        yPercent: 118,
        duration: 1.05,
        ease: 'power4.out',
        delay,
        scrollTrigger: { trigger: root, start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [delay, reduced])

  return (
    <div ref={wrap} className={cn('overflow-hidden pb-[0.12em]', className)}>
      <div data-mask-inner className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
