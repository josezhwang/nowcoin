import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const R = 2

const CITIES: [name: string, lat: number, lon: number][] = [
  ['London', 51.5, -0.1],
  ['New York', 40.7, -74],
  ['San Francisco', 37.8, -122.4],
  ['São Paulo', -23.5, -46.6],
  ['Lagos', 6.5, 3.4],
  ['Dubai', 25.2, 55.3],
  ['Mumbai', 19.1, 72.9],
  ['Singapore', 1.35, 103.8],
  ['Tokyo', 35.7, 139.7],
  ['Seoul', 37.6, 127],
  ['Sydney', -33.9, 151.2],
  ['Frankfurt', 50.1, 8.7],
]

const ROUTES: [number, number][] = [
  [0, 1], [1, 2], [0, 5], [5, 6], [6, 7], [7, 8], [8, 9], [7, 10],
  [1, 3], [0, 4], [11, 5], [2, 8], [3, 4], [11, 7],
]

function latLon(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

// Cheap smooth 3D noise from summed sines — enough to carve abstract "continents".
function landNoise(v: THREE.Vector3) {
  return (
    Math.sin(v.x * 1.7 + 1.3) * Math.cos(v.y * 2.1 - 0.4) +
    Math.sin(v.z * 1.9 + v.x * 0.8) * 0.8 +
    Math.cos(v.y * 3.3 + v.z * 1.1) * 0.45
  )
}

function useDotSphere(count: number) {
  return useMemo(() => {
    const positions: number[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    const v = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      v.set(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r)
      if (landNoise(v) > 0.4) positions.push(v.x * R, v.y * R, v.z * R)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [count])
}

const atmosphereShader = {
  uniforms: { color: { value: new THREE.Color('#7c5cff') } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
      gl_FragColor = vec4(color, 1.0) * intensity * 1.1;
    }`,
}

function Arc({ from, to, delay, reduced }: { from: THREE.Vector3; to: THREE.Vector3; delay: number; reduced: boolean }) {
  const pulse = useRef<THREE.Mesh>(null)
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
    const lift = 1 + from.distanceTo(to) * 0.28
    mid.normalize().multiplyScalar(R * lift)
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])
  const points = useMemo(() => curve.getPoints(48), [curve])

  useFrame(({ clock }) => {
    if (!pulse.current) return
    const t = reduced ? 0.5 : ((clock.elapsedTime * 0.35 + delay) % 1.6) / 1.6
    pulse.current.position.copy(curve.getPoint(Math.min(t * 1.25, 1)))
    pulse.current.visible = reduced || t < 0.8
  })

  return (
    <>
      <Line points={points} color="#22d3ee" lineWidth={1.2} transparent opacity={0.45} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#c6f65b" toneMapped={false} />
      </mesh>
    </>
  )
}

function CityMarker({ position, reduced, i }: { position: THREE.Vector3; reduced: boolean; i: number }) {
  const ring = useRef<THREE.Mesh>(null)
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  )
  useFrame(({ clock }) => {
    if (!ring.current || reduced) return
    const t = (clock.elapsedTime * 0.6 + i * 0.37) % 1
    ring.current.scale.setScalar(1 + t * 2.5)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - t
  })
  return (
    <group position={position} quaternion={quat}>
      <mesh>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.04, 0.055, 32]} />
        <meshBasicMaterial color="#c6f65b" transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** A dotted planet with glowing settlement routes between financial hubs. */
export function GlobeScene({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null)
  const dots = useDotSphere(9000)
  const cities = useMemo(() => CITIES.map(([, lat, lon]) => latLon(lat, lon, R * 1.005)), [])

  useFrame((state, dt) => {
    const g = spin.current
    if (!g) return
    if (!reduced) g.rotation.y += dt * 0.08
    const k = 1 - Math.pow(0.01, dt)
    g.rotation.x += (0.35 - state.pointer.y * 0.25 - g.rotation.x) * k
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <group ref={spin} rotation={[0.35, -1.6, 0]}>
        <mesh>
          <sphereGeometry args={[R * 0.995, 64, 64]} />
          <meshBasicMaterial color="#07071a" />
        </mesh>
        <points geometry={dots}>
          <pointsMaterial size={0.028} color="#8b7cf6" transparent opacity={0.85} sizeAttenuation depthWrite={false} />
        </points>
        {cities.map((p, i) => (
          <CityMarker key={i} position={p} reduced={reduced} i={i} />
        ))}
        {ROUTES.map(([a, b], i) => (
          <Arc key={i} from={cities[a]} to={cities[b]} delay={i * 0.23} reduced={reduced} />
        ))}
      </group>
      <mesh scale={1.12}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial args={[atmosphereShader]} side={THREE.BackSide} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
    </>
  )
}
