import { site } from '../../data/site'
import { dystopia } from '../../data/music'
import { Marquee } from '../ui/Marquee'
import { NeonButton } from '../ui/NeonButton'
import { useExperience } from '../../store/useExperience'

export function Footer() {
  const scrollTo = useExperience((s) => s.scrollTo)

  return (
    <footer className="relative z-10 mt-20 border-t border-white/5">
      <Marquee items={dystopia.tracks.map((t) => t.title)} className="border-y border-white/5 py-4" />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <button
              onClick={() => scrollTo(0)}
              className="font-display text-3xl font-black uppercase tracking-widest2 text-white"
            >
              LEOPARD<span className="text-neon-purple neon-purple">Ø</span>
            </button>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {site.tagline} Symphonic trap forged in {site.location}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NeonButton href={site.links.bandcamp} newTab>
                Bandcamp
              </NeonButton>
              <NeonButton href={site.links.video} variant="ghost" newTab>
                Latest Video
              </NeonButton>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-widest2 text-neon-cyan/80">
              Navigate
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {[
                ['Album', '#album'],
                ['Tracks', '#tracks'],
                ['Listen', '#listen'],
                ['Video', '#video'],
                ['News', '#posts'],
                ['About', '#about'],
              ].map(([label, id]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="transition hover:text-white">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-widest2 text-neon-cyan/80">
              Release
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>{site.album}</li>
              <li>{site.releaseDate}</li>
              <li>{dystopia.tracks.length} tracks</li>
              <li>{site.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-600 md:flex-row">
          <span>© {site.releaseYear} {site.artist}. All rights reserved.</span>
          <span className="font-mono tracking-widest2">EXPERIENCE CRAFTED IN THE DARK</span>
        </div>
      </div>
    </footer>
  )
}
