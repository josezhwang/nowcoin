import { useMemo } from 'react'
import { useFontsReady } from '../lib/hooks'
import { getCoinFace } from './textures'

interface Coin3DProps {
  symbol: string
  colors: [string, string]
  radius?: number
}

export function Coin3D({ symbol, colors, radius = 0.5 }: Coin3DProps) {
  const fontsReady = useFontsReady()
  const [c0, c1] = colors
  // Cached and shared across instances, so never disposed here.
  const face = useMemo(() => (fontsReady ? getCoinFace(symbol, [c0, c1]) : null), [symbol, c0, c1, fontsReady])
  if (!face) return null

  // CylinderGeometry material groups: 0 = side, 1 = top cap, 2 = bottom cap.
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[radius, radius, radius * 0.16, 64]} />
      <meshPhysicalMaterial attach="material-0" color={c1} metalness={1} roughness={0.3} />
      <meshPhysicalMaterial attach="material-1" map={face} metalness={0.7} roughness={0.25} clearcoat={1} />
      <meshPhysicalMaterial attach="material-2" map={face} metalness={0.7} roughness={0.25} clearcoat={1} />
    </mesh>
  )
}
