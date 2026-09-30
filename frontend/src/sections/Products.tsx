import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { useApi } from '../lib/api'
import { tiltHandlers } from '../lib/hooks'
import type { Product } from '../lib/types'
import { ProductVisual } from './ProductVisual'

export function Products() {
  const { data, error } = useApi<Product[]>('/products')

  return (
    <section className="section" id="products">
      <div className="container">
        <SectionHeading
          eyebrow="The ecosystem"
          title={
            <>
              Six products. <span className="gradient-text">One account.</span>
            </>
          }
          body="From your first satoshi to treasury-grade custody, every Nowcoin Digital product shares one login, one balance and one security model."
        />

        {error && <p className="error-note">Products are unavailable right now. Please try again shortly.</p>}

        <div className="bento">
          {data
            ? data.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.08} className={`bento-cell bento-${p.slug}`}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="bento-tile glass spotlight tilt"
                    data-cursor="View"
                    style={{ '--accent': p.accent } as React.CSSProperties}
                    {...tiltHandlers}
                  >
                    <div className="bento-head">
                      <span className="bento-cat">{p.category}</span>
                      <span className="bento-arrow" aria-hidden>
                        ↗
                      </span>
                    </div>
                    <div className="bento-visual">
                      <ProductVisual slug={p.slug} />
                    </div>
                    <div className="bento-copy">
                      <h3>{p.name}</h3>
                      <p>{p.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              ))
            : !error &&
              Array.from({ length: 6 }, (_, i) => <div key={i} className="bento-cell skeleton" style={{ minHeight: 320 }} />)}
        </div>
      </div>
    </section>
  )
}
