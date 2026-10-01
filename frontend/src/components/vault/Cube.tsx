import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import {
  CUBE,
  PITCH,
  S,
  STAGE_H,
  STAGE_W,
  WELL,
  faceMatrix,
  local,
  localPlaneMatrix,
  points,
  polyline,
  project,
  type P3,
} from './geometry'

/** Each cube is drawn in its own SVG, in this local box around its base centre. */
const BOX = { x: -114, y: -184, w: 228, h: 266 }
const A = CUBE / 2
const COS = Math.cos(Math.PI / 6)

/** Screen size of one side face, and how far the front edge sits below the side corners. */
const FACE_W = 2 * A * COS * S
const FACE_H = CUBE * S
const DROP = A * S

/** Local cube pixels → CSS position inside the .v-cube box. */
const at = (x: number, y: number) => ({ left: x - BOX.x, top: y - BOX.y })

/** Sparks thrown off the top face at the peak: [u, v, sideways drift px]. */
const SPARKS: [number, number, number][] = [
  [-0.38, 0.12, -9],
  [0.08, -0.42, 2],
  [0.4, 0.3, 10],
  [-0.05, 0.4, -3],
]

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
    ? [(s - A) * COS * S, (s + A) * 0.5 * S + t * S]
    : [(s + A) * COS * S, (A - s) * 0.5 * S + t * S]
}

/** A free quad on the right face, from (s, t) face-plane points. */
const quad = (pts: [number, number][]) =>
  pts
    .map(([s, t]) =>
      onFace('right', s, t)
        .map((n) => n.toFixed(1))
        .join(','),
    )
    .join(' ')

const facePoly = (side: 'left' | 'right', s0: number, s1: number, t0: number, t1: number) =>
  [onFace(side, s0, t0), onFace(side, s1, t0), onFace(side, s1, t1), onFace(side, s0, t1)]
    .map((p) => p.map((n) => n.toFixed(1)).join(','))
    .join(' ')

/**
 * A glowing cube standing on the well floor. It rises and sinks with a CSS
 * animation on `translate` (compositor-only), so its SVG is drawn just once.
 * Colours come from CSS variables, so it has a dark and a light look.
 */
export function Cube({ spec }: { spec: CubeSpec }) {
  const { i, j, icon: Icon, label, iconSide, lift, delay, accent } = spec
  const dotSide = iconSide === 'left' ? 'right' : 'left'
  const [x, y] = project(i * PITCH, j * PITCH, -WELL)

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

        {/* Glass sheen: two diagonal reflections across the lit right face, under the icons. */}
        <polygon
          points={quad([
            [-A, -1.5],
            [-A, -1.12],
            [A, -0.18],
            [A, -0.56],
          ])}
          className="v-cube-sheen"
        />
        <polygon
          points={quad([
            [-A, -0.98],
            [-A, -0.88],
            [A, -0.02],
            [A, -0.12],
          ])}
          className="v-cube-sheen"
        />

        {/* Dot-matrix "server" panel with a few lit LEDs */}
        <polygon
          points={facePoly(dotSide, -A + 0.12, A - 0.14, -CUBE + 0.14, -0.16)}
          fill={`url(#vc-dots-${dotSide})`}
        />
        <polygon points={facePoly(dotSide, A - 0.5, A - 0.16, -0.6, -0.2)} fill={`url(#vc-leds-${dotSide})`} />

        <polygon points={points(topFace, local)} fill="url(#vc-top)" />
        {/* Top face as a lit tile: a glowing inset trim around a soft emissive centre. */}
        <g transform={localPlaneMatrix(CUBE)}>
          <rect
            x={-A + 0.13}
            y={-A + 0.13}
            width={CUBE - 0.26}
            height={CUBE - 0.26}
            rx={0.1}
            fill="url(#vc-top-glow)"
            className="v-cube-trim"
          />
          <text x={-A + 0.25} y={-A + 0.4} className="v-cube-label">
            {label}
          </text>
        </g>

        <g transform={faceMatrix[iconSide](A)} className="v-cube-icon">
          <Icon x={-0.32} y={-CUBE / 2 - 0.32} width={0.64} height={0.64} strokeWidth={1.6} />
        </g>
        {accent && (
          <g transform={faceMatrix[dotSide](A)}>
            <circle cx={0.22} cy={-CUBE / 2} r={0.27} fill="url(#vc-badge)" className="v-cube-badge" />
            <svg x={0.05} y={-CUBE / 2 - 0.17} width={0.34} height={0.34} viewBox="0 0 24 24">
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
      {/* A band of light sweeps up both side faces while the cube is at the top. */}
      <span className="v-scan is-l" style={{ ...at(-FACE_W, -FACE_H), width: FACE_W, height: FACE_H }}>
        <i />
      </span>
      <span className="v-scan is-r" style={{ ...at(0, DROP - FACE_H), width: FACE_W, height: FACE_H }}>
        <i />
      </span>
      {/* At the peak, rings of light ripple out from the top face. */}
      {[0, 1].map((k) => (
        <svg
          key={k}
          className="v-ripple"
          viewBox={`${-FACE_W} ${-FACE_H - DROP} ${2 * FACE_W} ${2 * DROP}`}
          style={
            {
              ...at(-FACE_W, -FACE_H - DROP),
              width: 2 * FACE_W,
              height: 2 * DROP,
              '--rd': `${k * 0.32}s`,
            } as CSSProperties
          }
          aria-hidden
        >
          <rect
            x={-A + 0.04}
            y={-A + 0.04}
            width={CUBE - 0.08}
            height={CUBE - 0.08}
            rx={0.14}
            transform={localPlaneMatrix(CUBE)}
          />
        </svg>
      ))}
      {SPARKS.map(([u, v, dx], k) => (
        <span
          key={k}
          className="v-spark"
          style={{ ...at(...local(u, v, CUBE)), '--dx': `${dx}px`, '--sd': `${k * 0.11}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
