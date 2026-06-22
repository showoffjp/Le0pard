import { cn } from '../../lib/cn'

export function SectionHeading({
  index,
  kicker,
  title,
  accent = 'cool',
  className,
}: {
  index: string
  kicker: string
  title: string
  accent?: 'cool' | 'heat'
  className?: string
}) {
  return (
    <div className={cn('mb-10 md:mb-14', className)}>
      <div className="flex items-center gap-3 text-neon-cyan/80">
        <span className="font-mono text-xs tracking-widest2">{index}</span>
        <span className="h-px w-12 bg-gradient-to-r from-neon-cyan to-transparent" />
        <span className="font-display text-[0.7rem] uppercase tracking-widest2 text-slate-400">
          {kicker}
        </span>
      </div>
      <h2
        className={cn(
          'mt-4 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl',
          accent === 'heat' ? 'gradient-heat' : 'gradient-flow',
        )}
      >
        {title}
      </h2>
    </div>
  )
}
