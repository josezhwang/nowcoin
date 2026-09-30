import { motion } from 'framer-motion'
import { ArrowRight, Check, Hand } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { useCardTiers } from '@/api/queries'
import { ButtonLink } from '@/components/ui/Button'
import { CardFallback } from '@/components/ui/CardFallback'
import { SectionHeading } from '@/components/ui/SectionHeading'

const CardCanvas = lazy(() => import('@/three/CardCanvas'))

export function CardSection() {
  const { data: tiers, isError } = useCardTiers()
  const [index, setIndex] = useState(1)
  const tier = tiers?.[index]

  return (
    <section className="section card-section" id="card" aria-labelledby="card-title">
      <div className="container card-grid">
        <div className="card-copy">
          <SectionHeading
            id="card-title"
            eyebrow="Nowcoin Card"
            title={
              <>
                The card that <strong>pays you back</strong> <em>every time you spend.</em>
              </>
            }
            body="A Visa debit card that converts crypto at the point of sale. Choose a tier to compare — then drag the card to inspect it."
          />

          {isError && <p className="error-note">Card tiers are unavailable right now.</p>}

          {tiers && tier && (
            <>
              <div className="segmented" role="tablist" aria-label="Card tiers">
                {tiers.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    className={`segmented-item${i === index ? ' is-active' : ''}`}
                    onClick={() => setIndex(i)}
                  >
                    {i === index && <motion.span layoutId="tier-pill" className="segmented-pill" />}
                    <span
                      className="tier-swatch"
                      style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }}
                    />
                    {t.name}
                  </button>
                ))}
              </div>
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <dl className="tier-metrics">
                  <div>
                    <dt>Cashback</dt>
                    <dd>{tier.cashback}</dd>
                  </div>
                  <div>
                    <dt>Stake</dt>
                    <dd>{tier.stake}</dd>
                  </div>
                  <div>
                    <dt>Monthly fee</dt>
                    <dd>{tier.monthlyFee}</dd>
                  </div>
                </dl>
                <ul className="check-list">
                  {tier.perks.map((p) => (
                    <li key={p}>
                      <Check size={16} aria-hidden /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <ButtonLink to="/products/card">
                Order your card <ArrowRight size={16} aria-hidden />
              </ButtonLink>
            </>
          )}
        </div>

        <div className="card-stage">
          {tier ? (
            <Suspense fallback={<CardFallback colors={tier.colors} name={tier.name} />}>
              <CardCanvas tier={tier} />
            </Suspense>
          ) : (
            <div className="skeleton" style={{ height: 420 }} />
          )}
          <span className="card-hint">
            <Hand size={14} aria-hidden /> Drag to rotate
          </span>
        </div>
      </div>
    </section>
  )
}
