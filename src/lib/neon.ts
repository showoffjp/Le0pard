// Shared neon gradient sampler (cyan → violet → purple → ember) for the canvas
// visualizers, matching the album's palette.
const STOPS: [number, [number, number, number]][] = [
  [0.0, [34, 211, 238]],
  [0.4, [124, 92, 255]],
  [0.72, [168, 85, 247]],
  [1.0, [255, 106, 0]],
]

export function neonColor(t: number, a = 1): string {
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
  const r = Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * f)
  const g = Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * f)
  const b = Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * f)
  return `rgba(${r},${g},${b},${a})`
}
