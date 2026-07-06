import { albums } from '../data/music'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { Reveal } from '../components/ui/Reveal'

export function Discography() {
  return (
    <section id="discography" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="04" kicker="The Catalog" title="Discography" />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album, i) => (
          <Reveal key={album.id} delay={i * 100}>
            <a
              href={album.bandcampUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <TechFrame glow={album.era === 'dystopia' ? 'mix' : 'blue'} padded={false}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={album.coverSmall}
                    alt={`${album.title} cover`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
                  <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-void/60 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-300 backdrop-blur">
                    {album.year}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-white">
                    {album.title}
                  </h3>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest2 text-slate-500">
                    {album.date}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{album.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-display text-[0.65rem] uppercase tracking-widest2 text-neon-cyan transition group-hover:gap-3">
                    Listen ↗
                  </span>
                </div>
              </TechFrame>
            </a>
          </Reveal>
        ))}

        {/* next-up teaser */}
        <Reveal delay={albums.length * 100}>
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 border border-dashed border-white/10 px-6 text-center clip-tech">
            <span className="font-display text-3xl text-neon-purple/60">∞</span>
            <h3 className="font-display text-lg font-bold uppercase tracking-widest2 text-slate-300">
              Next Transmission
            </h3>
            <p className="text-sm text-slate-500">The signal continues. New drops incoming.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
