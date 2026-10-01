/**
 * Isometric projection for the hero "vault": a rounded slab with a square
 * hole, seen from the front-above. World axes: u → front-right, v →
 * front-left, h → up. One world unit is S stage pixels.
 *
 * Everything is plain SVG/CSS (no WebGL), so it renders on every machine.
 */
export const S = 62
const COS = Math.cos(Math.PI / 6)
const SIN = 0.5

export const STAGE_W = 1200
export const STAGE_H = 720
const OX = STAGE_W / 2
const OY = 340

/** Half-size and corner radius of the slab, half-size of the hole. */
export const PANEL = 5
export const RADIUS = 1.35
export const HOLE = 2.8
/** Slab thickness and how far below the top surface the well floor sits. */
export const SLAB = 0.5
export const WELL = 2.05
/** Cube edge length and the spacing between cube centres. */
export const CUBE = 1.6
export const PITCH = 1.85

export type P3 = readonly [number, number, number]
type Proj = (u: number, v: number, h: number) => [number, number]

/** World → stage pixels. */
export const project: Proj = (u, v, h) => [OX + (u - v) * COS * S, OY + (u + v) * SIN * S - h * S]

/** World → pixels relative to a local origin (used inside each cube's own SVG). */
export const local: Proj = (u, v, h) => [(u - v) * COS * S, (u + v) * SIN * S - h * S]

const fmt = (n: number) => n.toFixed(1)

export function points(list: readonly P3[], fn: Proj = project) {
  return list.map(([u, v, h]) => fn(u, v, h).map(fmt).join(',')).join(' ')
}

export function polyline(list: readonly P3[], fn: Proj = project) {
  return list.map(([u, v, h], i) => `${i ? 'L' : 'M'}${fn(u, v, h).map(fmt).join(' ')}`).join(' ')
}

/** SVG transform that maps world (u, v) on the plane at height h onto the stage. */
export const planeMatrix = (h: number) => `matrix(${COS * S} ${SIN * S} ${-COS * S} ${SIN * S} ${OX} ${OY - h * S})`

/** Same, relative to a local origin. */
export const localPlaneMatrix = (h: number) => `matrix(${COS * S} ${SIN * S} ${-COS * S} ${SIN * S} 0 ${-h * S})`

/**
 * Face planes of a cube (local coords, half-size `a`), oriented so that SVG
 * content drawn in (x → along the face, y → down) appears upright and unmirrored.
 */
export const faceMatrix = {
  /** The face looking towards +v (front-left on screen). */
  left: (a: number) => `matrix(${COS * S} ${SIN * S} 0 ${S} ${-a * COS * S} ${a * SIN * S})`,
  /** The face looking towards +u (front-right on screen). */
  right: (a: number) => `matrix(${COS * S} ${-SIN * S} 0 ${S} ${a * COS * S} ${a * SIN * S})`,
}

/** Rounded square centred on the origin, in world units. */
export function roundedSquare(half: number, r: number) {
  const a = half
  return [
    `M${-a + r} ${-a}`,
    `H${a - r}`,
    `A${r} ${r} 0 0 1 ${a} ${-a + r}`,
    `V${a - r}`,
    `A${r} ${r} 0 0 1 ${a - r} ${a}`,
    `H${-a + r}`,
    `A${r} ${r} 0 0 1 ${-a} ${a - r}`,
    `V${-a + r}`,
    `A${r} ${r} 0 0 1 ${-a + r} ${-a}`,
    'Z',
  ].join(' ')
}

export const square = (half: number) => `M${-half} ${-half} H${half} V${half} H${-half} Z`

/** Slab top surface: rounded square with the square hole cut out (fill-rule evenodd). */
export const TOP_FACE = `${roundedSquare(PANEL, RADIUS)} ${square(HOLE)}`

/**
 * Everything in front of the hole (u > HOLE or v > HOLE). It is redrawn above
 * the cubes so a sinking cube disappears behind the near rim — the painter's
 * algorithm, done once with static layers.
 */
