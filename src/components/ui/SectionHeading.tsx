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
    <div className={cn('relative mb-10 md:mb-14', className)}>
      {/* Legibility scrim: a soft, feathered dark gradient behind the heading so
          the kicker + title keep their contrast wherever the bright 3D core
          blooms behind a section. On already-dark sections it's void-over-void
          (invisible), so it only does work where it's needed. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-5 -top-4 -bottom-4 right-0 bg-[linear-gradient(100deg,rgba(4,5,10,0.85),rgba(4,5,10,0.5)_40%,transparent_72%)] blur-md"
      />
      <div className="relative">
        <div className="flex items-center gap-3 text-neon-cyan/80">
          <span className="font-mono text-xs tracking-widest2">{index}</span>
          <span className="h-px w-12 bg-gradient-to-r from-neon-cyan to-transparent" />
          <span className="font-display text-[0.7rem] uppercase tracking-widest2 text-slate-300">
            {kicker}
          </span>
        </div>
        <h2
          className={cn(
            'react-pop-soft react-glow mt-4 inline-block font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl',
            accent === 'heat' ? 'gradient-heat' : 'gradient-flow',
          )}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}
