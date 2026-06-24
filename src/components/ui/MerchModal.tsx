import { useEffect, useState } from 'react'
import { merchBuyUrl, formatPrice, type MerchItem } from '../../data/store'
import { TechFrame } from './TechFrame'
import { NeonButton } from './NeonButton'
import { MotifGraphic } from './MerchMotifArt'

function sizesFor(item: MerchItem): string[] | null {
  if (item.category === 'apparel') {
    if (/onesie/i.test(item.typeLabel)) return ['0-3m', '3-6m', '6-12m', '12-18m']
    if (/youth/i.test(item.typeLabel)) return ['XS', 'S', 'M', 'L', 'XL']
    return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
  }
  if (item.category === 'headwear') return ['S/M', 'L/XL']
  return null
}

/** Quick-view lightbox for a merch product — big art, full details, Buy. */
export function MerchModal({ item, onClose }: { item: MerchItem | null; onClose: () => void }) {
  const [size, setSize] = useState<string | null>(null)

  useEffect(() => {
    if (!item) return
    setSize(null)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null
  const sizes = sizesFor(item)

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-void/85 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} details`}
    >
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-2 right-0 z-10 flex h-9 w-9 -translate-y-full items-center justify-center rounded-full border border-white/15 bg-void/60 text-slate-300 backdrop-blur transition hover:border-neon-purple/70 hover:text-white md:-right-2"
        >
          ✕
        </button>
        <TechFrame glow={item.glow} padded={false}>
          <div className="grid md:grid-cols-2">
            {/* art */}
            {item.image ? (
              <div className="scanlines relative aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="scanlines relative aspect-square overflow-hidden bg-gradient-to-br from-steel/60 via-ink to-abyss">
                <div className="hud-grid absolute inset-0 opacity-40" />
                <div className="absolute inset-0 grid place-items-center p-8">
                  <MotifGraphic motif={item.motif} text={item.text} sub={item.sub} glow={item.glow} />
                </div>
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-void/60 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest2 text-slate-300 backdrop-blur">
                  {item.typeLabel}
                </span>
              </div>
            )}

            {/* details */}
            <div className="flex flex-col p-6 md:p-7">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan/70">
                  {item.typeLabel}
                </span>
                {item.badge && (
                  <span className="rounded-full border border-neon-purple/40 bg-neon-violet/15 px-2 py-0.5 font-display text-[0.5rem] uppercase tracking-widest2 text-neon-purple">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight tracking-tight text-white">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.blurb}</p>

              {sizes && (
                <div className="mt-5">
                  <div className="mb-2 font-mono text-[0.55rem] uppercase tracking-widest2 text-slate-500">
                    Size
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                        className={
                          'min-w-9 rounded-md border px-2.5 py-1.5 font-display text-[0.6rem] uppercase tracking-widest2 transition ' +
                          (size === s
                            ? 'border-neon-purple bg-neon-violet/20 text-white'
                            : 'border-white/12 text-slate-400 hover:border-neon-purple/50 hover:text-white')
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="font-display text-2xl font-black text-white">
                  {formatPrice(item.price)}
                </span>
                <NeonButton href={merchBuyUrl(item)} newTab className="px-6 py-2.5">
                  Buy{size ? ` · ${size}` : ''}
                </NeonButton>
              </div>
            </div>
          </div>
        </TechFrame>
      </div>
    </div>
  )
}
