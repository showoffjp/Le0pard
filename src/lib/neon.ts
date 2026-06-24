// Shared neon gradient sampler (cyan → violet → purple → ember) for the canvas
// visualizers + 3D scene, matching the album's palette.
const STOPS: [number, [number, number, number]][] = [
  [0.0, [34, 211, 238]],
  [0.4, [124, 92, 255]],
  [0.72, [168, 85, 247]],
  [1.0, [255, 106, 0]],
]

/** Sample the gradient at t∈[0,1] → [r,g,b] each 0..255. */
export function neonRGB255(t: number): [number, number, number] {
  const tt = t < 0 ? 0 : t > 1 ? 1 : t
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (tt >= STOPS[i][0] && tt <= STOPS[i + 1][0]) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const f = hi[0] === lo[0] ? 0 : (tt - lo[0]) / (hi[0] - lo[0])
  return [
    Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * f),
    Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * f),
    Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * f),
  ]
}

/** Sample the gradient at t∈[0,1] → [r,g,b] each 0..1 (for THREE.Color). */
export function neonRGB01(t: number): [number, number, number] {
  const [r, g, b] = neonRGB255(t)
  return [r / 255, g / 255, b / 255]
}

export function neonColor(t: number, a = 1): string {
  const [r, g, b] = neonRGB255(t)
  return `rgba(${r},${g},${b},${a})`
}
