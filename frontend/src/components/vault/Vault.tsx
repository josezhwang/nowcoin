import { ArrowLeftRight, Bitcoin, Code2, CreditCard, Landmark, ShieldCheck, Store, Wallet, Zap } from 'lucide-react'
import { useRef, type CSSProperties } from 'react'
import { usePauseOffscreen } from '@/hooks/usePauseOffscreen'
import { Cube, type CubeSpec } from './Cube'
import {
  CUBE,
  FRONT_REGION,
  HOLE,
  PANEL,
  RADIUS,
  SLAB,
  STAGE_H,
  STAGE_W,
  TOP_FACE,
  TRACES,
  WELL,
  bbox,
  boltPath,
  boxStyle,
  planeMatrix,
  points,
  polyline,
  project,
  rand,
  roundedSquare,
  S,
} from './geometry'

const B = HOLE
const SQRT3_2 = Math.cos(Math.PI / 6)

// 3×3 grid, listed back-to-front (i + j ascending) so DOM order paints correctly.
// Delays follow i + j, so the rise travels across the grid as a diagonal wave.
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
  lift: 0.95 + rand(k + 3) * 0.55,
  // Spread across most of the 5.6s cycle so some cubes are always on the rise.
  delay: -((c.i + c.j + 2) / 4) * 4.4 - rand(k) * 0.5,
}))

const WALL_LAYERS = 14

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
const WALL_LEDS = [-1.5, -0.5, 0.5, 1.5].flatMap((k) => [
  polyline([
    [-B, k, -0.25],
    [-B, k, -WELL + 0.15],
  ]),
  polyline([
    [k, -B, -0.25],
    [k, -B, -WELL + 0.15],
  ]),
])

const backTraces = TRACES.filter((t) => !t.front)
const frontTraces = TRACES.filter((t) => t.front)

const [cx, cy] = project(0, 0, 0)

const BOLTS = [
  { a: project(-B, 0.5, 0), b: project(-0.2, 0, 2.3), seed: 11, dur: 5.3, delay: -1.2 },
  { a: project(0.6, -B, 0), b: project(0.15, -0.2, 2.5), seed: 23, dur: 6.8, delay: -3.9 },
  { a: project(-B, -B, 0), b: project(-0.7, -0.6, 1.9), seed: 37, dur: 7.6, delay: -5.4 },
  { a: project(B, 0.3, 0), b: project(0.5, 0.6, 1.8), seed: 51, dur: 8.9, delay: -2.6 },
].map((bolt) => ({ ...bolt, d: boltPath(bolt.a, bolt.b, bolt.seed), box: bbox([bolt.a, bolt.b], 40) }))

const PARTICLES = Array.from({ length: 12 }, (_, k) => ({
  left: 18 + rand(k + 40) * 64,
  dur: 3.6 + rand(k + 60) * 3,
  delay: -rand(k + 80) * 6,
  size: 2 + Math.round(rand(k + 90) * 2),
}))

/** Shared gradients, patterns and filters (also used by every cube's SVG). */
function Defs() {
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
      <circle cx="0.052" cy="0.052" r={r} fill={color} />
    </pattern>
  )
  return (
    <defs>
      <linearGradient id="vt-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1d1a38" />
        <stop offset="0.5" stopColor="#121024" />
        <stop offset="1" stopColor="#0a0915" />
      </linearGradient>
      {/* Walls: darker on the left face, lit on the right face (world-space diagonal = screen x). */}
      <linearGradient id="vt-wall" gradientUnits="userSpaceOnUse" x1={-PANEL} y1={PANEL} x2={PANEL} y2={-PANEL}>
        <stop offset="0" stopColor="#0b0a15" />
        <stop offset="0.44" stopColor="#100e1e" />
        <stop offset="0.56" stopColor="#25223f" />
        <stop offset="1" stopColor="#1a1830" />
      </linearGradient>
      <linearGradient id="vt-well" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0c0a18" />
        <stop offset="1" stopColor="#2b1f6b" />
      </linearGradient>
      <radialGradient id="vt-floor" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#7c5cff" stopOpacity="0.75" />
        <stop offset="1" stopColor="#120e2a" stopOpacity="1" />
      </radialGradient>
      <radialGradient id="vt-under" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#7c5cff" stopOpacity="0.5" />
        <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
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
      <filter id="vt-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>

      {/* Cube materials (local coordinates are identical for every cube) */}
      <linearGradient id="vc-face-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#161329" />
        <stop offset="1" stopColor="#0c0a17" />
      </linearGradient>
      <linearGradient id="vc-face-r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d1a35" />
        <stop offset="1" stopColor="#100e1e" />
      </linearGradient>
      <linearGradient id="vc-bleed" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#ab92ff" stopOpacity="0.62" />
        <stop offset="0.42" stopColor="#ab92ff" stopOpacity="0.08" />
        <stop offset="1" stopColor="#ab92ff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="vc-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#24213d" />
        <stop offset="1" stopColor="#13111f" />
      </linearGradient>
      <linearGradient id="vc-surge" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#d9ccff" stopOpacity="0.75" />
        <stop offset="0.6" stopColor="#a58bff" stopOpacity="0.18" />
        <stop offset="1" stopColor="#a58bff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="vc-badge" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#b59cff" />
        <stop offset="1" stopColor="#6a4bf0" />
      </radialGradient>
      {faceDots('left', 'vc-dots-left', 0.013, 'rgba(255,255,255,0.26)')}
      {faceDots('right', 'vc-dots-right', 0.013, 'rgba(255,255,255,0.26)')}
      {faceDots('left', 'vc-leds-left', 0.02, '#e4dbff')}
      {faceDots('right', 'vc-leds-right', 0.02, '#e4dbff')}
      <filter id="vc-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.6" />
      </filter>
    </defs>
  )
}

