import { Line, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFontsReady } from '@/hooks/useFontsReady'
import { CARD_DEPTH, CARD_HEIGHT, CARD_WIDTH, useCardBody } from '@/three/cardGeometry'
import { StudioLights } from '@/three/StudioLights'
import { createCardBack, createCardFront } from '@/three/textures'

const COLORS: [string, string] = ['#6d28d9', '#0891b2']
const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b)

// Chip location on the painted card face (see textures.ts), in world units.
const PX = CARD_WIDTH / 1024
const CHIP = { x: -CARD_WIDTH / 2 + 136 * PX, y: CARD_HEIGHT / 2 - 286 * PX, w: 128 * PX, h: 96 * PX }

/** Three turns of an NFC coil, inset from the card edge. */
function coilPoints() {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < 3; i++) {
    const inset = 0.16 + i * 0.07
    const w = CARD_WIDTH / 2 - inset
    const h = CARD_HEIGHT / 2 - inset
    pts.push(
      new THREE.Vector3(-w, -h, 0),
      new THREE.Vector3(w, -h, 0),
      new THREE.Vector3(w, h, 0),
      new THREE.Vector3(-w, h, 0),
      new THREE.Vector3(-w, -h + 0.07, 0),
    )
  }
  return pts
}

interface Props {
  /** 0 → 1 scroll progress through the pinned section. */
  progress: MotionValue<number>
  reduced: boolean
}

/**
 * The Nowcoin Card pulled apart into its layers as the visitor scrolls:
 * printed face, EMV chip, NFC antenna, metal core and back.
 */
export function CardAnatomyScene({ progress, reduced }: Props) {
  const fontsReady = useFontsReady()
  const body = useCardBody()
  const front = useMemo(() => (fontsReady ? createCardFront(COLORS, 'Aurora') : null), [fontsReady])
  const back = useMemo(() => (fontsReady ? createCardBack(COLORS) : null), [fontsReady])
  const coil = useMemo(() => coilPoints(), [])
  useEffect(() => () => front?.dispose(), [front])
  useEffect(() => () => back?.dispose(), [back])

  const group = useRef<THREE.Group>(null)
  const faceRef = useRef<THREE.Mesh>(null)
  const chipRef = useRef<THREE.Group>(null)
  const coilRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const backRef = useRef<THREE.Mesh>(null)

  useFrame((state, dt) => {
    const p = progress.get()
    const e = smooth(0.08, 0.5, p) // explode amount
    const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.05
    const g = group.current
    if (g) {
      const k = reduced ? 1 : 1 - Math.pow(0.001, dt)
      const rx = THREE.MathUtils.lerp(0.05, -0.42, e) + idle
      const ry = THREE.MathUtils.lerp(-0.25, 0.55, e) + p * 0.25
      g.rotation.x += (rx - g.rotation.x) * k
      g.rotation.y += (ry - g.rotation.y) * k
    }
    const base = CARD_DEPTH / 2 + 0.0075
    if (faceRef.current) faceRef.current.position.z = base + e * 1.5
    if (chipRef.current) chipRef.current.position.z = base - 0.03 + e * 1
    if (coilRef.current) coilRef.current.position.z = e * 0.4 - (1 - e) * 0.01
    if (coreRef.current) coreRef.current.position.z = -e * 0.3
    if (backRef.current) backRef.current.position.z = -base - e * 1.1
  })

  if (!front || !back) return null

  const face = { metalness: 0.5, roughness: 0.28, clearcoat: 1, iridescence: 0.6, alphaTest: 0.5 }

  return (
    <>
      <StudioLights tint="#22d3ee" />
      <group ref={group} scale={1.05} position={[-0.2, 0, 0]}>
        <mesh ref={faceRef}>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshPhysicalMaterial map={front} {...face} />
        </mesh>

        <group ref={chipRef} position={[CHIP.x, CHIP.y, 0]}>
          <RoundedBox args={[CHIP.w, CHIP.h, 0.03]} radius={0.01}>
            <meshPhysicalMaterial color="#e5c07b" metalness={1} roughness={0.2} clearcoat={1} />
          </RoundedBox>
        </group>

        <group ref={coilRef}>
          <Line
            points={coil}
            color={new THREE.Color('#22d3ee').multiplyScalar(1.8)}
            lineWidth={2.2}
            toneMapped={false}
          />
          <mesh position={[CHIP.x, CHIP.y, 0]}>
            <boxGeometry args={[CHIP.w * 0.7, CHIP.h * 0.7, 0.02]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
        </group>

        <mesh ref={coreRef} geometry={body}>
          <meshPhysicalMaterial
            color="#d1d5db"
            metalness={0.85}
            roughness={0.3}
            clearcoat={0.6}
            emissive="#1e293b"
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh ref={backRef} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshPhysicalMaterial map={back} {...face} />
        </mesh>
      </group>
    </>
  )
}
