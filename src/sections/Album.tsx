import { useAudio } from '../store/useAudio'
import { site } from '../data/site'
import { dystopia, albumRuntime, type Track } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Visualizer } from '../components/Visualizer'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { MagicLayer } from '../components/ui/MagicLayer'
import { Parallax } from '../components/ui/Parallax'
import { Marquee } from '../components/ui/Marquee'
import { cn } from '../lib/cn'

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

function EqIcon() {
  return (
    <span className="flex h-4 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] animate-pulse-glow rounded-full bg-neon-purple"
          style={{ height: ['10px', '16px', '7px'][i], animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  )
}

function TrackRow({
  track,
  active,
  playing,
  onPlay,
}: {
  track: Track
  active: boolean
  playing: boolean
  onPlay: () => void
}) {
  const bookend = track.n === 1 || track.n === dystopia.tracks.length
  return (
    <button
      onClick={onPlay}
      className={cn(
        'group flex w-full items-center gap-4 border-b border-white/5 py-3.5 text-left transition-colors hover:bg-white/[0.025]',
        active && 'react-jolt bg-neon-purple/[0.06]',
      )}
    >
      <span
        className={cn(
          'w-8 shrink-0 font-mono text-sm tabular-nums transition-colors',
          active ? 'text-neon-purple' : bookend ? 'text-neon-ember' : 'text-slate-500 group-hover:text-neon-cyan',
        )}
      >
        {String(track.n).padStart(2, '0')}
      </span>
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        {active && playing ? (
          <EqIcon />
        ) : (
          <>
            <span className="absolute inset-0 scale-0 rounded-full bg-neon-purple/20 transition-transform duration-300 group-hover:scale-100" />
            <span
              className={cn(
                'text-[0.7rem] text-neon-purple transition-opacity duration-300',
                active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              ▶
            </span>
          </>
        )}
      </span>
      <span
        className={cn(
          'flex-1 truncate font-display text-base font-semibold uppercase tracking-wide transition-all duration-300 group-hover:translate-x-1 md:text-lg',
          active
            ? 'text-neon-purple neon-purple'
            : bookend
              ? 'text-readable text-white'
              : 'text-readable text-slate-200 group-hover:text-white',
        )}
      >
        {track.title}
      </span>
      <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">{track.duration}</span>
    </button>
  )
}

export function Album() {
  const play = useAudio((s) => s.play)
  const toggle = useAudio((s) => s.toggle)
  const seek = useAudio((s) => s.seek)
  const playing = useAudio((s) => s.playing)
  const started = useAudio((s) => s.started)
  const trackIndex = useAudio((s) => s.trackIndex)
  const currentTime = useAudio((s) => s.currentTime)
  const duration = useAudio((s) => s.duration)

  const runtime = albumRuntime(dystopia)
  const current = dystopia.tracks[trackIndex]
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  const half = Math.ceil(dystopia.tracks.length / 2)
  const left = dystopia.tracks.slice(0, half)
  const right = dystopia.tracks.slice(half)

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    if (duration > 0) seek(ratio * duration)
  }

  const stats = [
    { k: 'Tracks', v: String(dystopia.tracks.length) },
    { k: 'Runtime', v: `${runtime.minutes}m` },
    { k: 'Released', v: '2026' },
  ]

  return (
    <section id="album" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="01" kicker="The Album · Press Play" title="DYSTØPIA" accent="heat" />
      </Reveal>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* cover + on-site player */}
        <Reveal>
          <Parallax speed={14}>
            <MagicLayer depth={14}>
              <div className="relative">
                <div className="absolute -inset-6 -z-10 animate-pulse-glow rounded-full bg-gradient-to-tr from-neon-purple/30 via-neon-blue/20 to-neon-ember/20" />
                <div className="relative aspect-square overflow-hidden clip-tech">
                  <Visualizer className="absolute inset-0 h-full w-full" />
                  <button
                    aria-label={playing ? 'Pause' : 'Play'}
                    onClick={() => (started ? toggle() : play(0))}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <span className="react-pop grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-neon-violet to-neon-blue text-xl text-white shadow-[0_0_44px_rgba(124,58,237,.7)] transition hover:scale-110">
                      {playing ? '❚❚' : '▶'}
                    </span>
                  </button>
                </div>

                {/* now playing + scrubber */}
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3 font-mono text-[0.6rem] uppercase tracking-widest2">
                    <span className="truncate text-slate-400">
                      <span className="text-neon-cyan">
                        {playing ? 'Now Playing' : started ? 'Paused' : 'Press Play'}
                      </span>{' '}
                      · {String(current.n).padStart(2, '0')} {current.title}
                    </span>
                    <span className="shrink-0 text-slate-500">
                      {fmt(currentTime)} / {fmt(duration)}
                    </span>
                  </div>
                  <div
                    onClick={onSeek}
                    className="mt-2 h-2 cursor-pointer overflow-hidden rounded-full bg-white/10"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-purple"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </MagicLayer>
          </Parallax>
        </Reveal>

        {/* info */}
        <Reveal delay={120}>
          <div>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">{dystopia.blurb}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              {site.genres.map((g) => (
                <span
                  key={g}
                  className="clip-tech-sm border border-white/10 bg-white/[0.03] px-3 py-1 font-display text-[0.65rem] uppercase tracking-widest2 text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.k} className="clip-tech-sm border border-white/10 bg-white/[0.02] px-4 py-4">
                  <div className="gradient-cool font-display text-2xl font-black md:text-3xl">{s.v}</div>
                  <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">{s.k}</div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <NeonButton variant="ember" onClick={() => play(0)}>
                ▶ Play Album
              </NeonButton>
              <NeonButton variant="ghost" href={dystopia.bandcampUrl} newTab>
                Buy · Lossless
              </NeonButton>
            </div>

            <div className="mt-6 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-500">
              {site.releaseDate} · {site.location}
            </div>
          </div>
        </Reveal>
      </div>

      {/* tracklist — tap any title to play it through the reactor */}
      <Reveal delay={80}>
        <div className="mt-14 grid gap-x-12 gap-y-0 md:grid-cols-2">
          <div>
            {left.map((t) => (
              <TrackRow
                key={t.n}
                track={t}
                active={trackIndex === t.n - 1}
                playing={playing}
                onPlay={() => play(t.n - 1)}
              />
            ))}
          </div>
          <div>
            {right.map((t) => (
              <TrackRow
                key={t.n}
                track={t}
                active={trackIndex === t.n - 1}
                playing={playing}
                onPlay={() => play(t.n - 1)}
              />
            ))}
          </div>
        </div>
      </Reveal>

      <Marquee items={dystopia.tracks.map((t) => t.title)} className="mt-16 border-y border-white/5 py-4" />
    </section>
  )
}
