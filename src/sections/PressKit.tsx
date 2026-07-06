import { site } from '../data/site'
import { dystopia, albumRuntime } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'

const ASSETS = [
  { label: 'Album Art — 1200px', href: '/img/dystopia-cover.jpg' },
  { label: 'Album Art — 700px', href: '/img/dystopia-cover-700.jpg' },
  { label: 'Album Art — 350px', href: '/img/dystopia-cover-350.jpg' },
]

/** Electronic Press Kit — bio, fast facts, downloadable assets, press contact. */
export function PressKit() {
  const runtime = albumRuntime(dystopia)
  const facts: [string, string][] = [
    ['Artist', site.artist],
    ['Based', site.location],
    ['Album', `${dystopia.title} (${dystopia.year})`],
    ['Released', site.releaseDate],
    ['Tracks', String(dystopia.tracks.length)],
    ['Runtime', `${runtime.minutes} min`],
    ['Genres', site.genres.join(' · ')],
    ['For Fans Of', 'Symphonic trap · cinematic 808s'],
  ]

  return (
    <section id="press" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="10" kicker="EPK · For Media" title="Press Kit" accent="heat" />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Bio */}
        <Reveal>
          <TechFrame glow="purple" className="h-full" innerClassName="flex h-full flex-col">
            <div className="font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan/70">Biography</div>
            <p className="mt-3 text-lg leading-relaxed text-slate-200">{site.bio}</p>
            <p className="mt-4 leading-relaxed text-slate-400">{site.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NeonButton href={site.links.bandcamp} variant="ember" newTab>
                ▶ Listen
              </NeonButton>
              <NeonButton href={site.links.video} variant="ghost" newTab>
                Watch Video
              </NeonButton>
            </div>
          </TechFrame>
        </Reveal>

        {/* Fast facts */}
        <Reveal delay={80}>
          <TechFrame glow="blue" className="h-full">
            <div className="font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan/70">Fast Facts</div>
            <dl className="mt-4 divide-y divide-white/8">
              {facts.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">{k}</dt>
                  <dd className="text-right font-display text-sm font-bold uppercase tracking-wide text-white">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </TechFrame>
        </Reveal>
      </div>

      {/* Assets + contact */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal>
          <TechFrame glow="cyan" innerClassName="flex h-full flex-col">
            <div className="font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan/70">
              Press Assets
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Hi-res album art for features, embeds and thumbnails. More assets on request.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {ASSETS.map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  download
                  className="group flex items-center justify-between gap-3 rounded-md border border-white/8 bg-white/[0.02] px-3 py-2.5 transition hover:border-neon-cyan/40 hover:bg-white/[0.05]"
                >
                  <span className="font-display text-xs uppercase tracking-wide text-slate-200">{a.label}</span>
                  <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500 group-hover:text-neon-cyan">
                    Download ↓
                  </span>
                </a>
              ))}
            </div>
          </TechFrame>
        </Reveal>

        <Reveal delay={80}>
          <TechFrame glow="mix" innerClassName="flex h-full flex-col">
            <div className="font-mono text-[0.6rem] uppercase tracking-widest2 text-neon-cyan/70">
              Press &amp; Booking
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              For interviews, premieres, sync, and booking enquiries, reach {site.artist} through any channel below — DMs open.
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-5">
              <NeonButton href={site.links.bandcampArtist} variant="ghost" newTab>
                Bandcamp
              </NeonButton>
              <NeonButton href={site.links.video} variant="ghost" newTab>
                Latest on X ↗
              </NeonButton>
            </div>
          </TechFrame>
        </Reveal>
      </div>
    </section>
  )
}
