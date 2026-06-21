import { Reveal } from '../components/ui/Reveal'

export function Manifesto() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-5 py-28 text-center md:px-8 md:py-40">
      <Reveal>
        <div className="font-mono text-xs uppercase tracking-widest3 text-neon-cyan/70">
          [ Transmission 001 ]
        </div>
      </Reveal>
      <Reveal delay={120}>
        <blockquote className="mt-8 text-balance font-display text-2xl font-bold leading-tight tracking-tight text-slate-100 md:text-4xl lg:text-5xl">
          Massive cinematic horns and strings smashing straight into those{' '}
          <span className="gradient-cool">heavy 808s</span> and sharp trap beats — soaked in
          hard-hitting melodies that feel like{' '}
          <span className="gradient-heat">ancient war drums</span> pounding through a{' '}
          <span className="gradient-heat">burning future.</span>
        </blockquote>
      </Reveal>
      <Reveal delay={240}>
        <div className="mt-10 flex items-center justify-center gap-4 font-mono text-[0.65rem] uppercase tracking-widest2 text-slate-500">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-neon-purple" />
          UTØPIA decays into DYSTØPIA
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-neon-purple" />
        </div>
      </Reveal>
    </section>
  )
}
