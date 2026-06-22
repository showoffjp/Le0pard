import { site } from '../data/site'
import { dystopia } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'

const embedSrc =
  `https://bandcamp.com/EmbeddedPlayer/album=${dystopia.bandcampEmbedId}` +
  `/size=large/bgcol=04050a/linkcol=a855f7/artwork=small/tracklist=true/transparent=true/`

export function Listen() {
  return (
    <section id="listen" className="relative z-10 mx-auto max-w-5xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="03" kicker="Full Stream" title="Listen" />
      </Reveal>

      <Reveal delay={100}>
        <TechFrame glow="purple" padded={false} className="overflow-hidden">
          <div className="scanlines relative">
            <iframe
              title="DYSTØPIA by LEOPARDØ — Bandcamp player"
              src={embedSrc}
              className="block h-[520px] w-full md:h-[640px]"
              style={{ border: 0 }}
              seamless
              loading="lazy"
            >
              <a href={dystopia.bandcampUrl}>DYSTØPIA by LEOPARDØ</a>
            </iframe>
          </div>
        </TechFrame>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-8 flex flex-col items-center justify-between gap-5 md:flex-row">
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Real playback, straight from Bandcamp. Support the artist — stream the full record,
            then grab it in lossless.
          </p>
          <div className="flex flex-wrap gap-3">
            <NeonButton href={dystopia.bandcampUrl} variant="ember" newTab>
              Buy on Bandcamp
            </NeonButton>
            <NeonButton href={site.links.bandcampArtist} variant="ghost" newTab>
              More from LEOPARDØ
            </NeonButton>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
