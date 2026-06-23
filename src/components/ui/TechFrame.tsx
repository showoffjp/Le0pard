import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Glow = 'purple' | 'blue' | 'cyan' | 'ember' | 'mix'

const GLOWS: Record<Glow, string> = {
  purple: 'rgba(168,85,247,.45)',
  blue: 'rgba(59,130,246,.45)',
  cyan: 'rgba(34,211,238,.4)',
  ember: 'rgba(255,106,0,.4)',
  mix: 'rgba(124,58,237,.42)',
}

const BORDERS: Record<Glow, string> = {
  purple: 'from-neon-purple/80 via-neon-violet/70 to-neon-purple/40',
  blue: 'from-neon-blue/80 via-neon-indigo/70 to-neon-blue/40',
  cyan: 'from-neon-cyan/80 via-neon-blue/60 to-neon-cyan/30',
  ember: 'from-neon-ember/80 via-neon-flame/70 to-neon-ember/30',
  mix: 'from-neon-purple/80 via-neon-blue/70 to-neon-cyan/60',
}

/** The album's signature octagonal neon frame, reusable around any content. */
export function TechFrame({
  children,
  className,
  innerClassName,
  glow = 'mix',
  padded = true,
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
  glow?: Glow
  padded?: boolean
}) {
  return (
    <div
      className={cn('react-frame relative', className)}
      style={{ filter: `drop-shadow(0 0 22px ${GLOWS[glow]})` }}
    >
      <div className={cn('clip-tech bg-gradient-to-br p-[1.5px]', BORDERS[glow])}>
        <div
          className={cn(
            'clip-tech glass relative h-full w-full',
            padded && 'p-6 md:p-8',
            innerClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
