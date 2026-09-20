import { describe, it, expect, beforeEach } from 'vitest'
import { useAudio } from './useAudio'
import { dystopia } from '../data/music'

const N = dystopia.tracks.length

beforeEach(() => {
  // Reset the singleton store between tests (a fresh, paused, mid-track state).
  useAudio.setState({
    trackIndex: 0,
    playing: false,
    started: false,
    currentTime: 30,
    duration: 200,
    pendingSeek: null,
  })
})

describe('useAudio playback reducers', () => {
  it('play() with no index resumes the current track without resetting position', () => {
    useAudio.setState({ trackIndex: 2, currentTime: 42, duration: 180 })
    useAudio.getState().play()
    const s = useAudio.getState()
    expect(s.playing).toBe(true)
    expect(s.started).toBe(true)
    expect(s.trackIndex).toBe(2)
    expect(s.currentTime).toBe(42) // preserved — this is what the resume + media-session play rely on
  })

  it('play(i) on a different track resets time + duration to 0', () => {
    useAudio.getState().play(5)
    const s = useAudio.getState()
    expect(s.trackIndex).toBe(5)
    expect(s.playing).toBe(true)
    expect(s.currentTime).toBe(0)
    expect(s.duration).toBe(0)
  })

  it('play(i) on the SAME track keeps position', () => {
    useAudio.setState({ trackIndex: 3, currentTime: 55 })
    useAudio.getState().play(3)
    expect(useAudio.getState().currentTime).toBe(55)
  })

  it('toggle() flips playing and marks started', () => {
    useAudio.getState().toggle()
    expect(useAudio.getState().playing).toBe(true)
    useAudio.getState().toggle()
    expect(useAudio.getState().playing).toBe(false)
    expect(useAudio.getState().started).toBe(true)
  })

  it('pause() stops playback', () => {
    useAudio.setState({ playing: true })
    useAudio.getState().pause()
    expect(useAudio.getState().playing).toBe(false)
  })

  it('next() advances, wraps at the end, and resets position', () => {
    useAudio.setState({ trackIndex: N - 1, currentTime: 90 })
    useAudio.getState().next()
    const s = useAudio.getState()
    expect(s.trackIndex).toBe(0)
    expect(s.playing).toBe(true)
    expect(s.currentTime).toBe(0)
  })

  it('prev() goes back and wraps at the start', () => {
    useAudio.setState({ trackIndex: 0 })
    useAudio.getState().prev()
    expect(useAudio.getState().trackIndex).toBe(N - 1)
  })

  it('seek() queues a pending seek that clearSeek() clears', () => {
    useAudio.getState().seek(73)
    expect(useAudio.getState().pendingSeek).toBe(73)
    useAudio.getState().clearSeek()
    expect(useAudio.getState().pendingSeek).toBeNull()
  })
})
