import { Environment, Lightformer } from '@react-three/drei'

interface Props {
  tint?: string
  /** 'rim' lights from behind, for glossy blobs that would otherwise mirror the lights head-on. */
  variant?: 'studio' | 'rim'
}

/** Procedural studio environment — reflections without downloading an HDRI. */
export function StudioLights({ tint = '#8b5cf6', variant = 'studio' }: Props) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <pointLight position={[-4, -2, 3]} intensity={25} color={tint} />
      <Environment resolution={256} frames={1}>
        {variant === 'studio' ? (
          <>
            <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} />
            <Lightformer
              form="rect"
              intensity={2}
              color="#22d3ee"
              position={[-5, 0, 2]}
              rotation-y={Math.PI / 2}
              scale={[8, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2}
              color={tint}
              position={[5, 0, 2]}
              rotation-y={-Math.PI / 2}
              scale={[8, 3, 1]}
            />
            <Lightformer form="ring" intensity={4} color="#c6f65b" position={[0, -3, 3]} scale={2} />
          </>
        ) : (
          <>
            <Lightformer
              form="rect"
              intensity={2.5}
              position={[0, 6, -4]}
              rotation-x={Math.PI / 2}
              scale={[14, 6, 1]}
            />
            <Lightformer
              form="rect"
              intensity={3}
              color="#22d3ee"
              position={[-6, 1, -3]}
              rotation-y={Math.PI / 3}
              scale={[3, 10, 1]}
            />
            <Lightformer
              form="rect"
              intensity={3}
              color={tint}
              position={[6, -1, -3]}
              rotation-y={-Math.PI / 3}
              scale={[3, 10, 1]}
            />
            <Lightformer
              form="circle"
              intensity={1.2}
              color={tint}
              position={[0, -6, 2]}
              rotation-x={-Math.PI / 2}
              scale={8}
            />
          </>
        )}
      </Environment>
    </>
  )
}
