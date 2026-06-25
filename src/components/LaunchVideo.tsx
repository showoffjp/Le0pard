import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../store/useAudio'
import { attachMediaElement } from '../lib/audioReactor'
import { ambient } from '../lib/audioSignal'

/**
 * The launch film — auto-plays on entry as the deep backdrop (the 3D canvas is
 * transparent, so it renders behind the neon world) and drives the reactive
 * visualizer through the *same* analyser path the songs use.
 *
 * Why a self-hosted file and not the Drive embed: a cross-origin Drive iframe
 * can neither be audio-analyzed (WebAudio taints cross-origin media) nor
 * autoplay with sound. So this prefers an optimized web video dropped into
 * `src/assets/video/` (see that folder's README). With no file present it
 * renders nothing — the film still lives in the Video gallery as a Drive embed.
 *
 * Browser reality: autoplay *with sound* is blocked everywhere until a user
 * gesture, so the film starts muted and the first tap/click/key anywhere welds
 * it to the analyser, unmutes it, and the whole site begins reacting for real.
 */
const one = (glob: Record<string, string>) => Object.values(glob)[0] as string | undefined
const DESKTOP_SRC = one(import.meta.glob('../assets/video/launch.{mp4,webm,mov,m4v}', { eager: true, import: 'default' }))
const MOBILE_SRC = one(import.meta.glob('../assets/video/launch-mobile.{mp4,webm}', { eager: true, import: 'default' }))
const LAUNCH_POSTER = one(import.meta.glob('../assets/video/launch.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }))

/**
 * The launch film plays on entry on EVERY device. Muted autoplay (with
 * playsInline) is permitted by every browser, so we only skip when there's
 * genuinely no file present or no DOM (SSR). The first tap/click/key unmutes it
 * and welds it to the analyser. Phones get the lighter `launch-mobile.mp4`
 * encode when present, so the film plays without the full desktop download.
 */
function pickSrc(): string | undefined {
  if (typeof window === 'undefined') return undefined
  if (MOBILE_SRC && window.innerWidth < 768) return MOBILE_SRC
  return DESKTOP_SRC
}

export function LaunchVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const wired = useRef(false)
  const [sound, setSound] = useState(false)
  const [nearTop, setNearTop] = useState(true)
  const [src] = useState(pickSrc)
  const enabled = !!src

  // Drive the synthetic signal while the muted film plays, so the whole site is
  // reacting from the moment it loads. The first gesture welds the real analyser
  // (isLive) and takes over from there.
  useEffect(() => {
    if (!enabled) return
    ambient.active = true
    return () => {
      ambient.active = false
    }
  }, [enabled])

  // The film is bold in the hero but fades as you scroll past it, so the dark
  // content sections keep their focus (the film keeps playing + driving the
  // reactivity underneath — only its visual opacity fades).
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const apply = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight || 1
      const f = Math.max(0, 1 - window.scrollY / (vh * 0.85))
      el.style.opacity = String(0.06 + f * 0.84)
      setNearTop(window.scrollY < vh * 0.6)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  // Cede to the song player: once a visitor starts a track, stop the film so the
  // two audio sources never fight over the speakers / the analyser.
  useEffect(() => {
    if (!enabled) return
    return useAudio.subscribe((s) => {
      const el = ref.current
      if (s.started && el && !el.paused) {
        el.pause()
        ambient.active = false
        setSound(false)
      }
    })
  }, [enabled])

  // First user gesture anywhere: resume the AudioContext, weld the film into the
  // shared analyser (→ the entire reactive site responds to it), and unmute.
  useEffect(() => {
    if (!enabled) return
    const start = async () => {
      const el = ref.current
      if (wired.current || !el || useAudio.getState().started) return
      wired.current = true
      cleanup()
      await attachMediaElement(el).catch(() => {})
      ambient.active = false // real analyser (isLive) takes over now
      el.muted = false
      el.play().catch(() => {})
      setSound(true)
    }
    const cleanup = () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
      window.removeEventListener('touchstart', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    window.addEventListener('touchstart', start)
    return cleanup
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={LAUNCH_POSTER}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-90"
      />
      {/* keep the hero text readable over the brighter film */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-void/30 via-void/15 to-void/70"
      />
      {!sound && nearTop && (
        <button
          onClick={() => {}}
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 animate-pulse rounded-full border border-neon-cyan/50 bg-void/75 px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-widest2 text-neon-cyan shadow-[0_0_24px_rgba(34,211,238,0.35)] backdrop-blur transition-opacity"
        >
          ◢ Tap anywhere for sound ◣
        </button>
      )}
    </>
  )
}
