import { ArrowLeftRight, Bitcoin, Code2, CreditCard, Landmark, ShieldCheck, Store, Wallet, Zap } from 'lucide-react'
import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { usePauseOffscreen } from '@/hooks/usePauseOffscreen'
import { Cube, type CubeSpec } from './Cube'
import {
  CUBE,
  FRONT_REGION,
  HOLE,
  PANEL,
  RADIUS,
  S,
  SLAB,
  STAGE_H,
  STAGE_W,
  TOP_FACE,
  TRACES,
  WELL,
  bbox,
  boxStyle,
  outline,
  planeMatrix,
  points,
  polyline,
  project,
  rand,
  roundedSquare,
  toPath,
} from './geometry'

const B = HOLE
const SQRT3_2 = Math.cos(Math.PI / 6)

// 3×3 grid, listed back-to-front (i + j ascending) so DOM order paints correctly.
const GRID: Omit<CubeSpec, 'delay' | 'lift'>[] = [
  { i: -1, j: -1, icon: Wallet, label: 'wallet()', iconSide: 'right' },
  { i: 0, j: -1, icon: Bitcoin, label: 'swap()', iconSide: 'right' },
  { i: -1, j: 0, icon: CreditCard, label: 'card.issue()', iconSide: 'left' },
  { i: 1, j: -1, icon: Store, label: 'pay()', iconSide: 'right' },
  { i: 0, j: 0, icon: Zap, label: 'settle()', iconSide: 'left', accent: true },
  { i: -1, j: 1, icon: Landmark, label: 'earn()', iconSide: 'left' },
  { i: 1, j: 0, icon: ShieldCheck, label: 'vault.sign()', iconSide: 'right' },
  { i: 0, j: 1, icon: ArrowLeftRight, label: 'bridge()', iconSide: 'left' },
  { i: 1, j: 1, icon: Code2, label: 'api.call()', iconSide: 'right' },
]

const CUBES: CubeSpec[] = GRID.map((c, k) => ({
  ...c,
  lift: 1.0 + rand(k + 3) * 0.55,
  // Spread across most of the 5.6s cycle so some cubes are always on the rise.
  delay: -((c.i + c.j + 2) / 4) * 4.4 - rand(k) * 0.5,
}))

const WALL_LAYERS = 16

/** Grid lines across the slab top, at every world unit. */
const GRID_LINES = Array.from({ length: 2 * PANEL - 1 }, (_, k) => k - PANEL + 1).flatMap((k) => [
  polyline([
    [k, -PANEL, 0],
    [k, PANEL, 0],
  ]),
  polyline([
    [-PANEL, k, 0],
    [PANEL, k, 0],
  ]),
])

/** LED strips running down the visible inner walls of the well. */
const WALL_LEDS = [-2, -1, 0, 1, 2].flatMap((k) => [
  polyline([
    [-B, k, -0.3],
    [-B, k, -WELL + 0.2],
  ]),
  polyline([
    [k, -B, -0.3],
    [k, -B, -WELL + 0.2],
  ]),
])

const backTraces = TRACES.filter((t) => !t.front)
const frontTraces = TRACES.filter((t) => t.front)

const [cx, cy] = project(0, 0, 0)

/** Hole rim: the two far edges (behind the cubes) and the two near edges (in front). */
const RIM_BACK = [project(-B, B, 0), project(-B, -B, 0), project(B, -B, 0)]
const RIM_FRONT = [project(-B, B, 0), project(B, B, 0), project(B, -B, 0)]
const RIM_BACK_BOX = bbox(RIM_BACK, 18)
const RIM_FRONT_BOX = bbox(RIM_FRONT, 18)

/** Path for the light runners circling the slab's outer edge. */
const EDGE_PATH = toPath(outline(PANEL, RADIUS, 0))

// Dust motes drifting up through the light: horizontal start (%), duration, delay, size, sway (px).
const MOTES = Array.from({ length: 18 }, (_, k) => ({
  left: 22 + rand(k + 40) * 56,
  dur: 7 + rand(k + 60) * 6,
  delay: -rand(k + 80) * 12,
  size: 1 + Math.round(rand(k + 90) * 1.5),
  sway: (rand(k + 100) - 0.5) * 40,
}))

// Soft light shafts escaping the well: angle (deg), width (px), drift delay (s).
// Wide and feathered on both sides so they read as volumetric light, not stripes.
const SHAFTS = [
  [-9, 230, 0],
  [3, 300, -5],
  [12, 200, -9],
] as const

