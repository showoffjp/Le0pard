import { useEffect, useRef } from 'react'
import { dystopia } from '../data/music'
import { signal } from '../lib/audioSignal'
import { sampleFrequency, sampleWaveform, analyserSampleRate } from '../lib/audioReactor'

const BARS = 96

// Neon color stops (cyan → violet → purple → ember) sampled by bar position.
const STOPS: [number, [number, number, number]][] = [
  [0.0, [34, 211, 238]],
  [0.4, [124, 92, 255]],
  [0.72, [168, 85, 247]],
  [1.0, [255, 106, 0]],
]
function colorAt(t: number, a: number): string {
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i][0] && t <= STOPS[i + 1][0]) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const f = hi[0] === lo[0] ? 0 : (t - lo[0]) / (hi[0] - lo[0])
  const r = Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * f)
  const g = Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * f)
  const b = Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * f)
  return `rgba(${r},${g},${b},${a})`
}

/**
 * God-tier audio visualizer: a Specterr-style radial frequency spectrum wrapped
 * around the album art, mirrored + symmetric, with a reactive ring, a waveform
 * halo, and a shockwave on every drop. Reads the live FFT directly.
 */
export function Visualizer({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = dystopia.coverSmall
    let imgReady = false
    img.onload = () => {
      imgReady = true
    }

    const freq = new Uint8Array(512)
    const wave = new Uint8Array(512)
    const bars = new Float32Array(BARS)
    let rot = 0
    let raf = 0

    const dpr = () => Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(r.width * dpr()))
      canvas.height = Math.max(1, Math.floor(r.height * dpr()))
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const d = dpr()

      sampleFrequency(freq)
      sampleWaveform(wave)

      // map the FFT to log-spaced bars across the real content (~40 Hz–9 kHz)
      const sr = analyserSampleRate()
      const n = freq.length
      const binHz = sr / 2 / n
      const loBin = Math.max(1, Math.floor(40 / binHz))
      const hiBin = Math.max(loBin + 2, Math.min(n - 1, Math.floor(9000 / binHz)))
      const ratio = hiBin / loBin
      for (let i = 0; i < BARS; i++) {
        const f0 = Math.floor(loBin * Math.pow(ratio, i / BARS))
        const f1 = Math.max(f0 + 1, Math.floor(loBin * Math.pow(ratio, (i + 1) / BARS)))
        let s = 0
        let c = 0
        for (let j = f0; j < f1 && j < n; j++) {
          s += freq[j]
          c++
        }
        const v = Math.pow(Math.min(1, (c ? s / c / 255 : 0) * (1 + (i / BARS) * 0.7)), 0.82)
        bars[i] = v > bars[i] ? v : bars[i] + (v - bars[i]) * 0.2
      }

      const bass = signal.bass
      const drop = signal.drop
      const energy = signal.energy

      // motion-trail fade
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(4,5,10,0.30)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const radius = Math.min(w, h) * 0.27
      const artR = radius * (1 + bass * 0.06 + drop * 0.16)
      const maxLen = Math.min(w, h) * 0.2
      rot += 0.0016 + energy * 0.004 + drop * 0.03

      // waveform halo
      ctx.beginPath()
      for (let i = 0; i <= 90; i++) {
        const a = (i / 90) * Math.PI * 2
        const wv = (wave[(i * 5) % wave.length] - 128) / 128
        const rr = artR * 1.06 + wv * maxLen * 0.32
        const x = cx + Math.cos(a) * rr
        const y = cy + Math.sin(a) * rr
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.lineWidth = 1.5 * d
      ctx.strokeStyle = `rgba(34,211,238,${0.18 + energy * 0.4})`
      ctx.stroke()

      // radial spectrum bars (mirrored both sides → symmetric)
      const barW = Math.max(1.4 * d, (Math.PI * artR) / BARS * 0.55)
      for (let i = 0; i < BARS; i++) {
        const mag = bars[i]
        const len = (0.05 + mag) * maxLen + drop * maxLen * 0.5
        const col = colorAt(i / BARS, 0.9)
        const glow = colorAt(i / BARS, 0.16)
        for (const sgn of [1, -1]) {
          const ang = -Math.PI / 2 + sgn * ((i / BARS) * Math.PI) + rot * sgn
          const ca = Math.cos(ang)
          const sa = Math.sin(ang)
          const x0 = cx + ca * artR
          const y0 = cy + sa * artR
          const x1 = cx + ca * (artR + len)
          const y1 = cy + sa * (artR + len)
          // glow underlay
          ctx.lineWidth = barW * 2.4
          ctx.strokeStyle = glow
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
          // bright core
          ctx.lineWidth = barW
          ctx.strokeStyle = col
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
        }
      }

      // album art in the center (clipped circle)
      if (imgReady) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, artR, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(img, cx - artR, cy - artR, artR * 2, artR * 2)
        // darken slightly so the play button reads
        ctx.fillStyle = `rgba(4,5,10,${0.12 + drop * 0.2})`
        ctx.fillRect(cx - artR, cy - artR, artR * 2, artR * 2)
        ctx.restore()

        // glowing rim
        ctx.globalCompositeOperation = 'lighter'
        ctx.beginPath()
        ctx.arc(cx, cy, artR, 0, Math.PI * 2)
        ctx.lineWidth = (2 + bass * 3) * d
        ctx.strokeStyle = `rgba(124,92,255,${0.45 + energy * 0.5})`
        ctx.stroke()
      }

      // shockwave ring on the drop
      if (drop > 0.01) {
        ctx.globalCompositeOperation = 'lighter'
        ctx.beginPath()
        ctx.arc(cx, cy, artR + maxLen * (1.4 - drop) + 8 * d, 0, Math.PI * 2)
        ctx.lineWidth = (1 + drop * 7) * d
        ctx.strokeStyle = `rgba(34,211,238,${drop * 0.8})`
        ctx.stroke()
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
