import { useRef, type ReactNode } from 'react'
import { useExperience } from '../../store/useExperience'
import { cn } from '../../lib/cn'

/** Pointer-driven 3D tilt — adds depth/parallax to cards on hover. */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`
  }

  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn('transition-transform duration-200 ease-out [transform-style:preserve-3d]', className)}
    >
      {children}
    </div>
  )
}
