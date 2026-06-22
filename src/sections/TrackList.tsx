import { useMemo, useState } from 'react'
import { useAudio } from '../store/useAudio'
import { dystopia } from '../data/music'
import type { Track } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'
import { Marquee } from '../components/ui/Marquee'
import { cn } from '../lib/cn'

/** Bandcamp album embed cued to a 1-based track number — same player as Listen. */
const buildEmbed = (track: number) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${dystopia.bandcampEmbedId}` +
  `/size=large/bgcol=04050a/linkcol=a855f7/artwork=small/tracklist=true/transparent=true/t=${track}/`

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
  // 1-based track number currently cued in the player.
  const [active, setActive] = useState(1)

  const embedSrc = useMemo(() => buildEmbed(active), [active])
  const activeTrack = dystopia.tracks[active - 1]

  const onSelect = (t: Track) => {
    setActive(t.n)
    // Drive the Now Playing dock + reactive 3D world, exactly like elsewhere.
    play(t.n - 1)
  }

  return (
    <section id="tracks" className="relative z-10 scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading index="02" kicker="20 Movements · Tap to Play" title="Tracklist" />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
          {/* Player — cues whichever track you tap */}
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <TechFrame glow="purple" padded={false} className="overflow-hidden">
                <div className="scanlines relative">
                  <iframe
                    key={active}
                    title={`DYSTØPIA — ${activeTrack?.title ?? 'track'} — Bandcamp player`}
                    src={embedSrc}
                    className="block h-[440px] w-full"
                    style={{ border: 0 }}
                    seamless
                    loading="lazy"
                    allow="autoplay *; encrypted-media *; fullscreen *"
                  >
                    <a href={dystopia.bandcampUrl}>DYSTØPIA by LEOPARDØ</a>
                  </iframe>
                </div>
              </TechFrame>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                  <span className="text-neon-cyan">Cued</span> ·{' '}
                  {String(active).padStart(2, '0')} {activeTrack?.title}
                </p>
                <NeonButton href={dystopia.bandcampUrl} variant="ghost" newTab className="px-4 py-2">
                  Buy FLAC
                </NeonButton>
              </div>
            </div>
          </Reveal>

          {/* Playlist — tap any title to load it above */}
          <Reveal delay={80}>
            <div className="grid sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-1 xl:grid-cols-2">
              {dystopia.tracks.map((t) => (
                <TrackRow key={t.n} track={t} active={active === t.n} onPlay={() => onSelect(t)} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <Marquee
        items={dystopia.tracks.map((t) => t.title)}
        className="mt-16 border-y border-white/5 py-4"
      />
    </section>
  )
}