/** Shared gradients, patterns and filters (also used by every cube's SVG). */
function Defs() {
  const stop = (offset: string, color: string, opacity?: number | string) => (
    <stop offset={offset} style={{ stopColor: color, stopOpacity: opacity }} />
  )
  const faceDots = (side: 'left' | 'right', id: string, r: number, color: string) => (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width="0.105"
      height="0.105"
      patternTransform={
        side === 'left'
          ? `matrix(${SQRT3_2 * S} ${0.5 * S} 0 ${S} ${(-CUBE / 2) * SQRT3_2 * S} ${(CUBE / 2) * 0.5 * S})`
          : `matrix(${SQRT3_2 * S} ${-0.5 * S} 0 ${S} ${(CUBE / 2) * SQRT3_2 * S} ${(CUBE / 2) * 0.5 * S})`
      }
    >
      <circle cx="0.052" cy="0.052" r={r} style={{ fill: color }} />
    </pattern>
  )
  return (
    <defs>
      <linearGradient id="vt-top" x1="0" y1="0" x2="1" y2="1">
        {stop('0', 'var(--vt-top-a)')}
        {stop('0.5', 'var(--vt-top-b)')}
        {stop('1', 'var(--vt-top-c)')}
      </linearGradient>
      {/* Walls: shaded on the left face, lit on the right face (world diagonal = screen x). */}
      <linearGradient id="vt-wall" gradientUnits="userSpaceOnUse" x1={-PANEL} y1={PANEL} x2={PANEL} y2={-PANEL}>
        {stop('0', 'var(--vt-wall-a)')}
        {stop('0.44', 'var(--vt-wall-b)')}
        {stop('0.56', 'var(--vt-wall-c)')}
        {stop('1', 'var(--vt-wall-d)')}
      </linearGradient>
      <linearGradient id="vt-well" x1="0" y1="0" x2="0" y2="1">
        {stop('0', 'var(--vt-well-a)')}
        {stop('1', 'var(--vt-well-b)')}
      </linearGradient>
      <radialGradient id="vt-floor" cx="0.5" cy="0.5" r="0.6">
        {stop('0', 'var(--vt-glow)', 0.8)}
        {stop('1', 'var(--vt-floor)')}
      </radialGradient>
      {/* Light from the well spilling onto the slab surface, falling off with distance. */}
      <radialGradient id="vt-spill" gradientUnits="userSpaceOnUse" cx="0" cy="0" r={PANEL * 0.95}>
        {stop('0.5', 'var(--vt-glow)', 'var(--vt-spill)')}
        {stop('0.75', 'var(--vt-glow)', 'calc(var(--vt-spill) * 0.35)')}
        {stop('1', 'var(--vt-glow)', 0)}
      </radialGradient>
      <radialGradient id="vt-under" cx="0.5" cy="0.5" r="0.5">
        {stop('0', 'var(--vt-glow)', 0.5)}
        {stop('1', 'var(--vt-glow)', 0)}
      </radialGradient>
      <clipPath id="vt-topclip">
        <path d={TOP_FACE} transform={planeMatrix(0)} clipRule="evenodd" />
      </clipPath>
      <clipPath id="vt-frontclip">
        <polygon points={FRONT_REGION} />
      </clipPath>
      <filter id="vt-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>

      {/* Cube materials (local coordinates are identical for every cube) */}
      <linearGradient id="vc-face-l" x1="0" y1="0" x2="0" y2="1">
        {stop('0', 'var(--vc-face-l-a)')}
        {stop('1', 'var(--vc-face-l-b)')}
      </linearGradient>
      <linearGradient id="vc-face-r" x1="0" y1="0" x2="0" y2="1">
        {stop('0', 'var(--vc-face-r-a)')}
        {stop('1', 'var(--vc-face-r-b)')}
      </linearGradient>
      <linearGradient id="vc-bleed" x1="0" y1="1" x2="0" y2="0">
        {stop('0', 'var(--vc-bleed)', 'var(--vc-bleed-strength)')}
        {stop('0.42', 'var(--vc-bleed)', 0.08)}
        {stop('1', 'var(--vc-bleed)', 0)}
      </linearGradient>
      <linearGradient id="vc-top" x1="0" y1="0" x2="1" y2="1">
        {stop('0', 'var(--vc-top-a)')}
        {stop('1', 'var(--vc-top-b)')}
      </linearGradient>
      <linearGradient id="vc-surge" x1="0" y1="1" x2="0" y2="0">
        {stop('0', 'var(--vc-surge)', 0.75)}
        {stop('0.6', 'var(--vc-bleed)', 0.18)}
        {stop('1', 'var(--vc-bleed)', 0)}
      </linearGradient>
      <radialGradient id="vc-badge" cx="0.35" cy="0.3" r="0.8">
        {stop('0', '#b59cff')}
        {stop('1', '#6a4bf0')}
      </radialGradient>
      {faceDots('left', 'vc-dots-left', 0.013, 'var(--vc-dots)')}
      {faceDots('right', 'vc-dots-right', 0.013, 'var(--vc-dots)')}
      {faceDots('left', 'vc-leds-left', 0.02, 'var(--vc-leds)')}
      {faceDots('right', 'vc-leds-right', 0.02, 'var(--vc-leds)')}
      <filter id="vc-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.8" />
      </filter>
    </defs>
  )
}

