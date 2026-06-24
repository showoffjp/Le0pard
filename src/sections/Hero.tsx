import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useExperience } from '../store/useExperience'
import { site } from '../data/site'
import { dystopia } from '../data/music'
import { NeonButton } from '../components/ui/NeonButton'
import { MagicLayer } from '../components/ui/MagicLayer'
import { GoggleMark } from '../components/ui/GoggleMark'

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
        // power-on flicker
        .to('[data-hero-title]', { opacity: 0.45, duration: 0.05, repeat: 5, yoyo: true, ease: 'none' }, '-=0.15')
        .set('[data-hero-title]', { opacity: 1 })
        .to(
          '[data-hero]',
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 },
          '-=0.7',
        )
    }, root)
    return () => ctx.revert()
  }, [ready, reducedMotion])

  return (
    <section
      ref={root}
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-28 text-center md:px-8"
    >
      <MagicLayer depth={14}>
        <div data-hero className="mb-5 flex justify-center">
          <GoggleMark
            className="h-7 w-auto opacity-70"
            style={{ filter: 'drop-shadow(0 0 12px rgba(124,92,255,.6))' }}
          />
        </div>
      </MagicLayer>

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

      <MagicLayer depth={26} className="my-3">
        <div data-hero className="relative flex items-center justify-center py-10 md:py-16">
          {/* targeting reticle that frames the live 3D core as the hero subject */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(88vw,620px)] -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute inset-8 clip-tech border border-white/[0.07]" />
            <span className="absolute left-0 top-0 h-9 w-9 border-l-2 border-t-2 border-neon-cyan/50" />
            <span className="absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-neon-cyan/50" />
            <span className="absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-neon-purple/50" />
            <span className="absolute bottom-0 right-0 h-9 w-9 border-b-2 border-r-2 border-neon-purple/50" />
            <span className="absolute -top-4 left-1 font-mono text-[0.5rem] uppercase tracking-widest3 text-neon-cyan/60">
              LØ·CORE
            </span>
            <span className="absolute -bottom-4 right-1 font-mono text-[0.5rem] uppercase tracking-widest3 text-slate-500">
              SYS·DYSTØPIA
            </span>
            <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-neon-cyan/40" />
            <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-neon-purple/40" />
          </div>

          <h1
            data-hero-title
            className="gradient-flow relative font-display font-black uppercase leading-[0.82] tracking-tight text-[clamp(2.7rem,11.5vw,8.5rem)]"
            style={{
              textShadow:
                '2px 0 rgba(34,211,238,.4), -2px 0 rgba(168,85,247,.48), 0 0 44px rgba(124,58,237,.5)',
              filter:
                'drop-shadow(0 0 30px rgba(168,85,247,.38)) drop-shadow(0 0 60px rgba(255,90,0,.15))',
            }}
          >
            DYSTØPIA
          </h1>
        </div>
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
