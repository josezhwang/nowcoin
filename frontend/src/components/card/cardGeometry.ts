// Layout of the exploded card, in design pixels. The card is drawn at
// 420 × 265 (the ISO/IEC 7810 ID-1 ratio, 85.6 × 54 mm → ~4.9 px/mm) and the
// whole stage is scaled to fit its container.

export const CARD_W = 420
export const CARD_H = 265
export const CARD_R = 18

/** EMV contact plate position on the face (≈ 11 × 9 mm, 12 mm from the left edge). */
export const CHIP = { x: 56, y: 98, w: 54, h: 42 }

export type LayerId = 'chip' | 'face' | 'antenna' | 'core' | 'back'
export type CardView = 'layers' | 'front' | 'back'

export interface LayerSpec {
  id: LayerId
  title: string
  body: string
  /** Z offset in px when assembled (~0.8 mm card) and when exploded. */
  flat: number
  exploded: number
  /** Which side of the stage its label sits on, the anchor point and leader length. */
  side: 'left' | 'right'
  anchor: [number, number]
  lead: number
}

export function layerSpecs(metal: boolean): LayerSpec[] {
  return [
    {
      id: 'chip',
      title: 'EMV secure element',
      body: 'Signs every tap on-chip',
      flat: 4.8,
      exploded: 205,
      side: 'left',
      anchor: [CHIP.x, CHIP.y + CHIP.h / 2],
      lead: 168,
    },
    {
      id: 'face',
      title: 'Holographic face',
      body: 'Foil print under hard-coat',
      flat: 3.6,
      exploded: 120,
      side: 'right',
      anchor: [CARD_W, CARD_H],
      lead: 64,
    },
    {
      id: 'antenna',
      title: 'NFC antenna',
      body: '4-turn copper coil',
      flat: 2.4,
      exploded: 38,
      side: 'left',
      anchor: [0, 0],
      lead: 64,
    },
    {
      id: 'core',
      title: metal ? 'Stainless-steel core' : 'Polycarbonate core',
      body: metal ? '18 g, laser-cut NFC slit' : 'Recycled, translucent',
      flat: 1.2,
      exploded: -44,
      side: 'right',
      anchor: [CARD_W, CARD_H],
      lead: 64,
    },
    {
      id: 'back',
      title: 'Signature back',
      body: 'Laser-engraved details',
      flat: 0,
      exploded: -126,
      side: 'left',
      anchor: [0, 0],
      lead: 64,
    },
  ]
}

/**
 * The antenna coil: `turns` rounded rectangles stepping inwards by `gap`,
 * joined into one continuous spiral that starts and ends on the left edge.
 */
export function coilPath(turns = 4, inset = 12, gap = 6, r = 16) {
  let d = ''
  for (let k = 0; k < turns; k++) {
    const o = inset + k * gap
    const x1 = CARD_W - o
    const y1 = CARD_H - o
    d +=
      `${k === 0 ? 'M' : 'L'}${o} ${o + r} A${r} ${r} 0 0 1 ${o + r} ${o} L${x1 - r} ${o} ` +
      `A${r} ${r} 0 0 1 ${x1} ${o + r} L${x1} ${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} ` +
      `L${o + r} ${y1} A${r} ${r} 0 0 1 ${o} ${y1 - r} L${o} ${o + r + gap} `
  }
  return d.trim()
}

/** Where the coil ends (innermost turn) and starts (outermost), for the leads. */
export const COIL = { turns: 4, inset: 12, gap: 6, r: 16 }
const innerX = COIL.inset + (COIL.turns - 1) * COIL.gap
const innerY = innerX + COIL.r + COIL.gap

/** Leads from the coil's two ends to the chip's landing pads. */
export const LEADS = {
  inner: `M${innerX} ${innerY} L${innerX + 10} ${innerY} L${innerX + 10} ${CHIP.y + 12} L${CHIP.x - 2} ${CHIP.y + 12}`,
  bridge:
    `M${CHIP.x + CHIP.w + 2} ${CHIP.y + CHIP.h - 12} L${CHIP.x + CHIP.w + 10} ${CHIP.y + CHIP.h - 12} ` +
    `L${CHIP.x + CHIP.w + 10} ${CHIP.y + CHIP.h + 16} L${COIL.inset - 6} ${CHIP.y + CHIP.h + 16} ` +
    `L${COIL.inset - 6} ${COIL.inset + COIL.r} L${COIL.inset} ${COIL.inset + COIL.r}`,
  /** Insulation pad where the bridge crosses the turns. */
  crossing: { x: COIL.inset - 3, y: CHIP.y + CHIP.h + 11, w: COIL.turns * COIL.gap + 2, h: 10 },
}
