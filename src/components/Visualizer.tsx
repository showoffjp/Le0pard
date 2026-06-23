import { useEffect, useRef } from 'react'
import { dystopia } from '../data/music'
import { signal } from '../lib/audioSignal'
import { sampleFrequency, sampleWaveform, analyserSampleRate } from '../lib/audioReactor'
import { neonColor } from '../lib/neon'

const BARS = 96

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
      const I = signal.intensity

      // motion-trail fade
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(4,5,10,0.30)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const radius = Math.min(w, h) * 0.26
      const artR = radius * (1 + bass * 0.13 + drop * 0.26)
      const maxLen = Math.min(w, h) * 0.27
      rot += 0.0016 + energy * 0.006 + drop * 0.05

      // oscilloscope waveform halo (traces the live wave around the art)
      ctx.beginPath()
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2
        const wv = (wave[(i * 3) % wave.length] - 128) / 128
        const rr = artR * 1.08 + wv * maxLen * (0.15 + I * 0.45 + drop * 0.5)
        const x = cx + Math.cos(a) * rr
        const y = cy + Math.sin(a) * rr
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.lineWidth = 3 * d
      ctx.strokeStyle = `rgba(34,211,238,${0.1 + energy * 0.24})`
      ctx.stroke()
      ctx.lineWidth = 1.4 * d
      ctx.strokeStyle = `rgba(130,232,255,${0.4 + energy * 0.5})`
      ctx.stroke()

      // radial spectrum bars (mirrored both sides → symmetric)
      const barW = Math.max(1.4 * d, (Math.PI * artR) / BARS * 0.55)
      for (let i = 0; i < BARS; i++) {
        const mag = bars[i]
        const len = (0.04 + mag) * maxLen * (0.35 + I * 0.95 + bass * 0.3) + drop * maxLen * 1.0
        const col = neonColor(i / BARS, 0.9)
        const glow = neonColor(i / BARS, 0.16)
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
        ctx.lineWidth = (2 + bass * 3 + drop * 6) * d
        ctx.strokeStyle = `rgba(124,92,255,${0.45 + energy * 0.5 + drop * 0.5})`
        ctx.stroke()
      }

      // shockwave + flash on the drop
      if (drop > 0.01) {
        ctx.globalCompositeOperation = 'lighter'
        ctx.beginPath()
        ctx.arc(cx, cy, artR + maxLen * (1.6 - drop) + 8 * d, 0, Math.PI * 2)
        ctx.lineWidth = (1 + drop * 11) * d
        ctx.strokeStyle = `rgba(34,211,238,${drop * 0.95})`
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(cx, cy, artR + maxLen * (2.6 - drop * 2) + 8 * d, 0, Math.PI * 2)
        ctx.lineWidth = (1 + drop * 6) * d
        ctx.strokeStyle = `rgba(168,85,247,${drop * 0.7})`
        ctx.stroke()
        ctx.fillStyle = `rgba(150,90,255,${drop * 0.14})`
        ctx.fillRect(0, 0, w, h)
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
