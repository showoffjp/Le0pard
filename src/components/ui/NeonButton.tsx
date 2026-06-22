import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'ember'
  className?: string
  newTab?: boolean
}

const base =
  'react-pop group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 font-display text-[0.7rem] font-bold uppercase tracking-widest2 clip-tech-sm transition-[background,box-shadow,color,filter,border-color] duration-300'

const variants = {
  primary:
    'text-white bg-gradient-to-r from-neon-violet to-neon-blue hover:from-neon-purple hover:to-neon-cyan shadow-[0_0_26px_rgba(124,58,237,.55)] hover:shadow-[0_0_34px_rgba(34,211,238,.6)]',
  ember:
    'text-white bg-gradient-to-r from-neon-ember to-neon-flame hover:brightness-110 shadow-[0_0_26px_rgba(255,106,0,.5)]',
  ghost:
    'text-slate-200 bg-white/[0.04] ring-1 ring-white/15 hover:ring-neon-purple/70 hover:text-white hover:bg-white/[0.07]',
} as const

export function NeonButton({ children, href, onClick, variant = 'primary', className, newTab }: Props) {
  const cls = cn(base, variants[variant], className)
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
