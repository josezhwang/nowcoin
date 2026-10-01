import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { isLand, toVec } from '@/lib/geo'
import { isSoftwareRenderer, supportsWebGL } from '@/lib/webgl'
import { HUBS, ROUTES } from '@/three/globeData'

/** Pink → violet → blue across the sphere, like the reference. */
const PALETTE = [
  [255, 92, 214],
  [242, 98, 230],
  [214, 110, 245],
  [176, 122, 255],
  [138, 131, 255],
  [106, 124, 255],
  [79, 107, 255],
] as const
const LEVELS = [0.3, 0.55, 0.8, 1]
const TILT = 0.38

type Vec = [number, number, number]

function buildPoints() {
  const rings: number[] = []
  for (let lat = -78; lat <= 78; lat += 6) {
    const n = Math.max(10, Math.round(Math.cos((lat * Math.PI) / 180) * 96))
    for (let k = 0; k < n; k++) rings.push(...toVec(lat, (k / n) * 360 - 180))
  }
  const land: number[] = []
  const N = 9000
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const lat = (Math.asin(y) * 180) / Math.PI
    const lon = (((((golden * i * 180) / Math.PI) % 360) + 540) % 360) - 180
    if (lat > -60 && isLand(lat, lon)) land.push(...toVec(lat, lon))
  }
  return { rings: new Float32Array(rings), land: new Float32Array(land) }
}

/** Points along a lifted great-circle arc between two hubs. */
function arcPoints(a: Vec, b: Vec, steps = 28): Vec[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const ang = Math.acos(dot)
  const sin = Math.sin(ang) || 1
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const wa = Math.sin((1 - t) * ang) / sin
    const wb = Math.sin(t * ang) / sin
    const lift = 1 + Math.sin(Math.PI * t) * ang * 0.16
    return [(a[0] * wa + b[0] * wb) * lift, (a[1] * wa + b[1] * wb) * lift, (a[2] * wa + b[2] * wb) * lift]
  })
}

/**
 * A rotating, dotted planet: latitude rings plus continents, shaded pink →
 * blue, with settlement routes and travelling pulses. Canvas 2D — no WebGL —
 * so it runs everywhere. Drag to spin.
 */
