import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/api/queries'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { images } from '@/config/images'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** How long each product stays on screen before the tour advances. */
const AUTO_ADVANCE_MS = 7000

/** Tabbed tour of the main products: details on the left, product UI on the right. */
export function Showcase() {
  const { data: products, isError, refetch } = useProducts()
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const baseId = useId()
  // Observe the section (always mounted) — the frame only renders once products load.
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.35 })
  const reduced = useReducedMotion()
  const product = products?.[active]
  // The progress bar's CSS animation drives auto-advance; pausing it pauses the tour.
  const paused = hovered || focused || !inView
  const next = () => products && setActive((a) => (a + 1) % products.length)

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!products) return
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (active + delta + products.length) % products.length
    setActive(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  return (
    <section className="section showcase" id="products" aria-labelledby="showcase-title" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          id="showcase-title"
          eyebrow="Products"
          title={
            <>
              Unleashing <strong>Nowcoin&rsquo;s</strong> capabilities <em>for people and businesses</em>
            </>
          }
          aside={
            <ButtonLink to="/products" variant="secondary">
              Compare all products <ArrowUpRight size={16} aria-hidden />
            </ButtonLink>
          }
        />

        {isError && (
          <p className="error-note" role="alert">
            Products are unavailable right now.{' '}
            <button type="button" className="link-button" onClick={() => refetch()}>
              Try again
            </button>
          </p>
        )}

        {!products && !isError && <div className="skeleton" style={{ height: 560 }} />}

        {products && product && (
          <div
            className="showcase-frame"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
          >
            <div className="showcase-tabs" role="tablist" aria-label="Products" onKeyDown={onKeyDown}>
              {products.map((p, i) => (
                <button
                  key={p.slug}
                  id={`${baseId}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={i === active ? 0 : -1}
                  className={`showcase-tab${i === active ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {p.name.replace('Nowcoin ', '')}
                  {i === active && !reduced && (
                    <span
                      key={`${p.slug}-${active}`}
                      className="tab-progress"
                      style={{
                        animationDuration: `${AUTO_ADVANCE_MS}ms`,
                        animationPlayState: paused ? 'paused' : 'running',
                      }}
                      onAnimationEnd={next}
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>

            <div
              className="showcase-panel edge-glow"
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active}`}
              style={{ '--accent': product.accent } as CSSProperties}
            >
              <motion.div
                key={product.slug}
                className="showcase-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="showcase-details">
                  <span className="showcase-cat">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="showcase-tagline">{product.tagline}</p>
                  <p className="showcase-desc">{product.description}</p>
                  <ul className="check-list">
                    {product.highlights.map((h) => (
                      <li key={h}>
                        <Check size={16} aria-hidden /> {h}
                      </li>
                    ))}
                  </ul>
                  <dl className="showcase-metrics">
                    {product.metrics.map((m) => (
                      <div key={m.label}>
                        <dt>{m.label}</dt>
                        <dd>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link to={`/products/${product.slug}`} className="link-arrow">
                    Explore {product.name} <ArrowUpRight size={16} aria-hidden />
                  </Link>
                </div>

                <div className="showcase-media">
                  {images.products[product.slug] && <ImageSlot image={images.products[product.slug]!} radius="14px" />}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
