import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check, Layers, MousePointer2 } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useCardTiers } from '@/api/queries'
import { CardExplode } from '@/components/card/CardExplode'
import { layerSpecs, type CardView, type LayerId } from '@/components/card/cardGeometry'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const VIEWS: { id: CardView; label: string }[] = [
  { id: 'layers', label: 'Layers' },
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
]

export function CardSection() {
  const { data: tiers, isError } = useCardTiers()
  const [index, setIndex] = useState(1)
  const tier = tiers?.[index]
  const reduced = useReducedMotion()

  // The card arrives assembled, then fans out into its layers once it is in view.
  const [view, setView] = useState<CardView>(reduced ? 'layers' : 'front')
  const [touched, setTouched] = useState(false)
  const [focus, setFocus] = useState<LayerId | null>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const inView = useInView(shellRef, { once: true, amount: 0.45 })

  useEffect(() => {
    if (!inView || touched) return
    const t = setTimeout(() => setView('layers'), 700)
    return () => clearTimeout(t)
  }, [inView, touched])

  const chooseView = (v: CardView) => {
    setTouched(true)
    setFocus(null)
    setView(v)
  }

  // Parts list (shown on small screens): tap toggles a layer, hover previews it.
  const inspect = (id: LayerId) => {
    setTouched(true)
    setView('layers')
    setFocus((f) => (f === id ? null : id))
  }

  const metal = tier?.material === 'metal'
  const style = tier ? ({ '--c0': tier.colors[0], '--c1': tier.colors[1] } as CSSProperties) : undefined

  return (
    <section className="section card-section" id="card" aria-labelledby="card-title">
      <div className="container">
        <SectionHeading
          id="card-title"
          align="center"
          eyebrow="Nowcoin Card"
          title={
            <>
              The card that <strong>pays you back</strong> <em>every time you spend.</em>
            </>
          }
          body="A Visa debit card that converts crypto at the point of sale — engineered layer by layer, from the secure element to the steel core."
        />

        {isError && <p className="error-note">Card tiers are unavailable right now.</p>}

        <div className="cx-shell" ref={shellRef} style={style}>
          <div className="cx-toolbar">
            <span className="cx-badge">
              <Layers size={14} aria-hidden /> {view === 'layers' ? 'Exploded view' : `${view} view`}
            </span>
            {tiers && (
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
            )}
            <div className="segmented is-small" role="group" aria-label="Card view">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  className={`segmented-item${view === v.id ? ' is-active' : ''}`}
                  onClick={() => chooseView(v.id)}
                >
                  {view === v.id && <motion.span layoutId="view-pill" className="segmented-pill" />}
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {tier ? (
            <CardExplode tier={tier} view={view} focus={focus} onFocus={setFocus} />
          ) : (
            <div className="skeleton cx-skeleton" />
          )}

          {tier && (
            <ol className="cx-legend" aria-label={`${tier.name} card construction`}>
              {layerSpecs(metal).map((l, i) => (
                <li
                  key={l.id}
                  className={focus === l.id ? 'is-focus' : undefined}
                  onPointerDown={(e) => e.pointerType !== 'mouse' && inspect(l.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && view === 'layers' && setFocus(l.id)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setFocus(null)}
                >
                  <b>0{i + 1}</b> {l.title}
                  <span className="sr-only"> — {l.body}</span>
                </li>
              ))}
            </ol>
          )}

          <span className="cx-hint">
            <MousePointer2 size={13} aria-hidden />
            {view === 'layers' ? (
              <>
                <span className="on-hover">Hover a label to lift its layer</span>
                <span className="on-touch">Tap a part to lift its layer</span>
              </>
            ) : (
              <>
                <span className="on-hover">Move your pointer to tilt the card</span>
                <span className="on-touch">Switch views to inspect the card</span>
              </>
            )}
          </span>
        </div>

        {tier && (
          <Reveal className="cx-info">
            <motion.dl
              key={tier.id}
              className="tier-metrics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
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
            </motion.dl>
            <ul className="check-list">
              {tier.perks.map((p) => (
                <li key={p}>
                  <Check size={16} aria-hidden /> {p}
                </li>
              ))}
            </ul>
            <div className="cx-cta">
              <span className="cx-material">
                {metal ? '18 g stainless steel' : 'Recycled polycarbonate'} · 0.8 mm · contactless
              </span>
              <ButtonLink to="/products/card">
                Order {tier.name} <ArrowRight size={16} aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