export const FRONT_REGION = points([
  [HOLE, -PANEL - 1, 0],
  [PANEL + 1, -PANEL - 1, 0],
  [PANEL + 1, PANEL + 1, 0],
  [-PANEL - 1, PANEL + 1, 0],
  [-PANEL - 1, HOLE, 0],
  [HOLE, HOLE, 0],
])

/** Light traces engraved into the slab, running from the edge into the hole. */
export const TRACES: { path: P3[]; front: boolean }[] = [
  // Behind the hole (drawn under the cubes)
  {
    path: [
      [-4.4, -0.6, 0],
      [-3.2, -0.6, 0],
      [-3.2, 0.4, 0],
      [-HOLE, 0.4, 0],
    ],
    front: false,
  },
  {
    path: [
      [-3.6, -4.4, 0],
      [-3.6, -3.2, 0],
      [-1.2, -3.2, 0],
      [-1.2, -HOLE, 0],
    ],
    front: false,
  },
  {
    path: [
      [0.6, -4.4, 0],
      [0.6, -3.4, 0],
      [1.4, -3.4, 0],
      [1.4, -HOLE, 0],
    ],
    front: false,
  },
  {
    path: [
      [-4.4, 1.7, 0],
      [-3.0, 1.7, 0],
      [-3.0, 1.2, 0],
      [-HOLE, 1.2, 0],
    ],
    front: false,
  },
  {
    path: [
      [-2.6, -4.6, 0],
      [-2.6, -3.8, 0],
      [-0.2, -3.8, 0],
      [-0.2, -HOLE, 0],
    ],
    front: false,
  },
  // In front of the hole (drawn over the cubes)
  {
    path: [
      [4.4, 0.2, 0],
      [3.2, 0.2, 0],
      [3.2, -0.6, 0],
      [HOLE, -0.6, 0],
    ],
    front: true,
  },
  {
    path: [
      [4.4, 2.4, 0],
      [3.0, 2.4, 0],
      [3.0, 1.1, 0],
      [HOLE, 1.1, 0],
    ],
    front: true,
  },
  {
    path: [
      [-0.8, 4.4, 0],
      [-0.8, 3.2, 0],
      [0.4, 3.2, 0],
      [0.4, HOLE, 0],
    ],
    front: true,
  },
  {
    path: [
      [1.8, 4.4, 0],
      [1.8, 3.4, 0],
      [1.0, 3.4, 0],
      [1.0, HOLE, 0],
    ],
    front: true,
  },
]

/** Deterministic pseudo-random in [0, 1). */
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Points along the slab's outer rounded edge at height h (stage px), for light runners. */
export function outline(half: number, r: number, h = 0, perCorner = 10) {
  const pts: [number, number][] = []
  const corners: [number, number, number][] = [
    [half - r, -half + r, -Math.PI / 2],
    [half - r, half - r, 0],
    [-half + r, half - r, Math.PI / 2],
    [-half + r, -half + r, Math.PI],
  ]
  for (const [cu, cv, a0] of corners) {
    for (let i = 0; i <= perCorner; i++) {
      const a = a0 + (i / perCorner) * (Math.PI / 2)
      pts.push(project(cu + Math.cos(a) * r, cv + Math.sin(a) * r, h))
    }
  }
  return pts
}

export const toPath = (pts: readonly (readonly [number, number])[], close = true) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + (close ? ' Z' : '')

/** Pixel bounding box (with padding) of a set of stage points. */
export function bbox(pts: readonly (readonly [number, number])[], pad = 14) {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const x = Math.min(...xs) - pad
  const y = Math.min(...ys) - pad
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y }
}

/** Absolutely positions a small SVG over the stage region `b` (percent units). */
export function boxStyle(b: { x: number; y: number; w: number; h: number }) {
  return {
    left: `${(b.x / STAGE_W) * 100}%`,
    top: `${(b.y / STAGE_H) * 100}%`,
    width: `${(b.w / STAGE_W) * 100}%`,
    height: `${(b.h / STAGE_H) * 100}%`,
  }
}
