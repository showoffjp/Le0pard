import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../store/useAudio'
import { attachMediaElement } from '../lib/audioReactor'

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
const sources = import.meta.glob('../assets/video/launch.{mp4,webm,mov,m4v}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const LAUNCH_SRC = Object.values(sources)[0] as string | undefined

export function LaunchVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const wired = useRef(false)
  const [sound, setSound] = useState(false)

  // Cede to the song player: once a visitor starts a track, stop the film so the
  // two audio sources never fight over the speakers / the analyser.
  useEffect(() => {
    if (!LAUNCH_SRC) return
    return useAudio.subscribe((s) => {
      const el = ref.current
      if (s.started && el && !el.paused) {
        el.pause()
        setSound(false)
      }
    })
  }, [])

  // First user gesture anywhere: resume the AudioContext, weld the film into the
  // shared analyser (→ the entire reactive site responds to it), and unmute.
  useEffect(() => {
    if (!LAUNCH_SRC) return
    const start = async () => {
      const el = ref.current
      if (wired.current || !el || useAudio.getState().started) return
      wired.current = true
      cleanup()
      await attachMediaElement(el).catch(() => {})
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
  }, [])

  if (!LAUNCH_SRC) return null

  return (
    <>
      <video
        ref={ref}
        src={LAUNCH_SRC}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-[0.6]"
      />
      {!sound && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 animate-pulse rounded-full border border-neon-cyan/40 bg-void/70 px-4 py-2 font-mono text-[0.58rem] uppercase tracking-widest2 text-neon-cyan backdrop-blur">
          ◢ Tap anywhere for sound ◣
        </div>
      )}
    </>
  )
}
