import { useEffect, useRef } from 'react'
import { useAudio } from '../../store/useAudio'
import { useExperience } from '../../store/useExperience'
import { dystopia } from '../../data/music'
import { signal } from '../../lib/audioSignal'
import { cn } from '../../lib/cn'

const BARS = 20

/**
 * Floating "Now Playing" dock. Selecting a track drives the whole site's
 * reactive visualizer; real audio lives one tap away on Bandcamp.
 */
export function NowPlaying() {
  const playing = useAudio((s) => s.playing)
  const started = useAudio((s) => s.started)
  const trackIndex = useAudio((s) => s.trackIndex)
  const toggle = useAudio((s) => s.toggle)
  const next = useAudio((s) => s.next)
  const prev = useAudio((s) => s.prev)
  const reactiveStatus = useAudio((s) => s.reactiveStatus)
  const enableReactive = useAudio((s) => s.enableReactive)
  const disableReactive = useAudio((s) => s.disableReactive)
  const scrollTo = useExperience((s) => s.scrollTo)
  const track = dystopia.tracks[trackIndex]
  const barsRef = useRef<HTMLDivElement>(null)

  const live = reactiveStatus === 'on'
  const connecting = reactiveStatus === 'connecting'

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const bars = barsRef.current
      if (bars) {
        const children = bars.children
        const now = performance.now()
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as HTMLElement
          const t = i / BARS
          const band = t < 0.4 ? signal.bass : t < 0.72 ? signal.mid : signal.treble
          const wobble = 0.4 + 0.6 * Math.abs(Math.sin(i * 1.3 + now / 220))
          el.style.transform = `scaleY(${Math.max(0.06, band * wobble)})`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const btn =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-slate-200 transition hover:border-neon-purple/70 hover:text-white'

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 transition-all duration-500 md:pb-4',
        started ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0',
      )}
    >
      <div className="pointer-events-auto flex w-full max-w-2xl items-center gap-3 clip-tech-sm glass border border-white/10 px-3 py-2.5 shadow-[0_0_34px_rgba(124,58,237,.3)] md:gap-4 md:px-4 md:py-3">
        <button
          aria-label={playing ? 'Pause visualizer' : 'Play visualizer'}
          onClick={toggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-blue text-sm text-white shadow-[0_0_22px_rgba(124,58,237,.6)] transition hover:brightness-110"
        >
          {playing ? '❚❚' : '▶'}
        </button>

        <div ref={barsRef} className="flex h-8 flex-1 items-end gap-[3px]">
          {Array.from({ length: BARS }).map((_, i) => (
            <span
              key={i}
              className="h-full w-full origin-bottom rounded-[1px] bg-gradient-to-t from-neon-blue via-neon-violet to-neon-purple"
              style={{ transform: 'scaleY(0.06)' }}
            />
          ))}
        </div>

        <div className="hidden min-w-[140px] text-right sm:block">
          <div className="font-mono text-[0.55rem] uppercase tracking-widest2 text-neon-cyan/70">
            {live ? 'Live Sync · Real Audio' : playing ? 'Reactive Visualizer' : 'Visualizer · Paused'}
          </div>
          <div className="truncate font-display text-sm font-bold uppercase tracking-wide text-white">
            {live ? 'Reacting to your sound' : `${String(track.n).padStart(2, '0')} · ${track.title}`}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            aria-label={live ? 'Stop reactive sync' : 'Sync visuals to your real audio'}
            title={
              reactiveStatus === 'unsupported'
                ? 'Live capture is not supported in this browser'
                : reactiveStatus === 'denied'
                  ? 'Click to retry — share the playing tab and tick “share tab audio”'
                  : live
                    ? 'Live: the whole site is reacting to your real audio'
                    : 'Sync to whatever is actually playing (you’ll pick a tab + “share tab audio”)'
            }
            onClick={() => (live ? disableReactive() : enableReactive())}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-full border px-3 font-display text-[0.58rem] uppercase tracking-widest2 transition',
              live
                ? 'border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan shadow-[0_0_16px_rgba(34,211,238,.4)]'
                : 'border-white/15 bg-white/[0.04] text-slate-200 hover:border-neon-purple/70 hover:text-white',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                live ? 'animate-pulse bg-neon-cyan' : connecting ? 'animate-pulse bg-neon-purple' : 'bg-slate-400',
              )}
            />
            {connecting ? 'Syncing' : live ? 'Live' : 'Sync'}
          </button>
          <button aria-label="Previous track" onClick={prev} className={btn}>
            ⟪
          </button>
          <button aria-label="Next track" onClick={next} className={btn}>
            ⟫
          </button>
          <button
            aria-label="Listen on Bandcamp"
            onClick={() => scrollTo('#listen')}
            className="hidden h-9 items-center rounded-full border border-neon-cyan/40 bg-white/[0.04] px-3 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-cyan transition hover:bg-neon-cyan/10 md:flex"
          >
            Hear it
          </button>
        </div>
      </div>
    </div>
  )
}
