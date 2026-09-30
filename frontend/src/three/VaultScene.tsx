import { Edges, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { StudioLights } from './StudioLights'

const SHARDS = 14

/**
 * A glass vault with a glowing core, orbited by key shards — a visual for
 * MPC custody, where a key is split into pieces no one party holds.
 */
export function VaultScene({ reduced }: { reduced: boolean }) {
  const shell = useRef<THREE.Mesh>(null)
  const orbit = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)

  const shards = useMemo(
    () =>
      Array.from({ length: SHARDS }, (_, i) => {
        const a = (i / SHARDS) * Math.PI * 2
        const r = 1.9 + (i % 3) * 0.2
        return {
          position: new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 3) * 0.35, Math.sin(a) * r),
          rotation: new THREE.Euler(a, a * 2, 0),
          scale: 0.1 + (i % 4) * 0.035,
        }
      }),
    [],
  )

  useFrame(({ clock }, dt) => {
    if (reduced) return
    if (shell.current) {
      shell.current.rotation.y += dt * 0.2
      shell.current.rotation.x += dt * 0.07
    }
    if (orbit.current) orbit.current.rotation.y -= dt * 0.25
    if (core.current) {
      core.current.rotation.y -= dt * 0.6
      core.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.08)
    }
  })

  return (
    <>
      <StudioLights tint="#22d3ee" />
      <group rotation={[0.35, 0, 0]}>
        <Float enabled={!reduced} speed={1.5} floatIntensity={0.4}>
          <mesh ref={shell}>
            <icosahedronGeometry args={[1.35, 0]} />
            <meshPhysicalMaterial
              color="#0b1024"
              metalness={0.3}
              roughness={0.05}
              transparent
              opacity={0.4}
              clearcoat={1}
              iridescence={1}
              iridescenceIOR={1.6}
              flatShading
              depthWrite={false}
            />
            <Edges color="#22d3ee" threshold={10} />
          </mesh>
          <mesh ref={core}>
            <icosahedronGeometry args={[0.5, 1]} />
            <meshBasicMaterial color="#c6f65b" wireframe toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshBasicMaterial color="#c6f65b" toneMapped={false} />
          </mesh>
          <pointLight color="#c6f65b" intensity={12} distance={4} />
        </Float>
        <group ref={orbit}>
          {shards.map((s, i) => (
            <mesh key={i} position={s.position} rotation={s.rotation} scale={s.scale}>
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color={i % 2 ? '#8b5cf6' : '#22d3ee'}
                metalness={0.6}
                roughness={0.2}
                emissive={i % 2 ? '#4c1d95' : '#155e75'}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.1, 0.006, 8, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
          </mesh>
        </group>
      </group>
    </>
  )
}
