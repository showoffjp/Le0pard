import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useExperience } from '../store/useExperience'
import { site } from '../data/site'
import { dystopia } from '../data/music'
import { NeonButton } from '../components/ui/NeonButton'
import { MagicLayer } from '../components/ui/MagicLayer'

export function Hero() {
  const ready = useExperience((s) => s.ready)
  const reducedMotion = useExperience((s) => s.reducedMotion)
  const scrollTo = useExperience((s) => s.scrollTo)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready || reducedMotion || !root.current) return
    const ctx = gsap.context(() => {
      gsap.set('[data-hero]', { opacity: 0, y: 44 })
      gsap.set('[data-hero-title]', { opacity: 0, scale: 1.06, filter: 'blur(14px)' })
      const tl = gsap.timeline({ delay: 0.15 })
      tl.to('[data-hero-title]', {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
      })
        .to(
          '[data-hero]',
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 },
          '-=0.9',
        )
    }, root)
    return () => ctx.revert()
  }, [ready, reducedMotion])

  return (
    <section
      ref={root}
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-28 text-center md:px-8"
    >
      <MagicLayer depth={10}>
        <div
          data-hero
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_10px_#22d3ee]" />
          <span className="font-display text-[0.65rem] uppercase tracking-widest2 text-slate-300">
            New Album · Out {site.releaseDate}
          </span>
        </div>
      </MagicLayer>

      <MagicLayer depth={6}>
        <div
          data-hero
          className="font-display text-sm uppercase tracking-widest3 text-slate-400 md:text-base"
        >
          LEOPARD<span className="text-neon-purple neon-purple">Ø</span> presents
        </div>
      </MagicLayer>

      <MagicLayer depth={26} className="my-2">
        <h1
          data-hero-title
          className="gradient-cool font-display font-black uppercase leading-[0.82] tracking-tight text-[clamp(3.6rem,18vw,15rem)]"
          style={{
            textShadow:
              '2px 0 rgba(34,211,238,.42), -2px 0 rgba(168,85,247,.5), 0 0 52px rgba(124,58,237,.55)',
            filter:
              'drop-shadow(0 0 34px rgba(168,85,247,.4)) drop-shadow(0 0 64px rgba(255,90,0,.16))',
          }}
        >
          DYSTØPIA
        </h1>
      </MagicLayer>

      <MagicLayer depth={8}>
        <p
          data-hero
          className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg"
        >
          Cinematic horns and strings smashing into heavy 808s — ancient war drums
          pounding through a burning future.
        </p>
      </MagicLayer>

      <div data-hero className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <NeonButton href={site.links.bandcamp} variant="ember" newTab>
          ▶ Stream DYSTØPIA
        </NeonButton>
        <NeonButton variant="ghost" onClick={() => scrollTo('#album')}>
          Enter the World
        </NeonButton>
      </div>

      <div
        data-hero
        className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-500"
      >
        <span>{dystopia.tracks.length} Tracks</span>
        <span className="text-neon-purple/60">/</span>
        <span>Orchestral Trap</span>
        <span className="text-neon-purple/60">/</span>
        <span>{site.location}</span>
      </div>

      {/* scroll hint */}
      <button
        onClick={() => scrollTo('#album')}
        aria-label="Scroll"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition hover:text-neon-cyan"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-widest2">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-neon-cyan" />
        </span>
      </button>
    </section>
  )
}
