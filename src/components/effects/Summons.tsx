import { useEffect, useState } from 'react'
import { citizenFromHandle, type Citizen } from '../../lib/citizen'
import { useExperience } from '../../store/useExperience'

const DISMISS_KEY = 'leopardo-summons-dismissed'

/**
 * The recruitment half of the share loop. Citizen-card share links carry
 * `?via=<handle>`; arrivals get a personalized summons naming the recruiter and
 * their faction (derived deterministically from the handle — no backend), with
 * a CTA straight to the Initiation section. Dismissal sticks for the session.
 */
export function Summons() {
  const scrollTo = useExperience((s) => s.scrollTo)
  const [recruiter, setRecruiter] = useState<Citizen | null>(null)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return
    } catch {
      /* storage blocked — still show the summons */
    }
    const via = new URLSearchParams(window.location.search).get('via')
    if (!via || !via.trim() || via.length > 24) return
    setRecruiter(citizenFromHandle(via))
  }, [])

  const dismiss = () => {
    setRecruiter(null)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* storage blocked */
    }
  }

  if (!recruiter) return null

  return (
    <div className="fixed inset-x-3 top-20 z-[45] flex justify-center md:top-24">
      <div className="clip-tech-sm flex max-w-xl animate-[fadeUp_0.6s_ease-out] items-center gap-3 border border-neon-cyan/40 bg-void/85 px-4 py-3 shadow-[0_0_28px_rgba(34,211,238,0.25)] backdrop-blur-md md:gap-4 md:px-5">
        <span className="hidden h-2 w-2 shrink-0 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_10px_#22d3ee] sm:block" />
        <p className="min-w-0 text-xs leading-snug text-slate-300 md:text-sm">
          <span className="font-display font-bold uppercase tracking-wide text-white">
            {recruiter.handle}
          </span>{' '}
          of the{' '}
          <span className="font-display font-bold uppercase tracking-wide text-neon-cyan">
            {recruiter.faction.name}
          </span>{' '}
          summoned you.
        </p>
        <button
          onClick={() => {
            dismiss()
            scrollTo('#citizen')
          }}
          className="clip-tech-sm shrink-0 bg-gradient-to-r from-neon-violet to-neon-blue px-3.5 py-2 font-display text-[0.6rem] font-bold uppercase tracking-widest2 text-white transition hover:brightness-110"
        >
          Claim yours ▸
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-slate-500 transition hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
