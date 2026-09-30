import { Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { seeded } from '@/three/random'
import { Card3D } from '@/three/Card3D'
import { Coin3D } from '@/three/Coin3D'
import { CAMERA_START_Z, FOV } from '@/three/worldConfig'
import { useTheme } from '@/theme/useTheme'

const COINS: { symbol: string; colors: [string, string]; phase: number; radius: number; orbit: number }[] = [
  { symbol: '₿', colors: ['#fcd34d', '#d97706'], phase: 0, radius: 0.42, orbit: 2.1 },
  { symbol: 'Ξ', colors: ['#c4b5fd', '#6d28d9'], phase: 1.3, radius: 0.36, orbit: 1.95 },
  { symbol: '◎', colors: ['#67e8f9', '#0e7490'], phase: 2.6, radius: 0.32, orbit: 2.2 },
  { symbol: '₮', colors: ['#6ee7b7', '#047857'], phase: 3.9, radius: 0.3, orbit: 2.05 },
  { symbol: 'N', colors: ['#f0abfc', '#a21caf'], phase: 5.1, radius: 0.34, orbit: 2.25 },
]

// Colours above 1.0 on unlit materials are what the bloom pass picks up.
const glow = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k)

function OrbitingCoin({ coin, reduced }: { coin: (typeof COINS)[number]; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = (reduced ? 0 : clock.elapsedTime * 0.3) + coin.phase
    g.position.set(Math.cos(t) * coin.orbit, Math.sin(t * 2) * 0.3 + Math.sin(t) * 0.8, Math.sin(t) * 1.3)
    g.rotation.y = reduced ? 0.4 : clock.elapsedTime * 1.2 + coin.phase
    g.rotation.x = 0.25
  })
  return (
    <group ref={ref}>
      <Coin3D symbol={coin.symbol} colors={coin.colors} radius={coin.radius} />
    </group>
  )
}

/** A swirling disk of glowing particles around the card, like an accretion disk. */
function ParticleDisk({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const { palette } = useTheme()
  const geometry = useMemo(() => {
    const rand = seeded(11)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const a = new THREE.Color('#8b5cf6')
    const b = new THREE.Color('#22d3ee')
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.pow(rand(), 1.6) * 2.2
      const theta = rand() * Math.PI * 2
      positions.set([Math.cos(theta) * r, (rand() - 0.5) * 0.18 * r, Math.sin(theta) * r], i * 3)
      c.copy(a)
        .lerp(b, (r - 2.6) / 2.2)
        .multiplyScalar(palette.additive ? 1.6 : 0.85)
      colors.set([c.r, c.g, c.b], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count, palette.additive])

  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.y += dt * 0.12
  })

  return (
    <points ref={ref} geometry={geometry} rotation={[0.35, 0, 0.18]}>
      <pointsMaterial
        key={String(palette.additive)}
        size={palette.additive ? 0.035 : 0.04}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  )
}

function Rings({ reduced }: { reduced: boolean }) {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (reduced) return
    if (a.current) a.current.rotation.z += dt * 0.15
    if (b.current) b.current.rotation.z -= dt * 0.1
  })
  return (
    <group position={[0, 0, -1.2]}>
      <mesh ref={a} rotation={[1.2, 0.2, 0]}>
        <torusGeometry args={[2.9, 0.012, 16, 200]} />
        <meshBasicMaterial color={glow('#8b5cf6', 2.2)} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[1.35, -0.35, 0]}>
        <torusGeometry args={[3.4, 0.008, 16, 200]} />
        <meshBasicMaterial color={glow('#22d3ee', 1.8)} toneMapped={false} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

/** The home-page hero: lives in the shared World canvas at the origin. */
export function HeroScene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null)
  const rig = useRef<THREE.Group>(null)
  const card = useRef<THREE.Group>(null)
  const { size } = useThree()
  const mobile = size.width < 860

  // Frame the layout against the camera's *starting* distance so the card
  // doesn't drift as the camera flies forward on scroll.
  const viewH = 2 * CAMERA_START_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const viewW = viewH * (size.width / size.height)

  const x = mobile ? 0 : Math.min(viewW * 0.27, 3.7)
  const y = mobile ? -viewH * 0.35 : -0.1
  const scale = mobile ? Math.min(0.62, viewW / 7) : Math.min(0.85, viewW / 11)

  useFrame((state, dt) => {
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5)
    if (root.current) {
      root.current.position.y = y + scroll * viewH * 0.9
      root.current.visible = scroll < 1.2
    }
    if (rig.current) {
      const k = 1 - Math.pow(0.001, dt)
      rig.current.rotation.y += (state.pointer.x * 0.35 - rig.current.rotation.y) * k
      rig.current.rotation.x += (-state.pointer.y * 0.2 - rig.current.rotation.x) * k
    }
    if (card.current) {
      const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.12
      card.current.rotation.y = -0.45 + idle + scroll * Math.PI
      card.current.rotation.z = 0.12 - scroll * 0.3
    }
  })

  return (
    <group ref={root} position={[x, y, 0]} scale={scale}>
      <group ref={rig}>
        <Rings reduced={reduced} />
        <ParticleDisk count={mobile ? 900 : 2200} reduced={reduced} />
        <Float enabled={!reduced} speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
          <group ref={card}>
            <Card3D colors={['#6d28d9', '#0891b2']} tierName="Aurora" />
          </group>
        </Float>
        {COINS.map((c) => (
          <OrbitingCoin key={c.symbol} coin={c} reduced={reduced} />
        ))}
      </group>
    </group>
  )
}
