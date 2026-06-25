import { useState, type SyntheticEvent } from 'react'
import { site } from '../data/site'
import {
  featuredVideo,
  videos,
  POSTER_FALLBACK,
  type Video,
} from '../data/videos'
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
  drive: 'Play ▶',
  soon: 'Soon',
}

// If a Drive poster can't load (sharing not set yet), fall back to the cover.
const onPosterError = (e: SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== POSTER_FALLBACK) e.currentTarget.src = POSTER_FALLBACK
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
        <SectionHeading index="04" kicker="Motion" title="Films" accent="heat" />
      </Reveal>

      {/* ── Featured: the launch film ───────────────────────────────────────── */}
      <Reveal delay={100}>
        <TechFrame glow="ember" padded={false} className="group">
          <button
            onClick={() => open(featuredVideo)}
            className="relative block aspect-video w-full overflow-hidden text-left"
            aria-label={`Play ${featuredVideo.title}`}
          >
            <img
              src={featuredVideo.cover}
              onError={onPosterError}
              alt={`${featuredVideo.title} poster`}
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 transition-transform duration-[1.4s] ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-void/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,5,10,0.55))]" />
            <div className="scanlines absolute inset-0" />

            {/* live / launch badge */}
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-neon-ember/40 bg-void/60 px-3 py-1 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-ember backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_10px_#ff6a00]" />
              Launch Film
            </span>
            <span className="absolute right-5 top-5 hidden items-center gap-2 rounded-full border border-neon-cyan/40 bg-void/60 px-3 py-1 font-mono text-[0.55rem] uppercase tracking-widest2 text-neon-cyan backdrop-blur sm:inline-flex">
              ◢ Plays on entry ◣
            </span>

            {/* play button */}
            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:h-24 md:w-24">
              <span className="absolute inset-0 animate-ping rounded-full bg-neon-ember/30" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:border-neon-ember group-hover:bg-neon-ember/15 md:h-24 md:w-24">
                <span className="ml-1.5 text-3xl text-white md:text-4xl">▶</span>
              </span>
            </span>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
              <div>
                <h3 className="gradient-heat font-display text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
                  {featuredVideo.title}
                </h3>
                <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-300">
                  {featuredVideo.subtitle}
                </p>
              </div>
              <span className="hidden shrink-0 font-display text-[0.65rem] uppercase tracking-widest2 text-neon-ember md:block">
                Watch ▶
              </span>
            </div>
          </button>
        </TechFrame>
      </Reveal>

      {/* ── Gallery ─────────────────────────────────────────────────────────── */}
      <Reveal delay={140}>
        <div className="mb-5 mt-12 flex items-center gap-3 text-neon-cyan/80">
          <span className="h-px w-10 bg-gradient-to-r from-neon-cyan to-transparent" />
          <span className="font-display text-[0.7rem] uppercase tracking-widest2 text-slate-400">
            The DYSTØPIA Cycle
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-600">
            · {videos.length} films
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
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
                aria-label={v.kind === 'soon' ? v.title : `Play ${v.title}`}
              >
                <TechFrame glow={v.kind === 'x' ? 'ember' : v.kind === 'soon' ? 'blue' : 'purple'} padded={false}>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={v.cover}
                      onError={onPosterError}
                      alt={v.title}
                      className={cn(
                        'h-full w-full object-cover transition-transform duration-700 group-hover:scale-110',
                        v.kind === 'soon' ? 'opacity-30 grayscale' : 'opacity-70',
                      )}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                    {v.kind !== 'soon' && (
                      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:border-neon-purple group-hover:bg-neon-purple/15">
                        <span className="ml-0.5 text-white">▶</span>
                      </span>
                    )}
                    <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-void/60 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest2 text-slate-300 backdrop-blur">
                      {v.date}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display text-sm font-bold uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-neon-cyan">
                      {v.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="font-mono text-[0.58rem] uppercase tracking-widest2 text-slate-500">
                        {v.subtitle}
                      </p>
                      <span
                        className={cn(
                          'font-display text-[0.58rem] uppercase tracking-widest2',
                          v.kind === 'soon'
                            ? 'text-slate-600'
                            : v.kind === 'x'
                              ? 'text-neon-ember'
                              : 'text-neon-cyan',
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
