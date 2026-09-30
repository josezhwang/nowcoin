import { Line, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/theme/useTheme'
import { HUBS, ROUTES } from './globeData'
import { LAND_MASK_BASE64, LAND_MASK_HEIGHT, LAND_MASK_WIDTH } from './landMask'

const R = 2

function latLonToVec(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

const landBits = Uint8Array.from(atob(LAND_MASK_BASE64), (c) => c.charCodeAt(0))

function isLand(lat: number, lon: number) {
  const row = Math.min(LAND_MASK_HEIGHT - 1, Math.max(0, Math.floor(90 - lat)))
  const col = Math.min(LAND_MASK_WIDTH - 1, Math.max(0, Math.floor(lon + 180)))
  const i = row * LAND_MASK_WIDTH + col
  return ((landBits[i >> 3] ?? 0) >> (i & 7)) & 1
}

/** Evenly spaced points (Fibonacci sphere) kept only where there is land. */
function useLandDots(samples: number) {
  return useMemo(() => {
    const positions: number[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2
      const lat = THREE.MathUtils.radToDeg(Math.asin(y))
      const lon = (((THREE.MathUtils.radToDeg(golden * i) % 360) + 540) % 360) - 180
      if (lat < -62) continue // leave out Antarctica for a cleaner silhouette
      if (!isLand(lat, lon)) continue
      const v = latLonToVec(lat, lon, R * 1.002)
      positions.push(v.x, v.y, v.z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [samples])
}

/** Round, soft-edged sprite for the land dots. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.55, 'rgba(255,255,255,1)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

// Ocean sphere: flat base colour that brightens towards the limb (fresnel rim).
const rimShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 base;
    uniform vec3 rim;
    uniform float power;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float f = pow(1.0 - max(dot(vNormal, vView), 0.0), power);
      gl_FragColor = vec4(mix(base, rim, f), 1.0);
    }`,
}

// Soft halo drawn on the back faces of a slightly larger sphere.
const atmosphereShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color;
    uniform float strength;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      gl_FragColor = vec4(color, clamp(intensity * strength, 0.0, 1.0));
    }`,
}

interface ArcProps {
  from: THREE.Vector3
  to: THREE.Vector3
  delay: number
  reduced: boolean
}

/** A flowing gradient arc between two hubs with a bright packet travelling along it. */
function Arc({ from, to, delay, reduced }: ArcProps) {
  const head = useRef<THREE.Mesh>(null)
  // drei's <Line> renders a Line2 whose LineMaterial has an animatable dashOffset.
  const line = useRef<{ material: { dashOffset: number } }>(null)

  const { points, colors, curve } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(R * (1 + from.distanceTo(to) * 0.3))
    const c = new THREE.QuadraticBezierCurve3(from, mid, to)
    const pts = c.getPoints(64)
    const a = new THREE.Color('#5b8cff')
    const b = new THREE.Color('#e879f9')
    return { points: pts, colors: pts.map((_, i) => a.clone().lerp(b, i / (pts.length - 1))), curve: c }
  }, [from, to])

  useFrame(({ clock }) => {
    const t = reduced ? 0.6 : ((clock.elapsedTime * 0.28 + delay) % 1.4) / 1.4
    if (head.current) {
      head.current.position.copy(curve.getPoint(Math.min(t * 1.2, 1)))
      head.current.visible = reduced || t < 0.83
    }
    if (line.current && !reduced) line.current.material.dashOffset = -clock.elapsedTime * 0.25 - delay
  })

  return (
    <>
      <Line
        ref={line as never}
        points={points}
        vertexColors={colors}
        lineWidth={1.4}
        transparent
        opacity={0.85}
        dashed
        dashSize={0.18}
        gapSize={0.06}
      />
      <mesh ref={head}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  )
}

interface HubProps {
  position: THREE.Vector3
  index: number
  reduced: boolean
  color: string
}

function Hub({ position, index, reduced, color }: HubProps) {
  const ring = useRef<THREE.Mesh>(null)
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  )
  useFrame(({ clock }) => {
    if (!ring.current || reduced) return
    const t = (clock.elapsedTime * 0.55 + index * 0.29) % 1
    ring.current.scale.setScalar(1 + t * 3)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - t)
  })
  return (
    <group position={position} quaternion={quat}>
      <mesh>
        <circleGeometry args={[0.028, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.035, 0.05, 40]} />
        <meshBasicMaterial color={color} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** Deterministic pseudo-random in [0, 1) — keeps scene layout pure across renders. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** A faint shell of stars around the globe for depth. */
function Stars({ count, color, opacity }: { count: number; color: string; opacity: number }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      // Uniform direction on a sphere, pushed out to a random radius.
      const z = hash(i) * 2 - 1
      const t = hash(i + 0.5) * Math.PI * 2
      const r = Math.sqrt(1 - z * z)
      v.set(r * Math.cos(t), z, r * Math.sin(t)).multiplyScalar(4.5 + hash(i + 0.25) * 4)
      positions.set([v.x, v.y, v.z], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [count])

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.035} color={color} transparent opacity={opacity} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** A tilted orbit with a small satellite travelling around it. */
function OrbitRing({ color, reduced }: { color: string; reduced: boolean }) {
  const sat = useRef<THREE.Mesh>(null)
  const radius = R * 1.32
  const points = useMemo(
    () =>
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
      }),
    [radius],
  )
  useFrame(({ clock }) => {
    if (!sat.current) return
    const a = reduced ? 1 : clock.elapsedTime * 0.35
    sat.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius)
  })
  return (
    <group rotation={[1.18, 0.22, -0.32]}>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.35} />
      <mesh ref={sat}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

/** Dotted Earth with animated settlement routes between financial hubs. Drag to rotate. */
export function GlobeScene({ reduced }: { reduced: boolean }) {
  const { palette, theme } = useTheme()
  const dots = useLandDots(26000)
  const dotTexture = useDotTexture()
  const hubs = useMemo(() => HUBS.map((h) => latLonToVec(h.lat, h.lon, R * 1.004)), [])

  const rimUniforms = useMemo(
    () => ({
      base: { value: new THREE.Color(palette.globeOcean) },
      rim: { value: new THREE.Color(palette.globeRim) },
      power: { value: 2.4 },
    }),
    [palette.globeOcean, palette.globeRim],
  )
  const atmosphereUniforms = useMemo(
    () => ({ color: { value: new THREE.Color(palette.atmosphere) }, strength: { value: palette.atmosphereStrength } }),
    [palette.atmosphere, palette.atmosphereStrength],
  )

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.45}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
      />
      <Stars count={700} color={palette.additive ? '#c9c4ff' : '#4f46e5'} opacity={palette.additive ? 0.55 : 0.35} />
      <OrbitRing color={palette.globeArc} reduced={reduced} />
      {/* Initial orientation facing the viewer. */}
      <group rotation={[0.3, -1.75, 0]}>
        <mesh>
          <sphereGeometry args={[R, 96, 96]} />
          <shaderMaterial key={`${palette.globeOcean}-${theme}`} args={[{ ...rimShader, uniforms: rimUniforms }]} />
        </mesh>
        <points geometry={dots}>
          <pointsMaterial
            size={0.036}
            map={dotTexture}
            color={palette.globeDots}
            transparent
            alphaTest={0.3}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        {hubs.map((p, i) => (
          <Hub key={i} position={p} index={i} reduced={reduced} color={palette.globeArc} />
        ))}
        {ROUTES.map(([a, b], i) => (
          <Arc key={i} from={hubs[a]!} to={hubs[b]!} delay={i * 0.17} reduced={reduced} />
        ))}
      </group>
      <mesh scale={1.14}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial
          key={`${palette.atmosphere}-${palette.atmosphereStrength}`}
          args={[{ ...atmosphereShader, uniforms: atmosphereUniforms }]}
          side={THREE.BackSide}
          blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
