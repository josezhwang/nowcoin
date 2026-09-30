import type { CardTier } from '@/api/types'
import { CardFallback } from '@/components/ui/CardFallback'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CardScene } from './CardScene'
import { LazyCanvas } from './LazyCanvas'

/** Code-split entry for the card tier scene (pulls in three.js on demand). */
export default function CardCanvas({ tier }: { tier: CardTier }) {
  const reduced = useReducedMotion()
  return (
    <LazyCanvas
      className="card-canvas"
      camera={{ position: [0, 0, 6], fov: 40 }}
      fallback={<CardFallback colors={tier.colors} name={tier.name} />}
    >
      <CardScene tier={tier} reduced={reduced} />
    </LazyCanvas>
  )
}
