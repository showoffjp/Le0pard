import { Reveal } from '../components/ui/Reveal'
import { MaskReveal } from '../components/ui/MaskReveal'
import { AuroraText } from '../components/ui/AuroraText'

export function Manifesto() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-5 py-28 text-center md:px-8 md:py-40">
      <Reveal>
        <div className="font-mono text-xs uppercase tracking-widest3 text-neon-cyan/70">
          [ Transmission 001 ]
        </div>
      </Reveal>
      <MaskReveal delay={0.1}>
        <AuroraText className="mt-8 inline-block cursor-default">
          <blockquote className="aurora-text text-balance font-display text-2xl font-bold leading-tight tracking-tight transition-[transform,filter] duration-500 will-change-transform group-hover:scale-[1.015] group-hover:[animation-duration:4s] md:text-4xl lg:text-5xl">
            Massive cinematic horns and strings smashing straight into those{' '}
            <span className="aurora-accent">heavy 808s</span> and sharp trap beats — soaked in
            hard-hitting melodies that feel like{' '}
            <span className="aurora-accent">ancient war drums</span> pounding through a{' '}
            <span className="aurora-accent">burning future.</span>
          </blockquote>
        </AuroraText>
      </MaskReveal>
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