/** Everything behind the cubes: slab body, top surface, the well and its glow. */
function BackLayer() {
  const wallStep = SLAB / (WALL_LAYERS - 1)
  return (
    <svg className="v-layer" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} aria-hidden>
      <Defs />
      {/* Violet underglow beneath the slab */}
      <ellipse
        cx={cx}
        cy={cy + PANEL * 0.5 * S + 40}
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
        fill="none"
        stroke="#8f74ff"
        strokeOpacity="0.55"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        filter="url(#vt-glow)"
      />

      {/* Top surface */}
      <path d={TOP_FACE} transform={planeMatrix(0)} fillRule="evenodd" fill="url(#vt-top)" />
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

      {/* Back rim of the hole */}
      <path
        d={polyline([
          [-B, B, 0],
          [-B, -B, 0],
          [B, -B, 0],
        ])}
        className="v-hole-rim glow"
        filter="url(#vt-glow)"
      />
      <path
        d={polyline([
          [-B, B, 0],
          [-B, -B, 0],
          [B, -B, 0],
        ])}
        className="v-hole-rim"
      />
      {backTraces.map((t) => {
        const end = t.path[t.path.length - 1]!
        const [x, y] = project(end[0], end[1], 0)
        return <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" className="v-node" />
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
          <text x={-1.9} y={3.75}>
            NOWCOIN · MPC VAULT · 01
          </text>
          <text transform="translate(3.75 1.9) rotate(-90)">SETTLEMENT LAYER · 24/7</text>
        </g>
      </g>
      <path
        d={polyline([
          [-B, B, 0],
          [B, B, 0],
          [B, -B, 0],
        ])}
        className="v-hole-rim glow"
        filter="url(#vt-glow)"
      />
      <path
        d={polyline([
          [-B, B, 0],
          [B, B, 0],
          [B, -B, 0],
        ])}
        className="v-hole-rim is-front"
      />
      {frontTraces.map((t) => {
        const end = t.path[t.path.length - 1]!
        const [x, y] = project(end[0], end[1], 0)
        return <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" className="v-node" />
      })}
    </svg>
  )
}

/**
 * Light pulses racing along the engraved traces towards the hole. Each trace
 * gets its own small SVG so a frame only repaints a few hundred pixels.
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

/**
 * Hero centrepiece: a rounded slab with a square hole, from which glowing
 * cubes rise and sink in a wave. Light pulses run along engraved traces,
 * a laser sweeps each cube, and lightning crackles above the well.
 */
export function Vault() {
  const ref = useRef<HTMLDivElement>(null)
  usePauseOffscreen(ref)

  const columnStyle = {
    left: `${((cx - 250) / STAGE_W) * 100}%`,
    width: `${(500 / STAGE_W) * 100}%`,
    top: `${((cy - 470) / STAGE_H) * 100}%`,
    height: `${(560 / STAGE_H) * 100}%`,
  }

  return (
    <div className="vault" ref={ref} aria-hidden>
      <BackLayer />
      <div className="v-column" style={columnStyle}>
        {PARTICLES.map((p, k) => (
          <i
            key={k}
            style={
              {
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <Pulses front={false} />
      {CUBES.map((c) => (
        <Cube key={`${c.i}.${c.j}`} spec={c} />
      ))}
      <FrontLayer />
      <Pulses front />
      {BOLTS.map((b, k) => (
        <svg
          key={k}
          className="v-bolt"
          viewBox={`${b.box.x} ${b.box.y} ${b.box.w} ${b.box.h}`}
          style={{ ...boxStyle(b.box), '--dur': `${b.dur}s`, '--delay': `${b.delay}s` } as CSSProperties}
          aria-hidden
        >
          <path d={b.d} className="bolt-glow" />
          <path d={b.d} className="bolt-core" />
        </svg>
      ))}
    </div>
  )
}
