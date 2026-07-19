import { useEffect, useRef } from 'react'
import { useAudio } from '../store/useAudio'
import { dystopia, trackAudioUrl } from '../data/music'
import { site } from '../data/site'
import { attachMediaElement } from '../lib/audioReactor'

/**
 * OS-level "now playing" integration (Media Session API): lock-screen artwork,
 * track metadata, and hardware/notification transport controls — so playing the
 * album on a phone behaves like a real streaming app. Feature-detected; every
 * setActionHandler is individually try-wrapped because browsers throw on action
 * names they don't support yet.
 */
function updateMediaSession(trackIndex: number, playing: boolean) {
  if (!('mediaSession' in navigator)) return
  const ms = navigator.mediaSession
  const track = dystopia.tracks[trackIndex]
  try {
    ms.metadata = new MediaMetadata({
      title: track.title,
      artist: site.artist,
      album: dystopia.title,
      artwork: [
        { src: '/img/dystopia-cover-350.jpg', sizes: '350x350', type: 'image/jpeg' },
        { src: '/img/dystopia-cover-700.jpg', sizes: '700x700', type: 'image/jpeg' },
        { src: '/img/dystopia-cover.jpg', sizes: '1200x1198', type: 'image/jpeg' },
      ],
    })
    ms.playbackState = playing ? 'playing' : 'paused'
  } catch {
    /* metadata is progressive enhancement — never let it break playback */
  }
}

function bindMediaSessionActions() {
  if (!('mediaSession' in navigator)) return
  const ms = navigator.mediaSession
  const s = () => useAudio.getState()
  const actions: [MediaSessionAction, MediaSessionActionHandler][] = [
    ['play', () => s().toggle()],
    ['pause', () => s().pause()],
    ['previoustrack', () => s().prev()],
    ['nexttrack', () => s().next()],
    ['seekto', (d) => { if (d.seekTime != null) s().seek(d.seekTime) }],
    ['seekbackward', (d) => s().seek(Math.max(0, s().currentTime - (d.seekOffset ?? 10)))],
    ['seekforward', (d) => s().seek(Math.min(s().duration || Infinity, s().currentTime + (d.seekOffset ?? 10)))],
  ]
  for (const [action, handler] of actions) {
    try {
      ms.setActionHandler(action, handler)
    } catch {
      /* action not supported in this browser — skip it */
    }
  }
}

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

  // OS "now playing": transport handlers once, metadata on every track/state change.
  useEffect(() => {
    bindMediaSessionActions()
  }, [])
  useEffect(() => {
    updateMediaSession(trackIndex, playing)
  }, [trackIndex, playing])

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
