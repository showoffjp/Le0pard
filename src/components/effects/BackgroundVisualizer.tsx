import { useEffect, useRef } from 'react'
import { signal } from '../../lib/audioSignal'
import { sampleFrequency, sampleWaveform, analyserSampleRate } from '../../lib/audioReactor'
import { neonColor } from '../../lib/neon'
import { useExperience } from '../../store/useExperience'

const BARS = 72

/**
 * Full-screen, behind-everything audio visualizer — the WHOLE background reacts.
 * Mirrored top/bottom frequency bars across the full width, a center waveform,
 * and screen-wide shockwave rings + flash on every drop. Drawn additively on a
 * transparent canvas (screen blend) so the 3D world shows through. No re-renders.
 */
export function BackgroundVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)
  const lowPower = useExperience((s) => s.lowPower)

  useEffect(() => {
    if (reduced || lowPower) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const freq = new Uint8Array(512)
    const wave = new Uint8Array(512)
    const bars = new Float32Array(BARS)
    const barAvg = new Float32Array(BARS)
    let energyAvg = 0
    let raf = 0

    const dpr = () => Math.min(1, window.devicePixelRatio || 1)
    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr()))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr()))
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      const w = canvas.width
      const h = canvas.height
      const d = dpr()
      sampleFrequency(freq)
      sampleWaveform(wave)

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
        const v = Math.min(1, c ? s / c / 255 : 0)
        bars[i] = v > bars[i] ? v : bars[i] + (v - bars[i]) * 0.2
        // slow per-band average — we only draw the part ABOVE it (the beats), so
        // a constantly-loud track never sits pinned at max.
        barAvg[i] += (bars[i] - barAvg[i]) * 0.02
      }

      const drop = signal.drop
      const impact = signal.impact
      const energy = signal.energy
      energyAvg += (energy - energyAvg) * 0.012
      const pulse = Math.max(0, energy - energyAvg) // "punch" above the steady level

      // Readability gate: near-invisible when the music is steady; only ramps
      // toward full on real swells + drops.
      canvas.style.opacity = String(Math.min(0.85, 0.08 + pulse * 2.8 + impact * 0.85))

      // fade previous frame toward transparent (trails; keeps the 3D visible)
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${0.16 + drop * 0.12})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const maxH = h * 0.16
      const bw = w / BARS
      for (let i = 0; i < BARS; i++) {
        // only the beat content (how far this band is above its recent average)
        const rel = Math.min(1, Math.max(0, bars[i] - barAvg[i] * 0.96) * 3.2)
        const bh = rel * maxH + drop * maxH * 0.7
        if (bh < 0.6) continue
        const x = i * bw
        ctx.fillStyle = neonColor(i / BARS, 0.06)
        ctx.fillRect(x - bw * 0.5, h - bh, bw * 2, bh)
        ctx.fillRect(x - bw * 0.5, 0, bw * 2, bh)
        ctx.fillStyle = neonColor(i / BARS, 0.3 + impact * 0.4)
        ctx.fillRect(x, h - bh, bw * 0.9, bh)
        ctx.fillRect(x, 0, bw * 0.9, bh)
      }

      // center oscilloscope — amplitude follows the punch, not the constant level
      const mid = h / 2
      const amp = (0.006 + pulse * 1.7 + impact * 0.5 + drop * 0.4) * h * 0.4
      const SEG = 256
      const step = Math.max(1, Math.floor(wave.length / SEG))
      ctx.beginPath()
      for (let i = 0; i <= SEG; i++) {
        const x = (i / SEG) * w
        const wv = (wave[(i * step) % wave.length] - 128) / 128
        const y = mid + wv * amp
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineWidth = (1.3 + impact * 2) * d
      ctx.strokeStyle = neonColor(0.28, 0.18 + impact * 0.4)
      ctx.stroke()

      // screen-wide shockwave on the drop only
      if (drop > 0.02) {
        const cx = w / 2
        const cy = h / 2
        const maxR = Math.hypot(w, h) * 0.6
        ctx.beginPath()
        ctx.arc(cx, cy, (1 - drop) * maxR + 10, 0, Math.PI * 2)
        ctx.lineWidth = (2 + drop * 9) * d
        ctx.strokeStyle = `rgba(34,211,238,${drop * 0.4})`
        ctx.stroke()
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced, lowPower])

  if (reduced || lowPower) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
