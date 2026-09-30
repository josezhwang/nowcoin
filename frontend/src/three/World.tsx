import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Suspense, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { seeded } from './random'
import { useReducedMotion } from '../lib/hooks'
import { HeroScene } from './HeroScene'
import { StudioLights } from './StudioLights'
import { CAMERA_START_Z, FOV, SCROLL_TRAVEL } from './worldConfig'

const DEPTH = 160

/** Flies the camera forward as the page scrolls, with a little pointer sway. */
function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, dt) => {
    const cam = state.camera
    const k = 1 - Math.pow(0.02, dt)
    const targetZ = CAMERA_START_Z - window.scrollY * SCROLL_TRAVEL
    cam.position.z += (targetZ - cam.position.z) * (reduced ? 1 : Math.min(1, k * 2))
    if (!reduced) {
      cam.position.x += (state.pointer.x * 0.35 - cam.position.x) * k
      cam.position.y += (state.pointer.y * 0.25 - cam.position.y) * k
    }
  })
  return null
}

function Starfield({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const rand = seeded(23)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = ['#ffffff', '#c4b5fd', '#67e8f9', '#e9d5ff'].map((c) => new THREE.Color(c))
    for (let i = 0; i < count; i++) {
      positions.set(
        [(rand() - 0.5) * 60, (rand() - 0.5) * 40, 12 - rand() * DEPTH],
        i * 3,
      )
      const c = palette[i % palette.length].clone().multiplyScalar(0.6 + rand() * 0.9)
      colors.set([c.r, c.g, c.b], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.07} vertexColors sizeAttenuation transparent depthWrite={false} toneMapped={false} />
    </points>
  )
}

type DebrisKind = 'coin' | 'ico' | 'torus' | 'shard'

/** Crypto-flavoured objects drifting along the flight path, kept clear of the text column. */
function Debris({ count, reduced }: { count: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)

  const items = useMemo(() => {
    const rand = seeded(29)
    const kinds: DebrisKind[] = ['coin', 'ico', 'torus', 'shard']
    return Array.from({ length: count }, (_, i) => {
      const side = i % 2 ? 1 : -1
      return {
        kind: kinds[i % kinds.length],
        position: new THREE.Vector3(side * (6.5 + rand() * 7), (rand() - 0.5) * 11, -6 - (i / count) * (DEPTH - 20)),
        rotation: new THREE.Euler(rand() * 6, rand() * 6, 0),
        scale: 0.3 + rand() * 0.45,
        spin: (rand() - 0.5) * 0.8,
      }
    })
  }, [count])

  const materials = useMemo(
    () => ({
      coin: new THREE.MeshPhysicalMaterial({ color: '#fbbf24', metalness: 1, roughness: 0.25, clearcoat: 1 }),
      ico: new THREE.MeshBasicMaterial({ color: '#6d5bd0', wireframe: true, transparent: true, opacity: 0.6 }),
      torus: new THREE.MeshPhysicalMaterial({ color: '#22d3ee', metalness: 0.8, roughness: 0.15, emissive: '#0e7490', emissiveIntensity: 0.6 }),
      shard: new THREE.MeshPhysicalMaterial({ color: '#c4b5fd', metalness: 0.4, roughness: 0.05, iridescence: 1, clearcoat: 1, flatShading: true }),
    }),
    [],
  )

  const geometries = useMemo(
    () => ({
      coin: new THREE.CylinderGeometry(0.5, 0.5, 0.08, 48),
      ico: new THREE.IcosahedronGeometry(0.7, 1),
      torus: new THREE.TorusGeometry(0.5, 0.14, 24, 64),
      shard: new THREE.OctahedronGeometry(0.6, 0),
    }),
    [],
  )

  useFrame((_, dt) => {
    if (reduced || !group.current) return
    group.current.children.forEach((m, i) => {
      m.rotation.x += dt * items[i].spin
      m.rotation.y += dt * items[i].spin * 0.7
    })
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh
          key={i}
          geometry={geometries[it.kind]}
          material={materials[it.kind]}
          position={it.position}
          rotation={it.rotation}
          scale={it.scale}
        />
      ))}
    </group>
  )
}

function Effects() {
  const { size } = useThree()
  // Post-processing is the most expensive part; skip it on small screens.
  if (size.width < 860) return null
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.6} luminanceSmoothing={0.25} radius={0.7} />
      <Vignette offset={0.25} darkness={0.7} />
    </EffectComposer>
  )
}

/**
 * One fixed, full-screen WebGL world behind every page. Scrolling flies the
 * camera forward through stars and floating objects; the home hero lives at
 * the start of the path.
 */
export function World() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const mobile = window.innerWidth < 860

  return (
    <div className="world" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, CAMERA_START_Z], fov: FOV, near: 0.1, far: 90 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root')!}
        eventPrefix="client"
      >
        <color attach="background" args={['#05050a']} />
        <fog attach="fog" args={['#05050a', 14, 70]} />
        <Suspense fallback={null}>
          <StudioLights />
          <CameraRig reduced={reduced} />
          <Starfield count={mobile ? 1500 : 3500} />
          <Debris count={mobile ? 18 : 36} reduced={reduced} />
          {pathname === '/' && <HeroScene reduced={reduced} />}
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  )
}
