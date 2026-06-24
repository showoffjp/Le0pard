import { useEffect, useState } from 'react'
import { useExperience } from '../../store/useExperience'
import { useAudio } from '../../store/useAudio'
import { NeonButton } from '../ui/NeonButton'
import { cn } from '../../lib/cn'

const LINKS = [
  { label: 'Album', id: '#album' },
  { label: 'Video', id: '#video' },
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

          <div className="hidden items-center gap-8 md:flex">
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

          <div className="hidden md:block">
            <NeonButton onClick={() => { play(0); go('#album') }}>▶ Play</NeonButton>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-void/95 backdrop-blur-xl transition-all duration-500 md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="hud-grid absolute inset-0 opacity-30" />
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
    </>
  )
}
