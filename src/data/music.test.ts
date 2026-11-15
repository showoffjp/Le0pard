import { describe, it, expect } from 'vitest'
import { dystopia, trackAudioUrl, albumRuntime } from './music'

describe('trackAudioUrl', () => {
  it('maps a track number to its zero-padded /audio path', () => {
    expect(trackAudioUrl({ n: 1, title: 'x', duration: '3:00' })).toBe('/audio/01.mp3')
    expect(trackAudioUrl({ n: 12, title: 'y', duration: '3:00' })).toBe('/audio/12.mp3')
  })

  it('produces the expected path for every real track', () => {
    for (const t of dystopia.tracks) {
      expect(trackAudioUrl(t)).toBe(`/audio/${String(t.n).padStart(2, '0')}.mp3`)
    }
  })
})

describe('albumRuntime', () => {
  it('sums m:ss durations into whole minutes', () => {
    const r = albumRuntime({
      ...dystopia,
      tracks: [
        { n: 1, title: 'a', duration: '3:30' },
        { n: 2, title: 'b', duration: '2:30' },
      ],
    })
    expect(r.minutes).toBe(6) // 6:00
    expect(r.label).toBe('6 min')
  })

  it('reports a sane runtime + label for the real album', () => {
    const r = albumRuntime(dystopia)
    expect(r.minutes).toBeGreaterThan(0)
    expect(r.label).toMatch(/^\d+ min$/)
  })
})