/** Everything behind the cubes: slab body, top surface and the well. */
function BackLayer() {
  const wallStep = SLAB / (WALL_LAYERS - 1)
  return (
    <svg className="v-layer" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
      <Defs />
      <ellipse
        cx={cx}
        cy={cy + PANEL * 0.5 * S + 50}
        rx={PANEL * 1.9 * S * 0.5}
        ry={PANEL * 0.5 * S * 0.75}
        fill="url(#vt-under)"
      />

      {/* Slab body: the outline stacked in thin layers reads as a solid, rounded extrusion */}
      {Array.from({ length: WALL_LAYERS }, (_, k) => (
        <path
          key={k}
          d={roundedSquare(PANEL, RADIUS)}
          transform={planeMatrix(-SLAB + k * wallStep)}
          fill="url(#vt-wall)"
        />
      ))}
      <path
        d={roundedSquare(PANEL, RADIUS)}
        transform={planeMatrix(-SLAB)}
        className="v-underline"
        vectorEffect="non-scaling-stroke"
        filter="url(#vt-glow)"
      />

      {/* Top surface */}
      <path d={TOP_FACE} transform={planeMatrix(0)} fillRule="evenodd" fill="url(#vt-top)" />
      <path d={TOP_FACE} transform={planeMatrix(0)} fillRule="evenodd" fill="url(#vt-spill)" />
      <g clipPath="url(#vt-topclip)" className="v-grid">
        {GRID_LINES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="v-traces">
        {TRACES.map((t) => (
          <path key={polyline(t.path)} d={polyline(t.path)} />
        ))}
      </g>
      <path
        d={roundedSquare(PANEL, RADIUS)}
        transform={planeMatrix(0)}
        className="v-rim"
        vectorEffect="non-scaling-stroke"
      />

      {/* The well: floor, the two inner walls that face us, LED strips */}
      <polygon
        points={points([
          [-B, -B, -WELL],
          [B, -B, -WELL],
          [B, B, -WELL],
          [-B, B, -WELL],
        ])}
        fill="url(#vt-floor)"
      />
      <polygon
        points={points([
          [-B, -B, 0],
          [-B, B, 0],
          [-B, B, -WELL],
          [-B, -B, -WELL],
        ])}
        fill="url(#vt-well)"
      />
      <polygon
        points={points([
          [-B, -B, 0],
          [B, -B, 0],
          [B, -B, -WELL],
          [-B, -B, -WELL],
        ])}
        fill="url(#vt-well)"
        opacity="0.85"
      />
      <g className="v-leds">
        {WALL_LEDS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path
        d={polyline([
          [-B, B, -WELL],
          [-B, -B, -WELL],
          [B, -B, -WELL],
        ])}
        className="v-floor-line"
      />
      <path d={toPath(RIM_BACK, false)} className="v-hole-rim" />
      {backTraces.map((t) => {
        const end = t.path[t.path.length - 1]!
        const [x, y] = project(end[0], end[1], 0)
        return <circle key={`${x}${y}`} cx={x} cy={y} r="2.8" className="v-node" />
      })}
    </svg>
  )
}

/** The slab surface in front of the hole, redrawn over the cubes so they sink behind it. */
function FrontLayer() {
  return (
    <svg className="v-layer" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
      <g clipPath="url(#vt-frontclip)">
        <path d={TOP_FACE} transform={planeMatrix(0)} fillRule="evenodd" fill="url(#vt-top)" />
        <path d={TOP_FACE} transform={planeMatrix(0)} fillRule="evenodd" fill="url(#vt-spill)" />
        <g clipPath="url(#vt-topclip)" className="v-grid">
          {GRID_LINES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g className="v-traces">
          {frontTraces.map((t) => (
            <path key={polyline(t.path)} d={polyline(t.path)} />
          ))}
        </g>
        <path
          d={roundedSquare(PANEL, RADIUS)}
          transform={planeMatrix(0)}
          className="v-rim is-front"
          vectorEffect="non-scaling-stroke"
        />
        {/* Engraved serial text on the two front strips */}
        <g transform={planeMatrix(0)} className="v-engrave">
          <text x={-1.9} y={4.05}>
            NOWCOIN · MPC VAULT · 01
          </text>
          <text transform="translate(4.05 1.9) rotate(-90)">SETTLEMENT LAYER · 24/7</text>
        </g>
      </g>
      <path d={toPath(RIM_FRONT, false)} className="v-hole-rim is-front" />
      {frontTraces.map((t) => {
        const end = t.path[t.path.length - 1]!
        const [x, y] = project(end[0], end[1], 0)
        return <circle key={`${x}${y}`} cx={x} cy={y} r="2.8" className="v-node" />
      })}
    </svg>
  )
}

/** Breathing neon glow along the hole rim, split so the far edges sit behind the cubes. */
function RimGlow({ front }: { front: boolean }) {
  const pts = front ? RIM_FRONT : RIM_BACK
  const box = front ? RIM_FRONT_BOX : RIM_BACK_BOX
  return (
    <svg
      className={`v-rimglow${front ? ' is-front' : ''}`}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      style={boxStyle(box)}
      aria-hidden
    >
      <path d={toPath(pts, false)} className="v-rimglow-wide" />
      <path d={toPath(pts, false)} className="v-rimglow-mid" />
    </svg>
  )
}

/**
 * Light pulses racing along the engraved traces towards the hole. Each trace
 * gets its own small SVG layer, so a frame only repaints a few hundred pixels.
 */
function Pulses({ front }: { front: boolean }) {
  const list = front ? frontTraces : backTraces
  return (
    <>
      {list.map((t, k) => {
        const d = polyline(t.path)
        const box = bbox(
          t.path.map(([u, v, h]) => project(u, v, h)),
          10,
        )
        const style = {
          ...boxStyle(box),
          '--dur': `${3.2 + rand(k + (front ? 7 : 1)) * 2.4}s`,
          '--delay': `${-rand(k + 13) * 4}s`,
        } as CSSProperties
        return (
          <svg key={d} className="v-pulse" viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} style={style} aria-hidden>
            <path d={d} pathLength={1} className="streak streak-glow" />
            <path d={d} pathLength={1} className="streak streak-core" />
          </svg>
        )
      })}
    </>
  )
}

/** Keeps the fixed-size stage (STAGE_W × STAGE_H) scaled to its container's width. */
function useFitScale(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) el.style.setProperty('--vs', String(entry.contentRect.width / STAGE_W))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
}

/**
 * Hero centrepiece: a rounded slab with a square hole, from which glowing
 * cubes rise and sink in a wave. Light shafts pour out of the well, pulses run
 * along engraved traces, a faint highlight travels the slab's edge and dust
 * drifts through the light. Plain SVG + CSS — no WebGL — so it renders everywhere.
 */
export function Vault() {
  const fitRef = useRef<HTMLDivElement>(null)
  usePauseOffscreen(fitRef)
  useFitScale(fitRef)

  const columnStyle = {
    left: `${((cx - 280) / STAGE_W) * 100}%`,
    width: `${(560 / STAGE_W) * 100}%`,
    top: `${((cy - 520) / STAGE_H) * 100}%`,
    height: `${(620 / STAGE_H) * 100}%`,
  }
  const raysStyle = {
    left: `${(cx / STAGE_W) * 100}%`,
    top: `${((cy + 30) / STAGE_H) * 100}%`,
  }

  return (
    <div className="vault-fit" ref={fitRef} aria-hidden>
      <div className="vault">
        <div className="v-underglow" />
        <BackLayer />
        <RimGlow front={false} />
        <div className="v-column" style={columnStyle} />
        <Pulses front={false} />
        {CUBES.map((c) => (
          <Cube key={`${c.i}.${c.j}`} spec={c} />
        ))}
        <div className="v-shafts" style={raysStyle}>
          {SHAFTS.map(([angle, width, delay], k) => (
            <i key={k} style={{ '--angle': `${angle}deg`, width, animationDelay: `${delay}s` } as CSSProperties} />
          ))}
        </div>
        <div className="v-motes" style={columnStyle}>
          {MOTES.map((m, k) => (
            <i
              key={k}
              style={
                {
                  left: `${m.left}%`,
                  width: m.size,
                  height: m.size,
                  '--sway': `${m.sway}px`,
                  animationDuration: `${m.dur}s`,
                  animationDelay: `${m.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <FrontLayer />
        <RimGlow front />
        <Pulses front />
        <span className="v-runner" style={{ offsetPath: `path('${EDGE_PATH}')` }} />
      </div>
    </div>
  )
}
