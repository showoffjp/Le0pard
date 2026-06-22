import { useState } from 'react'
import { site } from '../data/site'
import { featuredVideo, videos, type Video } from '../data/videos'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { TiltCard } from '../components/ui/TiltCard'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { VideoModal } from '../components/ui/VideoModal'
import { cn } from '../lib/cn'

const KIND_LABEL: Record<Video['kind'], string> = {
  x: 'Watch on X ↗',
  youtube: 'Play ▶',
  vimeo: 'Play ▶',
  soon: 'Soon',
}

export function VideoSection() {
  const [active, setActive] = useState<Video | null>(null)

  const open = (v: Video) => {
    if (v.kind === 'soon') return
    if (v.kind === 'x' && v.url) {
      window.open(v.url, '_blank', 'noopener,noreferrer')
      return
    }
    setActive(v)
  }

  return (
    <section id="video" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="04" kicker="Motion" title="Videos" accent="heat" />
      </Reveal>

      {/* Featured */}
      <Reveal delay={100}>
        <TechFrame glow="ember" padded={false} className="group">
          <a
            href={featuredVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-video w-full overflow-hidden"
          >
            <img
              src={featuredVideo.cover}
              alt={`${featuredVideo.title} video`}
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/20" />
            <div className="scanlines absolute inset-0" />

            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-neon-ember/40 bg-void/60 px-3 py-1 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-ember backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_10px_#ff6a00]" />
              Latest Release
            </span>

            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-neon-ember/30" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition group-hover:scale-110 group-hover:border-neon-ember">
                <span className="ml-1 text-2xl text-white">▶</span>
              </span>
            </span>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
              <div>
                <h3 className="gradient-heat font-display text-2xl font-black uppercase tracking-tight md:text-4xl">
                  {featuredVideo.title}
                </h3>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-300">
                  {featuredVideo.subtitle}
                </p>
              </div>
              <span className="hidden font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-400 md:block">
                Watch on X ↗
              </span>
            </div>
          </a>
        </TechFrame>
      </Reveal>

      {/* Gallery */}
      <Reveal delay={140}>
        <div className="mb-5 mt-12 flex items-center gap-3 text-neon-cyan/80">
          <span className="h-px w-10 bg-gradient-to-r from-neon-cyan to-transparent" />
          <span className="font-display text-[0.7rem] uppercase tracking-widest2 text-slate-400">
            More Visuals
          </span>
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v, i) => (
          <Reveal key={v.id} delay={i * 80}>
            <TiltCard className="h-full" max={6}>
              <button
                onClick={() => open(v)}
                className={cn(
                  'group block w-full text-left',
                  v.kind === 'soon' ? 'cursor-default' : 'cursor-pointer',
                )}
              >
                <TechFrame glow={v.kind === 'soon' ? 'blue' : 'purple'} padded={false}>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={v.cover}
                      alt={v.title}
                      className={cn(
                        'h-full w-full object-cover transition-transform duration-700 group-hover:scale-110',
                        v.kind === 'soon' ? 'opacity-30 grayscale' : 'opacity-55',
                      )}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                    {v.kind !== 'soon' && (
                      <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition group-hover:scale-110 group-hover:border-neon-purple">
                        <span className="ml-0.5 text-white">▶</span>
                      </span>
                    )}
                    <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-void/60 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest2 text-slate-300 backdrop-blur">
                      {v.date}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display text-sm font-bold uppercase leading-tight tracking-wide text-white">
                      {v.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="font-mono text-[0.58rem] uppercase tracking-widest2 text-slate-500">
                        {v.subtitle}
                      </p>
                      <span
                        className={cn(
                          'font-display text-[0.58rem] uppercase tracking-widest2',
                          v.kind === 'soon' ? 'text-slate-600' : 'text-neon-cyan',
                        )}
                      >
                        {KIND_LABEL[v.kind]}
                      </span>
                    </div>
                  </div>
                </TechFrame>
              </button>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160}>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-400">
            More visuals from the DYSTØPIA cycle are dropping soon.
          </p>
          <NeonButton href={site.links.video} variant="ghost" newTab>
            Watch the Premiere
          </NeonButton>
        </div>
      </Reveal>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </section>
  )
}
