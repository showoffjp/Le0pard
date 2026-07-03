import { useEffect } from 'react'
import { useSecret } from '../../store/useSecret'
import { NeonButton } from '../ui/NeonButton'
import { TechFrame } from '../ui/TechFrame'
import { site } from '../../data/site'

// The classic sequence — one of two ways to find the signal (the other is
// entering a secret handle in the citizen form).
const SEQUENCE = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a',
]

export function SecretUnlock() {
  const unlocked = useSecret((s) => s.unlocked)
  const open = useSecret((s) => s.open)
  const fresh = useSecret((s) => s.fresh)
  const unlock = useSecret((s) => s.unlock)
  const show = useSecret((s) => s.show)
  const hide = useSecret((s) => s.hide)

  // Sequence detector + a dev hint in the console.
  useEffect(() => {
    console.log(
      '%c// DYSTØPIA — the ØMEGA signal hides in plain sight.  ↑ ↑ ↓ ↓ ← → ← → B A',
      'color:#ff6a00;font-family:monospace',
    )
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === SEQUENCE[idx]) {
        idx += 1
        if (idx === SEQUENCE.length) {
          idx = 0
          unlock()
        }
      } else {
        idx = k === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [unlock])

  // Escape to close + scroll lock while the transmission is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, hide])

  return (
    <>
      {/* persistent status badge for finders — reopens the transmission */}
      {unlocked && !open && (
        <button
          onClick={show}
          aria-label="Open ØMEGA transmission"
          className="fixed bottom-4 left-4 z-[45] inline-flex items-center gap-2 rounded-full border border-neon-ember/50 bg-void/80 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-widest2 text-neon-ember shadow-[0_0_18px_rgba(255,106,0,0.35)] backdrop-blur transition hover:border-neon-ember"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-ember shadow-[0_0_8px_#ff6a00]" />
          ØMEGA
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-void/90 p-4 backdrop-blur-md"
          onClick={hide}
          role="dialog"
          aria-modal="true"
          aria-label="ØMEGA transmission"
        >
          <div
            className={fresh ? 'w-full max-w-lg animate-[fadeUp_0.6s_ease-out]' : 'w-full max-w-lg'}
            onClick={(e) => e.stopPropagation()}
          >
            <TechFrame glow="ember" padded={false}>
              <div className="relative overflow-hidden p-8 text-center md:p-10">
                <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
                <div className="relative">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest3 text-neon-ember">
                    // Signal decrypted //
                  </p>

                  {/* octagon sigil */}
                  <div className="clip-tech mx-auto mt-6 flex h-24 w-24 items-center justify-center border-2 border-neon-ember/70 bg-void/50 shadow-[0_0_30px_rgba(255,106,0,0.4)]">
                    <span className="font-display text-5xl font-black text-neon-ember">Ø</span>
                  </div>

                  <h3 className="mt-6 gradient-heat font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
                    ØMEGA Clearance
                  </h3>
                  <p className="mx-auto mt-4 max-w-sm text-pretty text-sm leading-relaxed text-slate-300">
                    You found the frequency beneath the noise. You&apos;re inside the ØMEGA Circle
                    now — first through the gate on every transmission, before the rest of DYSTØPIA
                    even hears the signal.
                  </p>
                  <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                    Status saved · this badge stays with you
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <NeonButton href={site.links.bandcampArtist} variant="ember" newTab className="px-6 py-2.5">
                      Follow for the drop ▸
                    </NeonButton>
                    <NeonButton onClick={hide} variant="ghost" className="px-6 py-2.5">
                      Close
                    </NeonButton>
                  </div>
                </div>
              </div>
            </TechFrame>
          </div>
        </div>
      )}
    </>
  )
}
