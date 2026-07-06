import { useEffect, useState } from 'react'
import { useExperience } from '../../store/useExperience'
import { useAudio } from '../../store/useAudio'
import { NeonButton } from '../ui/NeonButton'
import { cn } from '../../lib/cn'

const LINKS = [
  { label: 'Album', id: '#album' },
  { label: 'Join', id: '#citizen' },
  { label: 'Video', id: '#video' },
  { label: 'Drops', id: '#drops' },
  { label: 'Live', id: '#live' },
  { label: 'Store', id: '#store' },
  { label: 'News', id: '#posts' },
  { label: 'About', id: '#about' },
  { label: 'Press', id: '#press' },
]

export function Navbar() {
  const scrollTo = useExperience((s) => s.scrollTo)
  const play = useAudio((s) => s.play)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = false
    const unsub = useExperience.subscribe((state) => {
      const next = state.progress > 0.015
      if (next !== last) {
        last = next
        setScrolled(next)
      }
    })
    return unsub
  }, [])

  const go = (id: string | number) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'glass border-b border-white/5 py-3' : 'bg-transparent py-5',
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <button
            onClick={() => go(0)}
            className="react-pop-soft font-display text-lg font-black uppercase tracking-widest2 text-white transition hover:text-neon-purple"
          >
            LEOPARD<span className="text-neon-purple neon-purple">Ø</span>
          </button>

          {/* 9 tracked-out Orbitron links don't fit between md and lg — the full
              row only appears from lg, and the Play button from xl. */}
          <div className="hidden items-center gap-4 lg:flex xl:gap-8">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="group relative font-display text-[0.7rem] uppercase tracking-widest2 text-slate-300 transition hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="hidden xl:block">
            <NeonButton onClick={() => { play(0); go('#album') }}>▶ Play</NeonButton>
          </div>

          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={cn(
                'h-px w-6 bg-white transition-all',
                open && 'translate-y-[7px] rotate-45',
              )}
            />
            <span className={cn('h-px w-6 bg-white transition-all', open && 'opacity-0')} />
            <span
              className={cn(
                'h-px w-6 bg-white transition-all',
                open && '-translate-y-[7px] -rotate-45',
              )}
            />
          </button>
        </nav>
      </header>

      {/* Mobile overlay — z-[48]: above the dock (z-40) + ØMEGA badge (z-45),
          below the navbar (z-50) so the close toggle stays reachable. Scrolls
          when the menu is taller than the viewport (small phones / landscape). */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-[48] overflow-y-auto bg-void/95 backdrop-blur-xl transition-all duration-500 lg:hidden',
          // `invisible` when closed takes the menu buttons out of the tab order
          // (opacity/pointer-events alone leave them keyboard-focusable).
          open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0',
        )}
      >
        <div className="hud-grid pointer-events-none fixed inset-0 opacity-30" />
        <div className="relative mx-auto flex min-h-full w-fit flex-col items-center justify-center gap-6 py-24">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="relative font-display text-3xl font-bold uppercase tracking-widest text-slate-200 hover:text-neon-purple"
            >
              {l.label}
            </button>
          ))}
          <div className="relative mt-4">
            <NeonButton onClick={() => { play(0); go('#album') }}>▶ Play DYSTØPIA</NeonButton>
          </div>
        </div>
      </div>
    </>
  )
}
