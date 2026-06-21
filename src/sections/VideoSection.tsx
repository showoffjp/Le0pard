import { site } from '../data/site'
import { dystopia } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'

export function VideoSection() {
  return (
    <section id="video" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="04" kicker="Motion" title="The Video" accent="heat" />
      </Reveal>

      <Reveal delay={100}>
        <TechFrame glow="ember" padded={false} className="group">
          <a
            href={site.links.video}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-video w-full overflow-hidden"
          >
            <img
              src={dystopia.cover}
              alt="DYSTØPIA official video"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/20" />
            <div className="scanlines absolute inset-0" />

            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-neon-ember/40 bg-void/60 px-3 py-1 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-ember backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_10px_#ff6a00]" />
              Latest Release
            </span>

            {/* play button */}
            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-neon-ember/30" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition group-hover:scale-110 group-hover:border-neon-ember">
                <span className="ml-1 text-2xl text-white">▶</span>
              </span>
            </span>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
              <div>
                <h3 className="gradient-heat font-display text-2xl font-black uppercase tracking-tight md:text-4xl">
                  DYSTØPIA
                </h3>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-300">
                  Official Music Video · {site.artist}
                </p>
              </div>
              <span className="hidden font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-400 md:block">
                Watch on X ↗
              </span>
            </div>
          </a>
        </TechFrame>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-400">More visuals from the DYSTØPIA cycle dropping soon.</p>
          <NeonButton href={site.links.video} variant="ghost" newTab>
            Watch the Premiere
          </NeonButton>
        </div>
      </Reveal>
    </section>
  )
}
