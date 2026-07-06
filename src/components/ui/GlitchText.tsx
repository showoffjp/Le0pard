import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** RGB-split glitch wrapper for short headline text. */
export function GlitchText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 translate-x-[2px] text-neon-cyan/60 mix-blend-screen animate-flicker"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 -translate-x-[2px] text-neon-purple/60 mix-blend-screen animate-flicker"
        style={{ animationDelay: '0.18s' }}
      >
        {children}
      </span>
    </span>
  )
}
