import { useEffect, useMemo, useState } from 'react'
import { drops, NEXT_DROP_ISO, type Drop } from '../data/drops'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { SignalList } from '../components/ui/SignalList'
import { site } from '../data/site'
import { cn } from '../lib/cn'

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    // Already past the target → nothing to count; don't tick forever.
    if (target - Date.now() <= 0) return
    const id = setInterval(() => {
      setNow(Date.now())
      if (target - Date.now() <= 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [target])
  const diff = Math.max(0, target - now)
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
    done: diff <= 0,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="clip-tech-sm flex min-w-[64px] flex-col items-center bg-void/60 px-3 py-2.5 md:min-w-[88px] md:px-5 md:py-3.5">
      <span className="font-display text-3xl font-black tabular-nums text-white md:text-5xl">
        {pad(value)}
      </span>
      <span className="mt-1 font-mono text-[0.5rem] uppercase tracking-widest2 text-slate-500 md:text-[0.6rem]">
        {label}
      </span>
    </div>
  )
}

function DropCard({ drop }: { drop: Drop }) {
  const cd = useCountdown(drop.date)
  const isLive = drop.status === 'live' || cd.done
  // A drop can flip live by date before its link is wired in drops.ts — fall
  // back to the artist page so the CTA is never dead at the drop moment.
  const href = drop.href ?? site.links.bandcampArtist
  return (
    <TechFrame glow={drop.glow} padded={false} className="h-full">
      <div className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-400">
            {drop.kind}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-display text-[0.5rem] uppercase tracking-widest2',
              isLive
                ? 'border-neon-cyan/50 text-neon-cyan'
                : 'border-white/15 text-slate-400',
            )}
          >
            {isLive ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_8px_#22d3ee]" />
                Live
              </>
            ) : (
              <>◢ Locked</>
            )}
          </span>
        </div>
        <h4 className="mt-3 font-display text-lg font-bold uppercase leading-tight tracking-tight text-white">
          {drop.title}
        </h4>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{drop.blurb}</p>
        <div className="mt-4">
          {isLive ? (
            <NeonButton href={href} newTab={href.startsWith('http')} className="px-5 py-2">
              {drop.href ? (drop.href.startsWith('#') ? 'Open ▸' : 'Listen ▸') : 'Receive ▸'}
            </NeonButton>
          ) : (
            <div className="font-mono text-sm tabular-nums text-slate-300">
              <span className="text-slate-500">UNLOCKS IN </span>
              {cd.d > 0 ? `${cd.d}d ` : ''}
              {pad(cd.h)}:{pad(cd.m)}:{pad(cd.s)}
            </div>
          )}
        </div>
      </div>
    </TechFrame>
  )
}

export function Transmissions() {
  const cd = useCountdown(NEXT_DROP_ISO)
  const next = drops.find((d) => d.date === NEXT_DROP_ISO) ?? drops[0]

  return (
    <section id="drops" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="03" kicker="The Vault" title="Transmissions" accent="heat" />
      </Reveal>

      {/* next-drop countdown */}
      <Reveal delay={80}>
        <TechFrame glow="ember" padded={false} className="group">
          <div className="relative flex flex-col items-center gap-6 overflow-hidden p-8 text-center md:flex-row md:justify-between md:p-10 md:text-left">
            <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest2 text-neon-ember">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_10px_#ff6a00]" />
                {cd.done ? 'Transmitting now' : 'Next transmission'}
              </div>
              <h3 className="mt-2 gradient-heat font-display text-2xl font-black uppercase leading-tight tracking-tight md:text-4xl">
                {next.title}
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-400">{next.blurb}</p>
            </div>
            <div className="relative shrink-0">
              {cd.done ? (
                <NeonButton
                  href={next.href ?? site.links.bandcampArtist}
                  variant="ember"
                  newTab={(next.href ?? site.links.bandcampArtist).startsWith('http')}
                  className="px-7 py-3"
                >
                  Receive ▸
                </NeonButton>
              ) : (
                <div className="flex gap-2 md:gap-3">
                  <Cell value={cd.d} label="Days" />
                  <Cell value={cd.h} label="Hrs" />
                  <Cell value={cd.m} label="Min" />
                  <Cell value={cd.s} label="Sec" />
                </div>
              )}
            </div>
          </div>
        </TechFrame>
      </Reveal>

      {/* vault grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {drops.map((d, i) => (
          <Reveal key={d.id} delay={i * 70}>
            <DropCard drop={d} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-12">
          <SignalList />
        </div>
      </Reveal>
    </section>
  )
}
