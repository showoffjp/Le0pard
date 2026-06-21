import { useAudio } from '../store/useAudio'
import { dystopia } from '../data/music'
import type { Track } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { Marquee } from '../components/ui/Marquee'
import { cn } from '../lib/cn'

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

function TrackRow({ track, active, onPlay }: { track: Track; active: boolean; onPlay: () => void }) {
  const bookend = track.n === 1 || track.n === dystopia.tracks.length
  return (
    <button
      onClick={onPlay}
      className={cn(
        'group flex w-full items-center gap-4 border-b border-white/5 py-3.5 text-left transition-colors hover:bg-white/[0.025]',
        active && 'bg-neon-purple/[0.06]',
      )}
    >
      <span
        className={cn(
          'w-8 shrink-0 font-mono text-sm tabular-nums transition-colors',
          active
            ? 'text-neon-purple'
            : bookend
              ? 'text-neon-ember'
              : 'text-slate-500 group-hover:text-neon-cyan',
        )}
      >
        {String(track.n).padStart(2, '0')}
      </span>
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        {active ? (
          <EqIcon />
        ) : (
          <>
            <span className="absolute inset-0 scale-0 rounded-full bg-neon-purple/20 transition-transform duration-300 group-hover:scale-100" />
            <span className="text-[0.7rem] text-neon-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              ▶
            </span>
          </>
        )}
      </span>
      <span
        className={cn(
          'flex-1 truncate font-display text-base font-semibold uppercase tracking-wide transition-all duration-300 group-hover:translate-x-1 md:text-lg',
          active ? 'text-neon-purple neon-purple' : bookend ? 'text-white' : 'text-slate-200 group-hover:text-white',
        )}
      >
        {track.title}
      </span>
      <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">{track.duration}</span>
    </button>
  )
}

export function TrackList() {
  const play = useAudio((s) => s.play)
  const playing = useAudio((s) => s.playing)
  const trackIndex = useAudio((s) => s.trackIndex)

  const half = Math.ceil(dystopia.tracks.length / 2)
  const left = dystopia.tracks.slice(0, half)
  const right = dystopia.tracks.slice(half)
  const isActive = (t: Track) => playing && trackIndex === t.n - 1

  return (
    <section id="tracks" className="relative z-10 scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading index="02" kicker="20 Movements" title="Tracklist" />
        </Reveal>

        <Reveal delay={80}>
          <div className="grid gap-x-12 gap-y-0 md:grid-cols-2">
            <div>
              {left.map((t) => (
                <TrackRow key={t.n} track={t} active={isActive(t)} onPlay={() => play(t.n - 1)} />
              ))}
            </div>
            <div>
              {right.map((t) => (
                <TrackRow key={t.n} track={t} active={isActive(t)} onPlay={() => play(t.n - 1)} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Marquee
        items={dystopia.tracks.map((t) => t.title)}
        className="mt-16 border-y border-white/5 py-4"
      />
    </section>
  )
}
