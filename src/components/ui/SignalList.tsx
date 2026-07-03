import { useState, type FormEvent } from 'react'
import { NeonButton } from './NeonButton'
import { site } from '../../data/site'

/**
 * Email capture for "the signal list" — your owned audience.
 *
 * ACTIVATION (no code): set the build-time env var `VITE_SUBSCRIBE_ENDPOINT` to a
 * form-POST URL from a free service (Formspree / Getform / Buttondown), then
 * redeploy. Until it's set, this shows a Bandcamp-follow fallback instead of a
 * form that goes nowhere.
 */
const ENDPOINT = (import.meta.env as Record<string, string | undefined>).VITE_SUBSCRIBE_ENDPOINT

type Status = 'idle' | 'loading' | 'ok' | 'err'

export function SignalList() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  // No list wired yet → still capture the fan via a Bandcamp follow.
  if (!ENDPOINT) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-xl font-black uppercase tracking-tight text-white">
          Be first through the gate
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Follow to catch every transmission the moment it drops.
        </p>
        <div className="mt-5 flex justify-center">
          <NeonButton href={site.links.bandcampArtist} variant="ember" newTab className="px-7 py-3">
            Follow on Bandcamp ▸
          </NeonButton>
        </div>
      </div>
    )
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const body = new FormData()
      body.append('email', email)
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="font-display text-xl font-black uppercase tracking-tight text-white">
        Join the signal
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Be first through the gate — every drop, before the rest of DYSTØPIA hears it.
      </p>

      {status === 'ok' ? (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-void/60 px-5 py-2.5 font-mono text-xs uppercase tracking-widest2 text-neon-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#22d3ee]" />
          You&apos;re on the signal.
        </p>
      ) : (
        <form onSubmit={submit} className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@frequency"
            aria-label="Email address"
            className="clip-tech-sm w-full flex-1 border border-white/15 bg-void/60 px-5 py-3 font-sans text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-neon-cyan/70 focus:ring-1 focus:ring-neon-cyan/40"
          />
          <NeonButton onClick={() => submit()} variant="ember" className="shrink-0 px-6 py-3">
            {status === 'loading' ? 'Sending…' : 'Join ▸'}
          </NeonButton>
        </form>
      )}
      {status === 'err' && (
        <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest2 text-neon-ember">
          Signal lost — try again.
        </p>
      )}
    </div>
  )
}
