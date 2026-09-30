import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { StudioLights } from '@/three/StudioLights'

/** Liquid-metal blob tinted with a product's accent colour. */
export function OrbScene({ color, reduced }: { color: string; reduced: boolean }) {
  return (
    <>
      <StudioLights tint={color} variant="rim" />
      <Float enabled={!reduced} speed={1.4} floatIntensity={0.8}>
        <mesh scale={1.6}>
          <icosahedronGeometry args={[1, 64]} />
          <MeshDistortMaterial
            color={color}
            distort={reduced ? 0.2 : 0.38}
            speed={reduced ? 0 : 1.6}
            metalness={0.85}
            roughness={0.18}
          />
        </mesh>
      </Float>
      <Sparkles count={50} scale={6} size={2} speed={reduced ? 0 : 0.3} color={color} />
    </>
  )
}
