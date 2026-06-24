import { useEffect, useRef } from 'react'
import { signal } from '../../lib/audioSignal'
import { sampleFrequency, analyserSampleRate } from '../../lib/audioReactor'
import { neonColor } from '../../lib/neon'
import { useExperience } from '../../store/useExperience'

const BARS = 80

/**
 * Header + footer audio bars — slim neon spectrum strips pinned to the very top
 * and bottom of the page. They react to the live FFT every frame (always on while
 * a song plays, eased by `level`) but stay THIN so they never eat the content.
 * Each bar is painted from a flowing horizontal neon gradient that drifts over
 * time and shifts with the music's energy, so the color literally moves with the
 * sound. Drops kick the bars taller + add a gentle full-screen flash. No re-renders.
 */
export function BackgroundVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const freq = new Uint8Array(512)
    const bars = new Float32Array(BARS)
    let raf = 0

    const dpr = () => Math.min(1.5, window.devicePixelRatio || 1)
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

      // log-spaced bands across the real content (~40 Hz–9 kHz)
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
        // gentle high tilt + gamma so every band reads
        const v = Math.pow(Math.min(1, (c ? s / c / 255 : 0) * (1 + (i / BARS) * 0.6)), 0.9)
        bars[i] = v > bars[i] ? v : bars[i] + (v - bars[i]) * 0.3
      }

      const drop = signal.drop
      const impact = signal.impact
      const I = signal.intensity
      const lev = signal.level

      // Always present while a song plays (eased by level), invisible when idle.
      // Because the strips are THIN, full bars still never crowd the page.
      canvas.style.opacity = String(Math.min(0.9, lev))
      if (lev < 0.02) {
        ctx.clearRect(0, 0, w, h)
        raf = requestAnimationFrame(loop)
        return
      }

      // fast trail fade → a little motion smear without piling into a wall
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${0.42 + drop * 0.2})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // Flowing horizontal neon gradient — drifts slowly on its own and shifts
      // with the track's energy so the whole strip's color moves with the sound.
      const shift = (performance.now() * 0.00004 + signal.energy * 0.35 + signal.tone * 0.4) % 1
      const core = ctx.createLinearGradient(0, 0, w, 0)
      const glow = ctx.createLinearGradient(0, 0, w, 0)
      for (let s = 0; s <= 6; s++) {
        const t = (s / 6 + shift) % 1
        core.addColorStop(s / 6, neonColor(t, 0.92))
        glow.addColorStop(s / 6, neonColor(t, 0.2 + impact * 0.32))
      }

      const band = Math.min(h * 0.075, 78 * d) // slim header/footer strip
      const bw = w / BARS
      for (let i = 0; i < BARS; i++) {
        const bh = (0.12 + bars[i] * 0.88) * band + drop * band * 0.5
        if (bh < 0.6) continue
        const x = i * bw
        // soft glow underlay
        ctx.fillStyle = glow
        ctx.fillRect(x - bw * 0.4, 0, bw * 1.8, bh)
        ctx.fillRect(x - bw * 0.4, h - bh, bw * 1.8, bh)
        // bright core
        ctx.fillStyle = core
        ctx.fillRect(x + bw * 0.12, 0, bw * 0.76, bh)
        ctx.fillRect(x + bw * 0.12, h - bh, bw * 0.76, bh)
      }

      // gentle full-screen flash only on a genuine drop in an intense section
      if (drop > 0.02 && I > 0.15) {
        ctx.fillStyle = `rgba(124,92,255,${drop * I * 0.12})`
        ctx.fillRect(0, 0, w, h)
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  if (reduced) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
