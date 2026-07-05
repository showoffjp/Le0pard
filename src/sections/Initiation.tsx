import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { citizenFromHandle, isSecretHandle, type Citizen } from '../lib/citizen'
import { useSecret } from '../store/useSecret'
import { drawCitizenCard } from '../lib/citizenCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TechFrame } from '../components/ui/TechFrame'
import { NeonButton } from '../components/ui/NeonButton'
import { Reveal } from '../components/ui/Reveal'

const STORE_KEY = 'leopardo-citizen-handle'

export function Initiation() {
  const [handle, setHandle] = useState('')
  const [citizen, setCitizen] = useState<Citizen | null>(null)
  const [shared, setShared] = useState(false)
  // Card actions stay hidden until the async draw (font load) has finished, so
  // a fast click can't export a blank canvas.
  const [cardReady, setCardReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const unlockSecret = useSecret((s) => s.unlock)

  // Returning visitor: restore their citizen ID.
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORE_KEY)
    } catch {
      /* storage blocked */
    }
    if (saved) {
      setHandle(saved)
      setCitizen(citizenFromHandle(saved))
    }
  }, [])

  // Redraw the card whenever the citizen changes.
  useEffect(() => {
    if (!citizen || !canvasRef.current) return
    setCardReady(false)
    void drawCitizenCard(canvasRef.current, citizen).then(() => setCardReady(true))
  }, [citizen])

  const initiate = (e?: FormEvent) => {
    e?.preventDefault()
    const h = handle.trim()
    if (!h) return
    setCitizen(citizenFromHandle(h))
    setShared(false)
    if (isSecretHandle(h)) unlockSecret()
    try {
      localStorage.setItem(STORE_KEY, h)
    } catch {
      /* storage blocked */
    }
  }

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dystopia-citizen-${citizen?.id ?? 'id'}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [citizen])

  const share = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !citizen) return
    const text = `I'm a ${citizen.rank} of the ${citizen.faction.name} in DYSTØPIA. Find your faction →`
    // The link carries the sharer's handle so arrivals get a personalized summons.
    const url = `${window.location.origin}/?via=${encodeURIComponent(citizen.handle)}`
    const file = await new Promise<File | null>((res) =>
      canvas.toBlob(
        (b) => res(b ? new File([b], 'dystopia-citizen.png', { type: 'image/png' }) : null),
        'image/png',
      ),
    )
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
    if (file && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], text, url })
        setShared(true)
        return
      } catch (err) {
        // User closed the share sheet — respect the cancel, no fallback.
        if ((err as DOMException | undefined)?.name === 'AbortError') return
        /* share genuinely failed — fall through to the desktop fallback */
      }
    }
    download()
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    )
    setShared(true)
  }, [citizen, download])

  return (
    <section id="citizen" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8">
      <Reveal>
        <SectionHeading index="02" kicker="Initiation" title="Become a Citizen" accent="cool" />
      </Reveal>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* pitch + form */}
        <Reveal delay={80}>
          <div>
            <p className="text-balance text-lg leading-relaxed text-slate-300">
              The world of DYSTØPIA needs its citizens. Enter a handle and the system assigns your{' '}
              <span className="text-readable text-neon-cyan">faction</span>, registration ID, and
              clearance — then claim your card and broadcast it.
            </p>

            <form onSubmit={initiate} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={18}
                placeholder="YOUR HANDLE"
                aria-label="Your handle"
                spellCheck={false}
                className="clip-tech-sm w-full flex-1 border border-white/15 bg-void/60 px-5 py-3.5 font-display text-sm uppercase tracking-widest2 text-white placeholder:text-slate-500 outline-none transition focus:border-neon-purple/70 focus:ring-1 focus:ring-neon-purple/40"
              />
              <NeonButton onClick={initiate} className="shrink-0 px-7 py-3.5">
                {citizen ? 'Re-initiate' : 'Initiate ▸'}
              </NeonButton>
            </form>

            {citizen && (
              <div className="mt-7">
                <p className="font-mono text-[0.7rem] uppercase tracking-widest2 text-slate-500">
                  Registered to
                </p>
                <p className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white">
                  {citizen.faction.name}
                </p>
                <p className="mt-1 text-sm italic text-slate-400">“{citizen.faction.motto}”</p>
                {cardReady && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <NeonButton onClick={share} variant="ember" className="px-6 py-2.5">
                      {shared ? 'Shared ✓ · Share again' : 'Broadcast ▸'}
                    </NeonButton>
                    <NeonButton onClick={download} variant="ghost" className="px-6 py-2.5">
                      Download card
                    </NeonButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </Reveal>

        {/* card */}
        <Reveal delay={140}>
          <div className="mx-auto w-full max-w-sm">
            {citizen ? (
              <TechFrame glow={citizen.faction.glow} padded={false} className="overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="block h-auto w-full"
                  aria-label={`DYSTØPIA citizen card for ${citizen.handle}`}
                />
              </TechFrame>
            ) : (
              <TechFrame glow="mix" padded={false}>
                <div className="flex aspect-[1080/1350] items-center justify-center bg-gradient-to-br from-steel/40 via-ink to-abyss">
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest2 text-slate-500">
                    Awaiting registration…
                  </span>
                </div>
              </TechFrame>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
