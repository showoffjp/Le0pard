import { describe, it, expect } from 'vitest'
import { samplePalette, makePalette } from './palette'

const at = (p: number) => samplePalette(p, makePalette())

describe('samplePalette', () => {
  it('returns the UTØPIA keyframe at progress 0', () => {
    const p = at(0)
    expect(p.ember).toBeCloseTo(0.05, 5)
    expect(p.distort).toBeCloseTo(0.26, 5)
    expect(p.bloom).toBeCloseTo(0.9, 5)
    expect(p.coreEmissive.getHexString()).toBe('2bd4ff')
  })

  it('returns the TRANSITION keyframe at progress 0.5', () => {
    const p = at(0.5)
    expect(p.ember).toBeCloseTo(0.3, 5)
    expect(p.distort).toBeCloseTo(0.4, 5)
    expect(p.bloom).toBeCloseTo(1.15, 5)
  })

  it('returns the DYSTØPIA keyframe at progress 1', () => {
    const p = at(1)
    expect(p.ember).toBeCloseTo(1, 5)
    expect(p.distort).toBeCloseTo(0.62, 5)
    expect(p.bloom).toBeCloseTo(1.45, 5)
    expect(p.lightB.getHexString()).toBe('ff6a00')
  })

  it('clamps out-of-range progress to [0, 1]', () => {
    expect(at(-3).ember).toBeCloseTo(0.05, 5)
    expect(at(9).ember).toBeCloseTo(1, 5)
  })

  it('drives ember monotonically up as the arc decays UTØPIA → DYSTØPIA', () => {
    expect(at(0).ember).toBeLessThan(at(0.25).ember)
    expect(at(0.25).ember).toBeLessThan(at(0.5).ember)
    expect(at(0.5).ember).toBeLessThan(at(0.75).ember)
    expect(at(0.75).ember).toBeLessThan(at(1).ember)
  })

  it('mutates and returns the same object (no per-frame allocation)', () => {
    const out = makePalette()
    expect(samplePalette(0.3, out)).toBe(out)
  })
})
