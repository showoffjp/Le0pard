import type { ReactNode } from 'react'
import { useInView } from '../../lib/useInView'
import { cn } from '../../lib/cn'

/** Fades + lifts content into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      data-revealed={inView}
      className={cn('reveal', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
