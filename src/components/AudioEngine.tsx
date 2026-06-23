import { useEffect, useRef } from 'react'
import { useAudio } from '../store/useAudio'
import { dystopia, trackAudioUrl } from '../data/music'
import { attachMediaElement } from '../lib/audioReactor'

/**
 * The single on-site audio player + analyser feed. One hidden <audio> element
 * drives both the speakers and a WebAudio AnalyserNode, so the entire reactive
 * visualizer (3D world + DOM) is welded to the real track that's playing.
 */
export function AudioEngine() {
  const ref = useRef<HTMLAudioElement>(null)
  const attached = useRef(false)
  const trackIndex = useAudio((s) => s.trackIndex)
  const playing = useAudio((s) => s.playing)
  const pendingSeek = useAudio((s) => s.pendingSeek)
  const next = useAudio((s) => s.next)
  const setMeta = useAudio((s) => s.setMeta)
  const clearSeek = useAudio((s) => s.clearSeek)

  // Swap the source whenever the track changes.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.src = trackAudioUrl(dystopia.tracks[trackIndex])
    el.load()
    if (useAudio.getState().playing) el.play().catch(() => {})
  }, [trackIndex])

  // Play / pause, and attach the analyser on first play (inside the gesture).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (playing) {
      if (!attached.current) {
        attached.current = true
        attachMediaElement(el).catch(() => {})
      }
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [playing])

  // Apply seek requests from the UI.
  useEffect(() => {
    const el = ref.current
    if (el && pendingSeek != null && Number.isFinite(pendingSeek)) {
      el.currentTime = pendingSeek
      clearSeek()
    }
  }, [pendingSeek, clearSeek])

  return (
    <audio
      ref={ref}
      preload="auto"
      onEnded={() => next()}
      onTimeUpdate={(e) => setMeta({ currentTime: e.currentTarget.currentTime })}
      onLoadedMetadata={(e) => setMeta({ duration: e.currentTarget.duration })}
    />
  )
}
