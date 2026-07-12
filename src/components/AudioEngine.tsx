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

  // Swap the source whenever the track changes. Setting `src` already re-runs the
  // media load algorithm, so no explicit el.load() — an explicit load() makes
  // Chromium eagerly buffer the whole file even with preload="none", which pulled
  // the first track (~3.7 MB) on every page load before anyone pressed play. Now
  // it only fetches when playback actually starts (below, or on the play toggle).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.src = trackAudioUrl(dystopia.tracks[trackIndex])
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
      // "none", not "auto": don't fetch any track audio until the visitor
      // actually presses play (the reactive launch film already carries the
      // opening moment). "auto" was eagerly pulling the whole first track
      // (~3.7 MB) on every page load; "metadata" still fetched the full MP3 on
      // servers without range support. The file streams in on demand at play.
      preload="none"
      onEnded={() => next()}
      onTimeUpdate={(e) => setMeta({ currentTime: e.currentTarget.currentTime })}
      onLoadedMetadata={(e) => setMeta({ duration: e.currentTarget.duration })}
    />
  )
}
