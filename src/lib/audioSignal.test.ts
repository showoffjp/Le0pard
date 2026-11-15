import { describe, it, expect } from 'vitest'
import { trackParams } from './audioSignal'
import { dystopia } from '../data/music'

const EPS = 1e-9

describe('trackParams', () => {
  it('is deterministic per index', () => {
    expect(trackParams(3)).toEqual(trackParams(3))
    expect(trackParams(7)).toEqual(trackParams(7))
  })

  it('keeps every param within its documented range for all tracks', () => {
    for (let i = 0; i < dystopia.tracks.length; i++) {
      const p = trackParams(i)
      expect(p.bpm).toBeGreaterThanOrEqual(80)
      expect(p.bpm).toBeLessThanOrEqual(147)
      expect(p.bassWeight).toBeGreaterThanOrEqual(0.85 - EPS)
      expect(p.bassWeight).toBeLessThanOrEqual(1.14 + EPS)
      expect(p.trebleWeight).toBeGreaterThanOrEqual(0.7 - EPS)
      expect(p.trebleWeight).toBeLessThanOrEqual(1.19 + EPS)
      expect(p.drive).toBeGreaterThanOrEqual(0.82 - EPS)
      expect(p.drive).toBeLessThanOrEqual(1.19 + EPS)
      expect([8, 16]).toContain(p.phrase)
    }
  })

  // Guards the >>> (unsigned shift) fix: a signed >> made the weights negative
  // for ~half the tracks, track 0 included, dropping them below their floors.
  it('never lets track 0 fall below its documented floors', () => {
    const p = trackParams(0)
    expect(p.bassWeight).toBeGreaterThanOrEqual(0.85 - EPS)
    expect(p.trebleWeight).toBeGreaterThanOrEqual(0.7 - EPS)
    expect(p.drive).toBeGreaterThanOrEqual(0.82 - EPS)
  })

  it('treats a negative index as 0', () => {
    expect(trackParams(-5)).toEqual(trackParams(0))
  })
})
