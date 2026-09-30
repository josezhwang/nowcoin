import { useMemo } from 'react'
import * as THREE from 'three'

export const CARD_WIDTH = 3.2
export const CARD_HEIGHT = CARD_WIDTH / 1.586
export const CARD_DEPTH = 0.03
const CORNER = CARD_WIDTH * (56 / 1024)

export function useCardBody() {
  return useMemo(() => {
    const w = CARD_WIDTH / 2
    const h = CARD_HEIGHT / 2
    const shape = new THREE.Shape()
    shape.moveTo(-w + CORNER, -h)
    shape.lineTo(w - CORNER, -h)
    shape.quadraticCurveTo(w, -h, w, -h + CORNER)
    shape.lineTo(w, h - CORNER)
    shape.quadraticCurveTo(w, h, w - CORNER, h)
    shape.lineTo(-w + CORNER, h)
    shape.quadraticCurveTo(-w, h, -w, h - CORNER)
    shape.lineTo(-w, -h + CORNER)
    shape.quadraticCurveTo(-w, -h, -w + CORNER, -h)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: CARD_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 3,
      curveSegments: 12,
    })
    geo.translate(0, 0, -CARD_DEPTH / 2)
    return geo
  }, [])
}
