import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { seeded } from './random'
import { Coin3D } from './Coin3D'
import { StudioLights } from './StudioLights'

const TYPES: { symbol: string; colors: [string, string] }[] = [
  { symbol: '₿', colors: ['#fcd34d', '#d97706'] },
  { symbol: 'Ξ', colors: ['#c4b5fd', '#6d28d9'] },
  { symbol: '◎', colors: ['#67e8f9', '#0e7490'] },
  { symbol: 'N', colors: ['#f0abfc', '#a21caf'] },
]

/** Coins tumbling down either side of the call-to-action panel. */
export function CoinRainScene({ count = 22, reduced }: { count?: number; reduced: boolean }) {
  const { viewport } = useThree()
  const refs = useRef<(THREE.Group | null)[]>([])

  const coins = useMemo(() => {
    const rand = seeded(7)
    return Array.from({ length: count }, (_, i) => ({
        type: TYPES[i % TYPES.length],
        lane: (i % 2 ? 1 : -1) * (0.3 + rand() * 0.2),
        y: rand(),
        z: -rand() * 3,
        speed: 0.5 + rand() * 0.7,
        spin: new THREE.Vector3(rand() * 2, rand() * 3, rand()),
        scale: 0.35 + rand() * 0.35,
      }))
  }, [count])

  useFrame((_, dt) => {
    const h = viewport.height + 2
    coins.forEach((c, i) => {
      const g = refs.current[i]
      if (!g) return
      if (!reduced) {
        c.y -= (dt * c.speed) / h
        if (c.y < 0) c.y += 1
        g.rotation.x += dt * c.spin.x
        g.rotation.y += dt * c.spin.y
        g.rotation.z += dt * c.spin.z
      }
      g.position.set(c.lane * viewport.width, (c.y - 0.5) * h, c.z)
    })
  })

  return (
    <>
      <StudioLights />
      {coins.map((c, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)} scale={c.scale}>
          <Coin3D symbol={c.type.symbol} colors={c.type.colors} />
        </group>
      ))}
    </>
  )
}
