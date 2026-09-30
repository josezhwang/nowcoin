import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { CARD_DEPTH, CARD_HEIGHT, CARD_WIDTH, useCardBody } from '@/three/cardGeometry'
import { useFontsReady } from '@/hooks/useFontsReady'
import { createCardBack, createCardFront } from '@/three/textures'

interface Card3DProps {
  colors: [string, string]
  tierName?: string
  metal?: boolean
}

export function Card3D({ colors, tierName = 'Aurora', metal = true }: Card3DProps) {
  const fontsReady = useFontsReady()
  const body = useCardBody()
  const [c0, c1] = colors

  // Paint only once web fonts are available so the canvas text isn't a fallback face.
  const front = useMemo(() => (fontsReady ? createCardFront([c0, c1], tierName) : null), [c0, c1, tierName, fontsReady])
  const back = useMemo(() => (fontsReady ? createCardBack([c0, c1]) : null), [c0, c1, fontsReady])
  const edge = useMemo(() => new THREE.Color(c0).lerp(new THREE.Color(c1), 0.5), [c0, c1])

  useEffect(() => () => front?.dispose(), [front])
  useEffect(() => () => back?.dispose(), [back])
  useEffect(() => () => body.dispose(), [body])

  const face = {
    metalness: metal ? 0.55 : 0.15,
    roughness: metal ? 0.28 : 0.45,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    iridescence: metal ? 0.6 : 0.2,
    iridescenceIOR: 1.4,
    alphaTest: 0.5,
  }

  if (!front || !back) return null

  return (
    <group>
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial color={edge} metalness={0.9} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0, CARD_DEPTH / 2 + 0.0075]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshPhysicalMaterial map={front} {...face} />
      </mesh>
      <mesh position={[0, 0, -CARD_DEPTH / 2 - 0.0075]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshPhysicalMaterial map={back} {...face} />
      </mesh>
    </group>
  )
}
