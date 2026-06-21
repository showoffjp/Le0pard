import { useEffect, useRef, useState } from 'react'
import { useExperience } from '../../store/useExperience'

/** Cinematic boot sequence that hands off to the experience once ready. */
export function Loader() {
  const setReady = useExperience((s) => s.setReady)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [hidden, setHidden] = useState(false)
  const pctRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      pctRef.current = Math.min(100, pctRef.current + Math.random() * 15 + 5)
      setPct(Math.floor(pctRef.current))
    }, 120)

    const start = performance.now()
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
    const fontsReady = Promise.resolve(fonts?.ready).catch(() => undefined)
    const cap = new Promise((res) => window.setTimeout(res, 2200))
    Promise.race([fontsReady, cap])
      .then(() => {
        const wait = Math.max(0, 1700 - (performance.now() - start))
        window.setTimeout(() => {
          clearInterval(interval)
          pctRef.current = 100
          setPct(100)
          setReady(true)
          setLeaving(true)
          window.setTimeout(() => setHidden(true), 850)
        }, wait)
      })

    return () => clearInterval(interval)
  }, [setReady])

  if (hidden) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void transition-opacity duration-700 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="hud-grid absolute inset-0 opacity-40" />
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="relative flex flex-col items-center px-6">
        <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest3 text-neon-cyan/70">
          Booting experience
        </div>
        <h1 className="gradient-cool font-display text-5xl font-black uppercase tracking-tight md:text-7xl">
          LEOPARD<span className="text-neon-purple">Ø</span>
        </h1>
        <div className="mt-2 font-display text-xs uppercase tracking-widest3 text-slate-500">
          D Y S T Ø P I A
        </div>

        <div className="mt-8 h-px w-64 overflow-hidden bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 font-mono text-xs tracking-widest2 text-slate-400">
          {String(pct).padStart(3, '0')}%
        </div>
      </div>
    </div>
  )
}
