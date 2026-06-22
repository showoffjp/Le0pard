import { useMemo, useState } from 'react'
import { dystopia } from '../data/music'
import {
  merch,
  merchBuyUrl,
  merchCategories,
  musicTiers,
  formatPrice,
  trackBuyUrl,
  type MerchCategory,
  type MerchItem,
  type MerchMotif,
} from '../data/store'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { TiltCard } from '../components/ui/TiltCard'
import { GoggleMark } from '../components/ui/GoggleMark'
import { cn } from '../lib/cn'

/** Rendered "design plate" for each product (swapped for a photo when `image` is set). */
function MerchArt({ motif, typeLabel }: { motif: MerchMotif; typeLabel: string }) {
  return (
    <div className="scanlines relative aspect-square overflow-hidden bg-gradient-to-br from-steel/60 via-ink to-abyss">
      <div className="hud-grid absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 18%, rgba(124,92,255,.22), transparent 60%)',
        }}
      />

      <div className="absolute inset-0 grid place-items-center p-8">
        {motif === 'cover' && (
          <img
            src={dystopia.coverSmall}
            alt=""
            className="h-3/4 w-3/4 object-cover clip-tech shadow-[0_0_40px_rgba(124,58,237,.45)]"
            loading="lazy"
          />
        )}

        {motif === 'wordmark' && (
          <div className="text-center">
            <div className="font-display text-2xl font-black uppercase tracking-widest2 text-white sm:text-3xl">
              LEOPARD<span className="text-neon-purple neon-purple">Ø</span>
            </div>
            <div className="mt-2 font-mono text-[0.55rem] uppercase tracking-widest3 text-neon-cyan/70">
              Symphonic Trap
            </div>
          </div>
        )}

        {motif === 'goggle' && (
          <GoggleMark
            className="w-3/4"
            style={{ filter: 'drop-shadow(0 0 18px rgba(34,211,238,.6))' }}
          />
        )}

        {motif === 'flame' && (
          <div className="text-center">
            <div
              className="gradient-heat font-display text-[5rem] font-black leading-none"
              style={{ filter: 'drop-shadow(0 0 26px rgba(255,90,0,.55))' }}
            >
              Ø
            </div>
            <div className="mt-1 font-display text-xs uppercase tracking-widest2 text-slate-300">
              DYSTØPIA
            </div>
          </div>
        )}

        {motif === 'octagon' && (
          <div className="relative grid h-32 w-32 place-items-center">
            <div className="absolute inset-0 clip-tech bg-gradient-to-br from-neon-purple/80 via-neon-blue/70 to-neon-cyan/60 p-[1.5px]">
              <div className="clip-tech h-full w-full bg-abyss" />
            </div>
            <span className="relative font-display text-[0.6rem] font-bold uppercase tracking-widest2 text-white">
              LEOPARDØ
            </span>
          </div>
        )}
      </div>

      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-void/60 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest2 text-slate-300 backdrop-blur">
        {typeLabel}
      </span>
    </div>
  )
}

function MerchCard({ item }: { item: MerchItem }) {
  return (
    <TiltCard className="h-full">
      <TechFrame glow={item.glow} padded={false} className="h-full">
        <div className="relative flex h-full flex-col">
          {item.image ? (
            <div className="scanlines relative aspect-square overflow-hidden">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ) : (
            <MerchArt motif={item.motif} typeLabel={item.typeLabel} />
          )}

          {item.badge && (
            <span className="absolute right-3 top-3 rounded-full border border-neon-purple/40 bg-neon-violet/15 px-2.5 py-1 font-display text-[0.55rem] uppercase tracking-widest2 text-neon-purple backdrop-blur">
              {item.badge}
            </span>
          )}

          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-base font-bold uppercase tracking-wide text-white">
              {item.name}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.blurb}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-display text-xl font-black text-white">
                {formatPrice(item.price)}
              </span>
              <NeonButton href={merchBuyUrl(item)} newTab className="px-5 py-2.5">
                Buy
              </NeonButton>
            </div>
          </div>
        </div>
      </TechFrame>
    </TiltCard>
  )
}

