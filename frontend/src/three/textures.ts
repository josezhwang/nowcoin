import * as THREE from 'three'

// All 3D surfaces are painted procedurally on canvases, so the site ships no
// image or model assets and every card tier can be recoloured at runtime.

const CARD_W = 1024
const CARD_H = Math.round(CARD_W / 1.586) // ISO/IEC 7810 ID-1 ratio

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function toTexture(canvas: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 128
  const h = 96
  const g = ctx.createLinearGradient(x, y, x + w, y + h)
  g.addColorStop(0, '#f6e7b0')
  g.addColorStop(0.5, '#c9a55a')
  g.addColorStop(1, '#f3dc9a')
  roundedRect(ctx, x, y, w, h, 16)
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(90, 60, 10, 0.55)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y + h / 3)
  ctx.lineTo(x + w * 0.35, y + h / 3)
  ctx.moveTo(x, y + (h * 2) / 3)
  ctx.lineTo(x + w * 0.35, y + (h * 2) / 3)
  ctx.moveTo(x + w, y + h / 3)
  ctx.lineTo(x + w * 0.65, y + h / 3)
  ctx.moveTo(x + w, y + (h * 2) / 3)
  ctx.lineTo(x + w * 0.65, y + (h * 2) / 3)
  ctx.moveTo(x + w * 0.35, y)
  ctx.lineTo(x + w * 0.35, y + h)
  ctx.moveTo(x + w * 0.65, y)
  ctx.lineTo(x + w * 0.65, y + h)
  ctx.stroke()
}

function drawContactless(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.arc(x, y, 14 + i * 14, -Math.PI / 4, Math.PI / 4)
    ctx.stroke()
  }
}

function paintBase(ctx: CanvasRenderingContext2D, colors: [string, string]) {
  roundedRect(ctx, 0, 0, CARD_W, CARD_H, 56)
  ctx.save()
  ctx.clip()

  const g = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
  g.addColorStop(0, colors[0])
  g.addColorStop(1, colors[1])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  // Holographic contour lines.
  ctx.globalAlpha = 0.16
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 26; i++) {
    ctx.beginPath()
    for (let x = 0; x <= CARD_W; x += 16) {
      const y = CARD_H * 0.15 + i * 22 + Math.sin(x / 120 + i * 0.35) * 40 + Math.cos(x / 260) * 30
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Soft specular sweep.
  ctx.globalAlpha = 1
  const sheen = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
  sheen.addColorStop(0.2, 'rgba(255,255,255,0)')
  sheen.addColorStop(0.45, 'rgba(255,255,255,0.18)')
  sheen.addColorStop(0.6, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.restore()
}

export function createCardFront(colors: [string, string], tierName: string) {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')!
  paintBase(ctx, colors)

  const ink = 'rgba(255,255,255,0.94)'
  ctx.fillStyle = ink
  ctx.font = '600 44px Unbounded, sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Nowcoin Digital', 64, 108)

  ctx.font = '500 24px "JetBrains Mono", monospace'
  ctx.globalAlpha = 0.75
  ctx.textAlign = 'right'
  ctx.fillText(tierName.toUpperCase(), CARD_W - 64, 100)
  ctx.textAlign = 'left'
  ctx.globalAlpha = 1

  drawChip(ctx, 72, 238)
  drawContactless(ctx, 250, 286, 'rgba(255,255,255,0.8)')

  ctx.font = '500 40px "JetBrains Mono", monospace'
  ctx.fillText('4291  ••••  ••••  2049', 72, 470)

  ctx.font = '500 22px "JetBrains Mono", monospace'
  ctx.globalAlpha = 0.7
  ctx.fillText('CARDHOLDER', 72, 540)
  ctx.fillText('VALID THRU', 440, 540)
  ctx.globalAlpha = 1
  ctx.font = '500 28px "JetBrains Mono", monospace'
  ctx.fillText('SATOSHI NAKAMOTO', 72, 580)
  ctx.fillText('09/31', 440, 580)

  ctx.font = '700 40px Unbounded, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('NOWCOIN', CARD_W - 64, 580)

  return toTexture(canvas)
}

export function createCardBack(colors: [string, string]) {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')!
  paintBase(ctx, [colors[1], colors[0]])

  ctx.fillStyle = 'rgba(5,5,10,0.85)'
  ctx.fillRect(0, 80, CARD_W, 110)

  roundedRect(ctx, 64, 250, 620, 80, 10)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fill()
  ctx.fillStyle = '#1a1a24'
  ctx.font = '500 30px "JetBrains Mono", monospace'
  ctx.fillText('•••', 610, 302)

  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '500 20px "JetBrains Mono", monospace'
  ctx.fillText('Issued by Nowcoin Digital. Spend responsibly.', 64, 420)
  ctx.fillText('support@nowcoin.digital', 64, 456)

  return toTexture(canvas)
}

export function createCoinFace(symbol: string, colors: [string, string]) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2

  const g = ctx.createRadialGradient(c * 0.7, c * 0.6, 20, c, c, c)
  g.addColorStop(0, colors[0])
  g.addColorStop(1, colors[1])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(c, c, c - 40, 0, Math.PI * 2)
  ctx.stroke()

  ctx.setLineDash([4, 14])
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(c, c, c - 70, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = `700 ${symbol.length > 1 ? 120 : 220}px Unbounded, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(symbol, c, c + 12)

  return toTexture(canvas)
}

// Coins appear many times (hero, background, coin rain) so faces are shared.
const coinCache = new Map<string, THREE.CanvasTexture>()

export function getCoinFace(symbol: string, colors: [string, string]) {
  const key = `${symbol}|${colors.join('|')}`
  let tex = coinCache.get(key)
  if (!tex) {
    tex = createCoinFace(symbol, colors)
    coinCache.set(key, tex)
  }
  return tex
}