export function DotSphere({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { rings, land } = buildPoints()
    const hubs = HUBS.map((h) => toVec(h.lat, h.lon))
    const arcs = ROUTES.map(([a, b]) => arcPoints(hubs[a]!, hubs[b]!))
    const lowPower = !supportsWebGL() || isSoftwareRenderer()
    const frameGap = lowPower ? 1000 / 30 : 0

    let w = 0
    let h = 0
    let dpr = 1
    let theta = 0.35
    let vel = 0
    let visible = true
    let frame = 0
    let last = 0
    let drag: { x: number } | null = null

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }

    const draw = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const r = Math.min(w * 0.46, h * 0.98, 640)
      const cx = w / 2
      const cy = h + r * 0.06
      const cosT = Math.cos(theta)
      const sinT = Math.sin(theta)
      const cosX = Math.cos(TILT)
      const sinX = Math.sin(TILT)

      const project = (x: number, y: number, z: number) => {
        const x1 = x * cosT + z * sinT
        const z1 = -x * sinT + z * cosT
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX
        return [cx + x1 * r, cy - y2 * r, z2] as const
      }

      // Bucket dots by colour and brightness so each bucket is one fill call.
      const buckets = new Map<number, Path2D>()
      const plot = (pts: Float32Array, size: number, kind: number) => {
        for (let i = 0; i < pts.length; i += 3) {
          const [sx, sy, z] = project(pts[i]!, pts[i + 1]!, pts[i + 2]!)
          if (z <= 0.02 || sy > h + 4) continue
          const col = Math.max(0, Math.min(6, Math.floor(((sx - cx + r) / (2 * r)) * 7)))
          const lvl = Math.min(3, Math.floor(z * 4))
          const key = kind * 100 + col * 10 + lvl
          let path = buckets.get(key)
          if (!path) buckets.set(key, (path = new Path2D()))
          path.rect(sx - size / 2, sy - size / 2, size, size)
        }
      }
      // Coloured body: pink from the left, blue from the right (as in the reference).
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()
      const pink = ctx.createRadialGradient(cx - r * 0.75, cy - r * 0.05, 0, cx - r * 0.75, cy - r * 0.05, r * 0.9)
      pink.addColorStop(0, 'rgba(255,80,210,0.55)')
      pink.addColorStop(1, 'rgba(255,80,210,0)')
      ctx.fillStyle = pink
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
      const blue = ctx.createRadialGradient(cx + r * 0.7, cy - r * 0.2, 0, cx + r * 0.7, cy - r * 0.2, r * 0.95)
      blue.addColorStop(0, 'rgba(70,90,255,0.6)')
      blue.addColorStop(1, 'rgba(70,90,255,0)')
      ctx.fillStyle = blue
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
      const core = ctx.createRadialGradient(cx, cy - r * 0.35, r * 0.1, cx, cy - r * 0.2, r * 0.75)
      core.addColorStop(0, 'rgba(6,5,14,0.92)')
      core.addColorStop(1, 'rgba(6,5,14,0)')
      ctx.fillStyle = core
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
      ctx.restore()

      plot(rings, 1.7, 0)
      plot(land, 2.4, 1)

      ctx.globalCompositeOperation = 'lighter'
      for (const [key, path] of buckets) {
        const kind = Math.floor(key / 100)
        const [cr, cg, cb] = PALETTE[Math.floor((key % 100) / 10)]!
        const a = LEVELS[key % 10]! * (kind ? 1 : 0.62)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`
        ctx.fill(path)
      }

      // Limb glow
      const limb = ctx.createLinearGradient(cx - r, 0, cx + r, 0)
      limb.addColorStop(0, 'rgba(255,92,214,0.55)')
      limb.addColorStop(0.5, 'rgba(176,122,255,0.35)')
      limb.addColorStop(1, 'rgba(79,107,255,0.55)')
      ctx.strokeStyle = limb
      ctx.lineWidth = 14
      ctx.globalAlpha = 0.18
      ctx.beginPath()
      ctx.arc(cx, cy, r + 4, Math.PI, 2 * Math.PI)
      ctx.stroke()
      ctx.globalAlpha = 0.7
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.globalAlpha = 1

      // Routes and pulses
      ctx.lineWidth = 1
      arcs.forEach((arc, k) => {
        ctx.beginPath()
        let pen = false
        for (const p of arc) {
          const [sx, sy, z] = project(p[0], p[1], p[2])
          if (z > 0) {
            if (pen) ctx.lineTo(sx, sy)
            else ctx.moveTo(sx, sy)
            pen = true
          } else pen = false
        }
        ctx.strokeStyle = 'rgba(232,224,255,0.28)'
        ctx.stroke()

        const t = (time / 1000) * 0.2 + k * 0.37
        const idx = Math.floor((t % 1) * (arc.length - 1))
        const p = arc[idx]!
        const [sx, sy, z] = project(p[0], p[1], p[2])
        if (z > 0) {
          ctx.fillStyle = 'rgba(200,180,255,0.35)'
          ctx.beginPath()
          ctx.arc(sx, sy, 5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Hub markers
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'
      for (const v of hubs) {
        const [sx, sy, z] = project(v[0] * 1.004, v[1] * 1.004, v[2] * 1.004)
        if (z <= 0.05) continue
        ctx.beginPath()
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (time: number) => {
      frame = 0
      if (!visible) return
      frame = requestAnimationFrame(loop)
      const dt = last ? Math.min(0.1, (time - last) / 1000) : 0
      if (frameGap && time - last < frameGap) return
      last = time
      if (!drag) {
        theta += (reduced ? 0 : 0.06) * dt + vel * dt
        vel *= 0.95
      }
      draw(time)
    }

    const start = () => {
      if (!frame && visible && !reduced) frame = requestAnimationFrame(loop)
    }

    resize()
    draw(0)
    start()

    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting
      if (visible) {
        last = 0
        start()
      }
    })
    io.observe(canvas)

    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX }
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      drag.x = e.clientX
      theta += dx * 0.005
      vel = dx * 0.3
      if (reduced) draw(performance.now())
    }
    const onUp = () => {
      drag = null
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className={`dot-sphere ${className}`} aria-hidden />
}