export function Store() {
  const [cat, setCat] = useState<MerchCategory | 'all'>('all')
  const [showTracks, setShowTracks] = useState(false)

  const visible = useMemo(
    () => (cat === 'all' ? merch : merch.filter((m) => m.category === cat)),
    [cat],
  )

  return (
    <section id="store" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="06" kicker="Own The Signal" title="Store" />
      </Reveal>

      {/* ── Music: lossless FLAC ─────────────────────────────────────────── */}
      <Reveal delay={80}>
        <TechFrame glow="purple" padded={false} className="overflow-hidden">
          <div className="grid md:grid-cols-[minmax(0,300px)_1fr]">
            <div className="scanlines relative min-h-[240px] overflow-hidden">
              <img
                src={dystopia.cover}
                alt="DYSTØPIA cover"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent md:bg-gradient-to-r" />
              <span className="absolute left-4 top-4 rounded-full border border-neon-cyan/40 bg-void/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan backdrop-blur">
                FLAC · Lossless
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="font-mono text-[0.65rem] uppercase tracking-widest2 text-neon-cyan/70">
                Own the record
              </div>
              <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                DYSTØPIA — Lossless
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {['FLAC', 'ALAC', 'WAV', '320 MP3'].map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest2 text-slate-300"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {musicTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      'flex flex-col gap-3 rounded-lg border border-white/8 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between',
                      tier.highlight && 'border-neon-purple/30 bg-neon-violet/[0.06]',
                    )}
                  >
                    <div>
                      <div className="font-display text-sm font-bold uppercase tracking-wide text-white">
                        {tier.name}
                      </div>
                      <div className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                        {tier.format} · from {tier.price}
                      </div>
                    </div>
                    <NeonButton
                      href={tier.url}
                      newTab
                      variant={tier.highlight ? 'ember' : 'ghost'}
                      className="shrink-0"
                    >
                      {tier.id === 'single-track' ? 'Browse Tracks' : 'Buy on Bandcamp'}
                    </NeonButton>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowTracks((v) => !v)}
                className="mt-5 inline-flex items-center gap-2 font-display text-[0.65rem] uppercase tracking-widest2 text-neon-cyan transition hover:gap-3"
              >
                {showTracks ? 'Hide tracks' : `Buy single tracks (${dystopia.tracks.length})`}
                <span className={cn('transition-transform', showTracks && 'rotate-90')}>›</span>
              </button>

              {showTracks && (
                <ul className="mt-4 grid max-h-64 grid-cols-1 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
                  {dystopia.tracks.map((t) => (
                    <li key={t.n}>
                      <a
                        href={trackBuyUrl(t)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-md border border-white/6 bg-white/[0.02] px-3 py-2 transition hover:border-neon-purple/40 hover:bg-white/[0.05]"
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span className="font-mono text-[0.6rem] text-neon-purple/70">
                            {String(t.n).padStart(2, '0')}
                          </span>
                          <span className="truncate font-display text-xs uppercase tracking-wide text-slate-200">
                            {t.title}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500 group-hover:text-neon-cyan">
                          FLAC ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TechFrame>
      </Reveal>

      {/* ── Merch ────────────────────────────────────────────────────────── */}
      <div className="mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <div>
            <div className="font-mono text-[0.65rem] uppercase tracking-widest2 text-neon-cyan/70">
              Wear the signal
            </div>
            <h3 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Merch
            </h3>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2">
            {merchCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  'clip-tech-sm px-3.5 py-1.5 font-display text-[0.6rem] uppercase tracking-widest2 transition',
                  cat === c.id
                    ? 'bg-gradient-to-r from-neon-violet to-neon-blue text-white shadow-[0_0_18px_rgba(124,58,237,.5)]'
                    : 'bg-white/[0.04] text-slate-400 ring-1 ring-white/12 hover:text-white hover:ring-neon-purple/50',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((item, i) => (
          <Reveal key={item.id} delay={i * 70}>
            <MerchCard item={item} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-10 text-center font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-600">
          Secure checkout via Bandcamp &amp; Stripe · Lossless downloads · Ships worldwide
        </p>
      </Reveal>
    </section>
  )
}
