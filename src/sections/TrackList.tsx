import { useExperience } from '../store/useExperience'
import { dystopia } from '../data/music'
import type { Track } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { Marquee } from '../components/ui/Marquee'
import { cn } from '../lib/cn'

function TrackRow({ track, onPlay }: { track: Track; onPlay: () => void }) {
  const bookend = track.n === 1 || track.n === dystopia.tracks.length
  return (
    <button
      onClick={onPlay}
      className="group flex w-full items-center gap-4 border-b border-white/5 py-3.5 text-left transition-colors hover:bg-white/[0.025]"
    >
      <span
        className={cn(
          'w-8 shrink-0 font-mono text-sm tabular-nums transition-colors',
          bookend ? 'text-neon-ember' : 'text-slate-500 group-hover:text-neon-cyan',
        )}
      >
        {String(track.n).padStart(2, '0')}
      </span>
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        <span className="absolute inset-0 scale-0 rounded-full bg-neon-purple/20 transition-transform duration-300 group-hover:scale-100" />
        <span className="text-[0.7rem] text-neon-purple opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ▶
        </span>
      </span>
      <span
        className={cn(
          'flex-1 truncate font-display text-base font-semibold uppercase tracking-wide transition-all duration-300 group-hover:translate-x-1 md:text-lg',
          bookend ? 'text-white' : 'text-slate-200 group-hover:text-white',
        )}
      >
        {track.title}
      </span>
      <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">{track.duration}</span>
    </button>
  )
}

export function TrackList() {
  const scrollTo = useExperience((s) => s.scrollTo)
  const play = () => scrollTo('#listen')

  const half = Math.ceil(dystopia.tracks.length / 2)
  const left = dystopia.tracks.slice(0, half)
  const right = dystopia.tracks.slice(half)

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
                <TrackRow key={t.n} track={t} onPlay={play} />
              ))}
            </div>
            <div>
              {right.map((t) => (
                <TrackRow key={t.n} track={t} onPlay={play} />
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
