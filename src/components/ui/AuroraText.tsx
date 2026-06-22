import { useRef, type ReactNode } from 'react'
import { useExperience } from '../../store/useExperience'
import { cn } from '../../lib/cn'

/**
 * Interactive wrapper for flowing "aurora" gradient text. Tracks the pointer to
 * cast a soft spotlight that follows the cursor across the words, and brightens
 * the whole block on hover. Pair with the `.aurora-text` utility on the child.
 */
export function AuroraText({
  children,
  className,
  spotlight = true,
}: {
  children: ReactNode
  className?: string
  spotlight?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn('group relative', className)}
      style={{ ['--mx' as string]: '50%', ['--my' as string]: '50%' }}
    >
      {spotlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[42%] opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(280px circle at var(--mx) var(--my), rgba(52,211,153,.45), rgba(59,130,246,.4) 38%, rgba(168,85,247,.34) 64%, transparent 78%)',
          }}
        />
      )}
      {children}
    </div>
  )
}
