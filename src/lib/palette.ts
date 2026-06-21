import { Color } from 'three'

/**
 * The album's narrative arc, mapped to color: scroll begins cool & hopeful
 * (UTØPIA) and decays into a hot, burning future (DYSTØPIA). Every reactive
 * element in the 3D scene samples this so the whole world "adapts" on scroll.
 */
export type Palette = {
  fog: Color
  background: Color
  coreColor: Color
  coreEmissive: Color
  lightA: Color
  lightB: Color
  ember: number // 0..1 ember intensity
  distort: number
  bloom: number
}

const c = (hex: string) => new Color(hex)

// Keyframes across progress 0 → 1
const utopia = {
  fog: c('#06122a'),
  background: c('#04050a'),
  coreColor: c('#0a2342'),
  coreEmissive: c('#2bd4ff'),
  lightA: c('#22d3ee'),
  lightB: c('#6366f1'),
  ember: 0.05,
  distort: 0.26,
  bloom: 0.9,
}

const transition = {
  fog: c('#0f0a2c'),
  background: c('#05050c'),
  coreColor: c('#1a0f3a'),
  coreEmissive: c('#8b5cf6'),
  lightA: c('#8b5cf6'),
  lightB: c('#3b82f6'),
  ember: 0.35,
  distort: 0.4,
  bloom: 1.15,
}

const dystopia = {
  fog: c('#140a2e'),
  background: c('#060209'),
  coreColor: c('#250a42'),
  coreEmissive: c('#a855f7'),
  lightA: c('#a855f7'),
  lightB: c('#ff6a00'),
  ember: 1,
  distort: 0.62,
  bloom: 1.45,
}

function lerpKey<K extends keyof typeof utopia>(
  key: K,
  a: typeof utopia,
  b: typeof utopia,
  t: number,
  out: Palette,
) {
  const av = a[key]
  const bv = b[key]
  if (av instanceof Color && bv instanceof Color) {
    ;(out[key as keyof Palette] as Color).copy(av).lerp(bv, t)
  } else {
    ;(out[key as keyof Palette] as number) =
      (av as number) + ((bv as number) - (av as number)) * t
  }
}

const keys = Object.keys(utopia) as (keyof typeof utopia)[]

/** Mutates and returns `out` to avoid per-frame allocations. */
export function samplePalette(progress: number, out: Palette): Palette {
  const p = Math.min(1, Math.max(0, progress))
  if (p < 0.5) {
    const t = p / 0.5
    keys.forEach((k) => lerpKey(k, utopia, transition, t, out))
  } else {
    const t = (p - 0.5) / 0.5
    keys.forEach((k) => lerpKey(k, transition, dystopia, t, out))
  }
  return out
}

export function makePalette(): Palette {
  return {
    fog: c('#06122a'),
    background: c('#04050a'),
    coreColor: c('#0a2342'),
    coreEmissive: c('#2bd4ff'),
    lightA: c('#22d3ee'),
    lightB: c('#6366f1'),
    ember: 0.05,
    distort: 0.26,
    bloom: 0.9,
  }
}
