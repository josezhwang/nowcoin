import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import {
  CUBE,
  S,
  STAGE_H,
  STAGE_W,
  faceMatrix,
  local,
  localPlaneMatrix,
  points,
  polyline,
  project,
  WELL,
  type P3,
} from './geometry'

/** Each cube is drawn in its own SVG, in this local box around its base centre. */
const BOX = { x: -86, y: -138, w: 172, h: 202 }
const A = CUBE / 2

export interface CubeSpec {
  i: number
  j: number
  icon: LucideIcon
  label: string
  /** Which side face carries the icon (the other gets the dot matrix). */
  iconSide: 'left' | 'right'
  /** Rise height in world units and the wave delay (s). */
  lift: number
  delay: number
  /** The hero cube: a glowing badge on its second face. */
  accent?: boolean
}

const leftFace: P3[] = [
  [-A, A, 0],
  [A, A, 0],
  [A, A, CUBE],
  [-A, A, CUBE],
]
const rightFace: P3[] = [
  [A, -A, 0],
  [A, A, 0],
  [A, A, CUBE],
  [A, -A, CUBE],
]
const topFace: P3[] = [
  [-A, -A, CUBE],
  [A, -A, CUBE],
  [A, A, CUBE],
  [-A, A, CUBE],
]

/** Neon edges: the three vertical edges and the two lower front edges. */
const EDGES = [
  polyline(
    [
      [A, -A, 0],
      [A, -A, CUBE],
    ],
    local,
  ),
  polyline(
    [
      [A, A, 0],
      [A, A, CUBE],
    ],
    local,
  ),
  polyline(
    [
      [-A, A, 0],
      [-A, A, CUBE],
    ],
    local,
  ),
  polyline(
    [
      [-A, A, 0],
      [A, A, 0],
      [A, -A, 0],
    ],
    local,
  ),
].join(' ')
const TOP_FRONT_EDGES = polyline(
  [
    [-A, A, CUBE],
    [A, A, CUBE],
    [A, -A, CUBE],
  ],
  local,
)
const TOP_BACK_EDGES = polyline(
  [
    [-A, A, CUBE],
    [-A, -A, CUBE],
    [A, -A, CUBE],
  ],
  local,
)

/** Face-plane point (s along the face, t downward from the base) → local pixels. */
function onFace(side: 'left' | 'right', s: number, t: number): [number, number] {
  return side === 'left'
    ? [(s - A) * Math.cos(Math.PI / 6) * S, (s + A) * 0.5 * S + t * S]
    : [(s + A) * Math.cos(Math.PI / 6) * S, (A - s) * 0.5 * S + t * S]
}

const facePoly = (side: 'left' | 'right', s0: number, s1: number, t0: number, t1: number) =>
  [onFace(side, s0, t0), onFace(side, s1, t0), onFace(side, s1, t1), onFace(side, s0, t1)]
    .map((p) => p.map((n) => n.toFixed(1)).join(','))
    .join(' ')

/**
 * A glowing cube standing on the well floor. It rises and sinks with a CSS
 * animation on `translate` (compositor-only), so its SVG is drawn just once.
 */
export function Cube({ spec }: { spec: CubeSpec }) {
  const { i, j, icon: Icon, label, iconSide, lift, delay, accent } = spec
  const dotSide = iconSide === 'left' ? 'right' : 'left'
  const [x, y] = project(i * 1.45, j * 1.45, -WELL)

  const style = {
    left: `${((x + BOX.x) / STAGE_W) * 100}%`,
    top: `${((y + BOX.y) / STAGE_H) * 100}%`,
    width: `${(BOX.w / STAGE_W) * 100}%`,
    height: `${(BOX.h / STAGE_H) * 100}%`,
    '--lift': `${-((lift * S) / BOX.h) * 100}%`,
    '--delay': `${delay}s`,
  } as CSSProperties

  return (
    <div className="v-cube" style={style}>
      <svg viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`} aria-hidden>
        <polygon points={points(leftFace, local)} fill="url(#vc-face-l)" />
        <polygon points={points(rightFace, local)} fill="url(#vc-face-r)" />
        <polygon points={points(leftFace, local)} fill="url(#vc-bleed)" />
        <polygon points={points(rightFace, local)} fill="url(#vc-bleed)" />

        {/* Dot-matrix "server" panel with a few lit LEDs */}
        <polygon
          points={facePoly(dotSide, -A + 0.1, A - 0.12, -CUBE + 0.12, -0.14)}
          fill={`url(#vc-dots-${dotSide})`}
        />
        <polygon points={facePoly(dotSide, A - 0.42, A - 0.14, -0.5, -0.18)} fill={`url(#vc-leds-${dotSide})`} />

        <polygon points={points(topFace, local)} fill="url(#vc-top)" />
        <g transform={localPlaneMatrix(CUBE)}>
          <text x={-A + 0.1} y={-A + 0.26} className="v-cube-label">
            {label}
          </text>
        </g>

        <g transform={faceMatrix[iconSide](A)} className="v-cube-icon">
          <Icon x={-0.25} y={-CUBE / 2 - 0.25} width={0.5} height={0.5} strokeWidth={1.7} color="#fff" />
        </g>
        {accent && (
          <g transform={faceMatrix[dotSide](A)}>
            <circle cx={0.18} cy={-CUBE / 2} r={0.21} fill="url(#vc-badge)" className="v-cube-badge" />
            <svg x={0.05} y={-CUBE / 2 - 0.13} width={0.26} height={0.26} viewBox="0 0 24 24">
              <path
                d="M6.5 18V6l11 12V6"
                fill="none"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </g>
        )}

        <path d={TOP_BACK_EDGES} className="v-edge-dim" />
        <path d={EDGES} className="v-edge-glow" filter="url(#vc-glow)" />
        <path d={TOP_FRONT_EDGES} className="v-edge-glow is-soft" filter="url(#vc-glow)" />
        <path d={EDGES} className="v-edge-core" />
        <path d={TOP_FRONT_EDGES} className="v-edge-core is-soft" />
      </svg>
      {/* Energy surge: brighter faces and edges that flare as the cube peaks (opacity only). */}
      <svg className="v-charge" viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`} aria-hidden>
        <polygon points={points(leftFace, local)} fill="url(#vc-surge)" />
        <polygon points={points(rightFace, local)} fill="url(#vc-surge)" />
        <path d={EDGES} className="v-edge-surge" />
      </svg>
    </div>
  )
}
