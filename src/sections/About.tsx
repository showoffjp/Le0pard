import { site } from '../data/site'
import { dystopia, albumRuntime } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'

export function About() {
  const runtime = albumRuntime(dystopia)
  const stats = [
    { k: 'Based in', v: 'Charleston, SC' },
    { k: 'Era', v: 'Symphonic Trap' },
    { k: 'DYSTØPIA', v: `${dystopia.tracks.length} tracks · ${runtime.minutes}m` },
  ]

  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="09" kicker="The Artist" title="LEOPARDØ" />
      </Reveal>

      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-14">
        <Reveal>
          <TechFrame glow="cyan">
            <p className="text-lg leading-relaxed text-slate-200 md:text-xl">{site.bio}</p>
            <p className="mt-5 leading-relaxed text-slate-400">
              From the sprawl of {site.location}, LEOPARDØ scores the collapse and rebirth of
              tomorrow — a soundtrack for a world caught between utopia and ruin.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {site.genres.map((g) => (
                <span
                  key={g}
                  className="clip-tech-sm border border-white/10 bg-white/[0.03] px-3 py-1 font-display text-[0.65rem] uppercase tracking-widest2 text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <NeonButton href={site.links.bandcampArtist} newTab>
                Follow on Bandcamp
              </NeonButton>
            </div>
          </TechFrame>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex h-full flex-col gap-4">
            {stats.map((s) => (
              <div
                key={s.k}
                className="clip-tech-sm flex flex-1 flex-col justify-center border border-white/10 bg-white/[0.02] px-6 py-6"
              >
                <div className="font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan/70">
                  {s.k}
                </div>
                <div className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
