import { GlowFallback } from '@/components/ui/CardFallback'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { GlobeScene } from './GlobeScene'
import { LazyCanvas } from './LazyCanvas'

/** Code-split entry for the globe (pulls in three.js on demand). */
export default function GlobeCanvas() {
  const reduced = useReducedMotion()
  return (
    <LazyCanvas
      className="globe-canvas"
      camera={{ position: [0, 0, 7.6], fov: 40 }}
      fallback={<GlowFallback color="#6d5dfc" />}
    >
      <GlobeScene reduced={reduced} />
    </LazyCanvas>
  )
}
