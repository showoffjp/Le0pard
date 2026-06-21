import { useEffect, useRef, type ReactNode } from 'react'
import { useExperience } from '../../store/useExperience'
import { cn } from '../../lib/cn'

/**
 * A pointer-parallax depth layer — the DOM counterpart to the 3D Magic Layers.
 * Higher `depth` = moves more, reading as "closer" to the viewer.
 */
export function MagicLayer({
  children,
  depth = 18,
  className,
}: {
  children: ReactNode
  depth?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (useExperience.getState().reducedMotion) return
    const unsub = useExperience.subscribe((state) => {
      const el = ref.current
      if (!el) return
      el.style.transform = `translate3d(${state.pointer.x * depth}px, ${
        state.pointer.y * depth
      }px, 0)`
    })
    return unsub
  }, [depth])

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{ transition: 'transform 0.3s ease-out' }}
    >
      {children}
    </div>
  )
}
