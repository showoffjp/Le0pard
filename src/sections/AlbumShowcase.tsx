import { useExperience } from '../store/useExperience'
import { useAudio } from '../store/useAudio'
import { site } from '../data/site'
import { dystopia, albumRuntime } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { MagicLayer } from '../components/ui/MagicLayer'

export function AlbumShowcase() {
  const scrollTo = useExperience((s) => s.scrollTo)
  const play = useAudio((s) => s.play)
  const runtime = albumRuntime(dystopia)

  const stats = [
    { k: 'Tracks', v: String(dystopia.tracks.length) },
    { k: 'Runtime', v: `${runtime.minutes}m` },
    { k: 'Released', v: '2026' },
  ]

  return (
    <section id="album" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="01" kicker="The Release" title="DYSTØPIA" accent="heat" />
      </Reveal>

      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <MagicLayer depth={16}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 animate-pulse-glow rounded-full bg-gradient-to-tr from-neon-purple/30 via-neon-blue/20 to-neon-ember/20" />
              <TechFrame glow="mix" padded={false}>
                <img
                  src={dystopia.cover}
                  srcSet={`${dystopia.coverSmall} 700w, ${dystopia.cover} 1200w`}
                  sizes="(max-width: 768px) 90vw, 540px"
                  alt="DYSTØPIA album cover by LEOPARDØ"
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </TechFrame>
            </div>
          </MagicLayer>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">{dystopia.blurb}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              {site.genres.map((g) => (
                <span
                  key={g}
                  className="clip-tech-sm border border-white/10 bg-white/[0.03] px-3 py-1 font-display text-[0.65rem] uppercase tracking-widest2 text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.k} className="clip-tech-sm border border-white/10 bg-white/[0.02] px-4 py-4">
                  <div className="gradient-cool font-display text-2xl font-black md:text-3xl">{s.v}</div>
                  <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                    {s.k}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <NeonButton variant="ember" onClick={() => play(0)}>
                ▶ Play Visualizer
              </NeonButton>
              <NeonButton variant="ghost" onClick={() => scrollTo('#tracks')}>
                View Tracklist
              </NeonButton>
            </div>

            <div className="mt-6 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-500">
              {site.releaseDate} · {site.location}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
