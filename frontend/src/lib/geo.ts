import { LAND_MASK_BASE64, LAND_MASK_HEIGHT, LAND_MASK_WIDTH } from './landMask'

const landBits = Uint8Array.from(atob(LAND_MASK_BASE64), (c) => c.charCodeAt(0))

/** True when a latitude/longitude falls on land (1° Natural Earth grid). */
export function isLand(lat: number, lon: number) {
  const row = Math.min(LAND_MASK_HEIGHT - 1, Math.max(0, Math.floor(90 - lat)))
  const col = Math.min(LAND_MASK_WIDTH - 1, Math.max(0, Math.floor(lon + 180)))
  const i = row * LAND_MASK_WIDTH + col
  return (((landBits[i >> 3] ?? 0) >> (i & 7)) & 1) === 1
}

/** Unit vector for a latitude/longitude (y up, z towards the viewer at lon 0). */
export function toVec(lat: number, lon: number): [number, number, number] {
  const la = (lat * Math.PI) / 180
  const lo = (lon * Math.PI) / 180
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
}
