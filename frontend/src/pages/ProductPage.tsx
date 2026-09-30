import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { useProduct, useProducts } from '@/api/queries'
import { PageMeta } from '@/components/layout/PageMeta'
import { GlowFallback } from '@/components/ui/CardFallback'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { Reveal, SplitWords } from '@/components/ui/Reveal'
import { tiltHandlers } from '@/lib/tilt'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Cta } from '@/sections/Cta'
import { LazyCanvas } from '@/three/LazyCanvas'
import { OrbScene } from '@/three/OrbScene'
import NotFound from '@/pages/NotFound'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const { data: product, error, refetch } = useProduct(slug)
  const { data: all } = useProducts()
  const reduced = useReducedMotion()

  if (error instanceof ApiError && error.status === 404) return <NotFound />
  if (error) {
    return (
      <section className="page-hero container" role="alert">
        <h1>Couldn't load this product.</h1>
        <p className="page-lede">{error.message}</p>
        <button type="button" className="btn btn-primary" onClick={() => refetch()}>
          Try again
        </button>
      </section>
    )
  }
  if (!product) return <div className="page-loading" aria-busy="true" />

  const others = all?.filter((p) => p.slug !== product.slug).slice(0, 3) ?? []

  return (
    <div style={{ '--accent': product.accent } as CSSProperties}>
      <PageMeta title={product.name} description={`${product.tagline} ${product.description}`} />
      <section className="product-hero">
        <div
          className="glow"
          style={{ width: 560, height: 560, background: product.accent, top: -120, right: '10%', opacity: 0.3 }}
        />
        <div className="container product-hero-grid">
          <div>
            <span className="eyebrow">{product.category}</span>
            <h1 key={product.slug}>
              <SplitWords text={product.name} />
            </h1>
            <p className="product-tagline">{product.tagline}</p>
            <p className="product-desc">{product.description}</p>
            <div className="hero-actions">
              <MagneticButton to={product.category === 'Consumer' ? '/#download' : '/contact'}>
                {product.category === 'Consumer' ? 'Get the app' : 'Talk to sales'}{' '}
                <ArrowRight size={16} className="arrow" aria-hidden />
              </MagneticButton>
              <MagneticButton to="/#products" variant="ghost">
                All products
              </MagneticButton>
            </div>
          </div>
          <LazyCanvas
            className="orb-canvas"
            camera={{ position: [0, 0, 6], fov: 40 }}
            fallback={<GlowFallback color={product.accent} />}
          >
            <OrbScene color={product.accent} reduced={reduced} />
          </LazyCanvas>
        </div>
        <div className="container metrics-row">
          {product.metrics.map((m) => (
            <div key={m.label} className="metric">
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid">
            {product.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="feature glass spotlight tilt" {...tiltHandlers}>
                  <span className="feature-num">0{i + 1}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section related">
          <div className="container">
            <h2 className="related-title">Explore the ecosystem</h2>
            <div className="related-grid">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  className="related-card glass spotlight tilt"
                  style={{ '--accent': p.accent } as CSSProperties}
                  {...tiltHandlers}
                >
                  <span className="mega-dot" style={{ background: p.accent, boxShadow: `0 0 14px ${p.accent}` }} />
                  <h3>{p.name}</h3>
                  <p>{p.tagline}</p>
                  <span className="bento-arrow" aria-hidden>
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta />
    </div>
  )
}
