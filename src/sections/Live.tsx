import { shows } from '../data/shows'
import { site } from '../data/site'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { cn } from '../lib/cn'

/** Live / tour section. Renders confirmed shows, or a polished "coming soon"
 *  state when the run hasn't been announced yet (no invented dates). */
export function Live() {
  const has = shows.length > 0

  return (
    <section id="live" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="05" kicker="On Stage" title="Live" accent="heat" />
      </Reveal>

      {has ? (
        <div className="flex flex-col gap-3">
          {shows.map((s, i) => (
            <Reveal key={`${s.date}-${s.city}`} delay={i * 60}>
              <TechFrame glow={i % 2 ? 'blue' : 'purple'} padded={false}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                  <div className="flex items-center gap-5">
                    <div className="w-24 shrink-0 font-display text-sm font-black uppercase tracking-widest2 text-neon-cyan">
                      {s.date}
                    </div>
                    <div>
                      <div className="font-display text-lg font-black uppercase tracking-tight text-white">
                        {s.city}
                      </div>
                      <div className="font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-500">
                        {s.venue}
                        {s.support ? ` · w/ ${s.support}` : ''}
                      </div>
                    </div>
                  </div>
                  {s.soldOut ? (
                    <span className="shrink-0 rounded-full border border-neon-ember/40 px-4 py-2 text-center font-display text-[0.65rem] uppercase tracking-widest2 text-neon-ember">
                      Sold Out
                    </span>
                  ) : s.ticketsUrl ? (
                    <NeonButton href={s.ticketsUrl} variant="ember" newTab className="shrink-0">
                      Tickets ↗
                    </NeonButton>
                  ) : (
                    <span className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-center font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-400">
                      On Sale Soon
                    </span>
                  )}
                </div>
              </TechFrame>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <TechFrame glow="mix">
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-ember/40 bg-void/50 px-4 py-1.5 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-ember">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_10px_#ff6a00]" />
                First Wave Loading
              </span>
              <h3 className="max-w-xl font-display text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
                The DYSTØPIA live show is being built
              </h3>
              <p className="max-w-lg leading-relaxed text-slate-400">
                An immersive audiovisual set — the burning future, sound and the 3D world
                as one. Dates drop here first. Follow to catch the first wave before it sells.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonButton href={site.links.bandcampArtist} variant="ember" newTab>
                  Follow for Dates
                </NeonButton>
                <NeonButton href={site.links.video} variant="ghost" newTab>
                  Watch the Visuals
                </NeonButton>
              </div>
            </div>
          </TechFrame>
        </Reveal>
      )}

      <Reveal delay={80}>
        <p
          className={cn(
            'mt-8 text-center font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-600',
            has && 'hidden',
          )}
        >
          Booking & promoter enquiries → see the Press Kit
        </p>
      </Reveal>
    </section>
  )
}
