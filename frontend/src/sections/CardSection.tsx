import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useCardTiers } from '@/api/queries'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CardScene } from '@/three/CardScene'
import { LazyCanvas } from '@/three/LazyCanvas'
import { CardFallback } from '@/components/ui/CardFallback'

export function CardSection() {
  const { data: tiers, isError: error } = useCardTiers()
  const [index, setIndex] = useState(1)
  const reduced = useReducedMotion()
  const tier = tiers?.[index]

  return (
    <section className="section card-section" id="card">
      {tier && (
        <div
          className="card-glow"
          style={{ background: `radial-gradient(closest-side, ${tier.colors[0]}55, transparent)` }}
          aria-hidden
        />
      )}
      <div className="container card-grid">
        <div className="card-copy">
          <SectionHeading
            eyebrow="Nowcoin Card"
            title={
              <>
                The card that <span className="gradient-text">pays you back.</span>
              </>
            }
            body="Spend crypto at 100M+ merchants worldwide. Pick your tier, then drag the card to take a closer look."
          />

          {error && <p className="error-note">Card tiers are unavailable right now.</p>}

          {tiers && tier && (
            <>
              <div className="tier-tabs" role="tablist" aria-label="Card tiers">
                {tiers.map((t, i) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={i === index}
                    className={`tier-tab${i === index ? ' active' : ''}`}
                    onClick={() => setIndex(i)}
                  >
                    {i === index && <motion.span layoutId="tier-pill" className="tier-pill" />}
                    <span
                      className="tier-swatch"
                      style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }}
                    />
                    {t.name}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tier.id}
                  className="tier-details"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="tier-metrics">
                    <div>
                      <strong>{tier.cashback}</strong>
                      <span>cashback</span>
                    </div>
                    <div>
                      <strong>{tier.stake}</strong>
                      <span>stake</span>
                    </div>
                    <div>
                      <strong>{tier.monthlyFee}</strong>
                      <span>monthly fee</span>
                    </div>
                  </div>
                  <ul className="tier-perks">
                    {tier.perks.map((p) => (
                      <li key={p}>
                        <Check size={16} aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <MagneticButton to="/products/card">
                Order your card <ArrowRight size={16} className="arrow" aria-hidden />
              </MagneticButton>
            </>
          )}
        </div>

        <LazyCanvas
          className="card-canvas"
          cursor="Drag"
          camera={{ position: [0, 0, 6], fov: 40 }}
          fallback={tier && <CardFallback colors={tier.colors} name={tier.name} />}
        >
          {tier && <CardScene tier={tier} reduced={reduced} />}
        </LazyCanvas>
      </div>
    </section>
  )
}
