import { cn } from '../../lib/cn'

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items]
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-8 py-1">
        {row.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-sm uppercase tracking-widest2 text-slate-500"
          >
            {it}
            <span className="text-neon-purple/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
