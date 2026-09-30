import { ContactShadows, Float, PresentationControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CardTier } from '../lib/types'
import { Card3D } from './Card3D'
import { StudioLights } from './StudioLights'

/** Interactive tier showcase: drag to rotate; switching tiers spins the card. */
export function CardScene({ tier, reduced }: { tier: CardTier; reduced: boolean }) {
  const spin = useRef<THREE.Group>(null)
  const target = useRef(0)

  useEffect(() => {
    target.current += Math.PI * 2
  }, [tier.id])

  useFrame((_, dt) => {
    const g = spin.current
    if (!g) return
    if (reduced) {
      g.rotation.y = target.current
      return
    }
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target.current, 4, dt)
  })

  return (
    <>
      <StudioLights tint={tier.colors[1]} />
      <PresentationControls
        global={false}
        cursor
        snap
        speed={1.4}
        polar={[-0.4, 0.4]}
        azimuth={[-0.8, 0.8]}
      >
        <Float enabled={!reduced} speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <group ref={spin} rotation={[0.1, 0, -0.08]}>
            <Card3D colors={tier.colors} tierName={tier.name} metal={tier.material === 'metal'} />
          </group>
        </Float>
      </PresentationControls>
      <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={8} blur={2.6} far={3} color={tier.colors[1]} />
    </>
  )
}
