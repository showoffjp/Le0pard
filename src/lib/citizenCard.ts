import type { Citizen } from './citizen'
import type { FactionGlow } from '../data/factions'

export const CARD_W = 1080
export const CARD_H = 1350

const GLOW: Record<FactionGlow, [string, string]> = {
  purple: ['#a855f7', '#7c5cff'],
  blue: ['#3b82f6', '#6366f1'],
  cyan: ['#22d3ee', '#3b82f6'],
  ember: ['#ff6a00', '#ff2d00'],
}

function hexA(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}

function octagon(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: number) {
  ctx.beginPath()
  ctx.moveTo(x + c, y)
  ctx.lineTo(x + w - c, y)
  ctx.lineTo(x + w, y + c)
  ctx.lineTo(x + w, y + h - c)
  ctx.lineTo(x + w - c, y + h)
  ctx.lineTo(x + c, y + h)
  ctx.lineTo(x, y + h - c)
  ctx.lineTo(x, y + c)
  ctx.closePath()
}

/** Render the shareable "DYSTØPIA Citizen ID" card onto a canvas. */
export async function drawCitizenCard(canvas: HTMLCanvasElement, c: Citizen): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('900 120px Orbitron'),
      document.fonts.load('800 30px Orbitron'),
      document.fonts.load('600 34px Rajdhani'),
    ])
  } catch {
    /* fall back to system fonts */
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = CARD_W
  canvas.height = CARD_H
  const [a, b] = GLOW[c.faction.glow]
  const cx = CARD_W / 2

  // ── background ──
  ctx.fillStyle = '#04050a'
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  const glow = ctx.createRadialGradient(cx, 320, 0, cx, 320, 760)
  glow.addColorStop(0, hexA(a, 0.24))
  glow.addColorStop(1, hexA(a, 0))
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  // hud grid
  ctx.strokeStyle = hexA(a, 0.06)
  ctx.lineWidth = 1
  for (let x = 0; x <= CARD_W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CARD_H); ctx.stroke()
  }
  for (let y = 0; y <= CARD_H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CARD_W, y); ctx.stroke()
  }
  // bottom vignette
  const vig = ctx.createLinearGradient(0, CARD_H - 560, 0, CARD_H)
  vig.addColorStop(0, 'rgba(4,5,10,0)')
  vig.addColorStop(1, 'rgba(4,5,10,0.85)')
  ctx.fillStyle = vig
  ctx.fillRect(0, CARD_H - 560, CARD_W, 560)

  // ── neon octagon frame ──
  const m = 54
  ctx.save()
  ctx.shadowColor = a
  ctx.shadowBlur = 34
  ctx.strokeStyle = a
  ctx.lineWidth = 4
  octagon(ctx, m, m, CARD_W - 2 * m, CARD_H - 2 * m, 42)
  ctx.stroke()
  ctx.restore()
  ctx.strokeStyle = hexA(b, 0.4)
  ctx.lineWidth = 2
  octagon(ctx, m + 14, m + 14, CARD_W - 2 * (m + 14), CARD_H - 2 * (m + 14), 32)
  ctx.stroke()

  // ── header row ──
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#e6e9f2'
  ctx.font = "800 28px Orbitron, Arial, sans-serif"
  ctx.fillText('LEOPARDØ', 110, 150)
  ctx.textAlign = 'right'
  ctx.fillStyle = hexA(a, 0.85)
  ctx.font = "600 24px Rajdhani, monospace"
  ctx.fillText('EST. 2026', CARD_W - 110, 150)

  // ── DYSTØPIA wordmark ──
  ctx.textAlign = 'center'
  const grad = ctx.createLinearGradient(cx - 300, 0, cx + 300, 0)
  grad.addColorStop(0, '#22d3ee')
  grad.addColorStop(0.5, '#7c5cff')
  grad.addColorStop(1, '#a855f7')
  ctx.save()
  ctx.shadowColor = hexA(b, 0.6)
  ctx.shadowBlur = 24
  ctx.fillStyle = grad
  ctx.font = "900 96px Orbitron, Arial, sans-serif"
  ctx.fillText('DYSTØPIA', cx, 300)
  ctx.restore()
  ctx.fillStyle = '#8b93a7'
  ctx.font = "600 26px Rajdhani, monospace"
  ctx.fillText('—  CITIZEN  REGISTRATION  —', cx, 348)

  // ── faction sigil (octagon + Ø) ──
  const sy = 500
  ctx.save()
  ctx.shadowColor = a
  ctx.shadowBlur = 30
  ctx.strokeStyle = a
  ctx.lineWidth = 5
  octagon(ctx, cx - 95, sy - 95, 190, 190, 34)
  ctx.stroke()
  ctx.fillStyle = a
  ctx.font = "900 130px Orbitron, Arial, sans-serif"
  ctx.textBaseline = 'middle'
  ctx.fillText('Ø', cx, sy + 6)
  ctx.restore()
  ctx.textBaseline = 'alphabetic'

  // ── handle ──
  let size = 110
  ctx.font = `900 ${size}px Orbitron, Arial, sans-serif`
  while (ctx.measureText(c.handle).width > CARD_W - 220 && size > 40) {
    size -= 4
    ctx.font = `900 ${size}px Orbitron, Arial, sans-serif`
  }
  ctx.fillStyle = '#ffffff'
  ctx.save()
  ctx.shadowColor = hexA(a, 0.5)
  ctx.shadowBlur = 18
  ctx.fillText(c.handle, cx, 760)
  ctx.restore()

  // ── faction + motto ──
  ctx.save()
  ctx.shadowColor = a
  ctx.shadowBlur = 22
  ctx.fillStyle = a
  ctx.font = "800 46px Orbitron, Arial, sans-serif"
  ctx.fillText(c.faction.name, cx, 836)
  ctx.restore()
  ctx.fillStyle = '#9aa3b2'
  ctx.font = "600 30px Rajdhani, sans-serif"
  ctx.fillText(c.faction.motto, cx, 884)

  // ── stats grid ──
  const stats: [string, string][] = [
    ['REG. ID', c.id],
    ['CLEARANCE', c.clearance],
    ['RANK', c.rank],
    ['SECTOR', c.faction.sector],
  ]
  const gy = 1000
  const colX = [cx - 230, cx + 230]
  stats.forEach(([label, value], i) => {
    const x = colX[i % 2]
    const y = gy + Math.floor(i / 2) * 110
    ctx.textAlign = 'center'
    ctx.fillStyle = '#6b7280'
    ctx.font = "600 20px Rajdhani, monospace"
    ctx.fillText(label, x, y)
    ctx.fillStyle = '#e6e9f2'
    ctx.font = "700 38px Orbitron, Arial, sans-serif"
    ctx.fillText(value, x, y + 44)
  })

  // ── barcode + footer ──
  let bx = cx - 230
  for (let i = 0; i < 46; i++) {
    const w = (i % 3 ? 2 : 5)
    ctx.fillStyle = i % 4 === 0 ? a : '#cbd2e0'
    ctx.fillRect(bx, 1230, w, 40)
    bx += w + 4
  }
  ctx.textAlign = 'center'
  ctx.fillStyle = '#8b93a7'
  ctx.font = "600 24px Rajdhani, monospace"
  ctx.fillText('ENTER THE WORLD  ·  LEOPARDØMUSIC', cx, 1316)

  // scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.10)'
  for (let y = 0; y < CARD_H; y += 4) ctx.fillRect(0, y, CARD_W, 1)
}
