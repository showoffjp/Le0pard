import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../../store/useAudio'
import { useExperience } from '../../store/useExperience'
import { dystopia } from '../../data/music'
import { spectrum, BAR_COUNT } from '../../lib/audioSignal'
import { cn } from '../../lib/cn'

const BARS = BAR_COUNT

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  const ss = Math.floor(s % 60)
  return `${m}:${ss.toString().padStart(2, '0')}`
}

/**
 * Floating "Now Playing" dock — the persistent transport for the on-site
 * player. A real draggable scrubber (rewind / fast-forward), prev / next track
 * skip, play / pause. The bars + the whole site react to the real audio.
 */
export function NowPlaying() {
  const playing = useAudio((s) => s.playing)
  const started = useAudio((s) => s.started)
  const trackIndex = useAudio((s) => s.trackIndex)
  const toggle = useAudio((s) => s.toggle)
  const next = useAudio((s) => s.next)
  const prev = useAudio((s) => s.prev)
  const seek = useAudio((s) => s.seek)
  const currentTime = useAudio((s) => s.currentTime)
  const duration = useAudio((s) => s.duration)
  const scrollTo = useExperience((s) => s.scrollTo)
  const track = dystopia.tracks[trackIndex]
  const barsRef = useRef<HTMLDivElement>(null)
  const trackBarRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [scrub, setScrub] = useState<number | null>(null)

  const livePct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
  const pct = scrub != null ? scrub : livePct

  // ── scrubbing: click or drag the bar to rewind / fast-forward ──
  const ratioFrom = (clientX: number) => {
    const el = trackBarRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.width <= 0) return null
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width))
  }
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return
    draggingRef.current = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture is best-effort */
    }
    const ratio = ratioFrom(e.clientX)
    if (ratio != null) {
      setScrub(ratio * 100)
      seek(ratio * duration)
    }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const ratio = ratioFrom(e.clientX)
    if (ratio != null) {
      setScrub(ratio * 100)
      seek(ratio * duration)
    }
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const ratio = ratioFrom(e.clientX)
    if (ratio != null && duration > 0) seek(ratio * duration)
    setScrub(null)
  }
  // nudge helpers for explicit rewind / fast-forward
  const nudge = (sec: number) => {
    if (duration <= 0) return
    seek(Math.max(0, Math.min(duration, currentTime + sec)))
  }
  // keyboard operation for the slider (arrows / page / home-end)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (duration <= 0) return
    let handled = true
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nudge(-5)
        break
      case 'ArrowRight':
      case 'ArrowUp':
        nudge(5)
        break
      case 'PageDown':
        nudge(-15)
        break
      case 'PageUp':
        nudge(15)
        break
      case 'Home':
        seek(0)
        break
      case 'End':
        seek(duration)
        break
      default:
        handled = false
    }
    if (handled) e.preventDefault()
  }

  useEffect(() => {
    let raf = 0
    const loop = () => {
      // skip the per-frame DOM writes entirely while the dock is hidden (never
      // started) — no point animating 28 bars off-screen.
      const bars = useAudio.getState().started ? barsRef.current : null
      if (bars) {
        const children = bars.children
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as HTMLElement
          // straight from the real FFT — an accurate spectrum of what's playing
          el.style.transform = `scaleY(${Math.max(0.04, spectrum[i])})`
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
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 transition-all duration-500 md:pb-4',
        started ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0',
      )}
    >
      <div className="pointer-events-auto relative flex w-full max-w-2xl flex-col gap-2 overflow-hidden clip-tech-sm glass border border-white/10 px-3 py-2.5 shadow-[0_0_34px_rgba(124,58,237,.3)] md:px-4 md:py-3">
        {/* draggable scrubber — rewind / fast-forward */}
        <div className="flex items-center gap-2.5">
          <span className="w-9 shrink-0 text-right font-mono text-[0.6rem] tabular-nums text-slate-400">
            {fmt(currentTime)}
          </span>
          <div
            ref={trackBarRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.max(0, Math.round(duration))}
            aria-valuenow={Math.round(currentTime)}
            className="group relative flex h-4 flex-1 cursor-pointer touch-none items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/70"
          >
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-purple"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* handle */}
            <span
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(168,85,247,.9)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ left: `${pct}%`, opacity: scrub != null ? 1 : undefined }}
            />
          </div>
          <span className="w-9 shrink-0 font-mono text-[0.6rem] tabular-nums text-slate-500">
            {fmt(duration)}
          </span>
        </div>

        {/* transport */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={toggle}
            className="react-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-violet to-neon-blue text-sm text-white shadow-[0_0_22px_rgba(124,58,237,.6)] transition hover:brightness-110"
          >
            {playing ? '❚❚' : '▶'}
          </button>

          {/* equalizer — hidden on phones, where we show the track title instead */}
          <div ref={barsRef} className="hidden h-8 flex-1 items-end gap-[3px] sm:flex">
            {Array.from({ length: BARS }).map((_, i) => (
              <span
                key={i}
                className="h-full w-full origin-bottom rounded-[1px] bg-gradient-to-t from-neon-blue via-neon-violet to-neon-purple"
                style={{ transform: 'scaleY(0.06)' }}
              />
            ))}
          </div>

          <div className="min-w-0 flex-1 text-left sm:min-w-[140px] sm:flex-none sm:text-right">
            <div className="font-mono text-[0.55rem] uppercase tracking-widest2 text-neon-cyan/70">
              {playing ? 'Now Playing' : started ? 'Paused' : 'Reactive Player'}
            </div>
            <div className="truncate font-display text-sm font-bold uppercase tracking-wide text-white">
              {String(track.n).padStart(2, '0')} · {track.title}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button aria-label="Previous track" onClick={prev} className={btn}>
              ⟪
            </button>
            <button aria-label="Rewind 10 seconds" onClick={() => nudge(-10)} className={cn(btn, 'hidden sm:flex')}>
              «
            </button>
            <button aria-label="Fast-forward 10 seconds" onClick={() => nudge(10)} className={cn(btn, 'hidden sm:flex')}>
              »
            </button>
            <button aria-label="Next track" onClick={next} className={btn}>
              ⟫
            </button>
            <button
              aria-label="Go to album"
              onClick={() => scrollTo('#album')}
              className="hidden h-9 items-center rounded-full border border-neon-cyan/40 bg-white/[0.04] px-3 font-display text-[0.6rem] uppercase tracking-widest2 text-neon-cyan transition hover:bg-neon-cyan/10 md:flex"
            >
              Album
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
