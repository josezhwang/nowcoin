import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { useProduct, useProducts } from '@/api/queries'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { images } from '@/config/images'
import NotFound from '@/pages/NotFound'
import { Cta } from '@/sections/Cta'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const { data: product, error, refetch } = useProduct(slug)
  const { data: all } = useProducts()

  if (error instanceof ApiError && error.status === 404) return <NotFound />
  if (error) {
    return (
      <PageHeader eyebrow="Products" title="Couldn't load this product." lead={error.message}>
        <button type="button" className="btn btn-primary" onClick={() => refetch()}>
          Try again
        </button>
      </PageHeader>
    )
  }
  if (!product) return <div className="page-loading" aria-busy="true" />

  const others = all?.filter((p) => p.slug !== product.slug).slice(0, 3) ?? []
  const isConsumer = product.category === 'Consumer'

  return (
    <div style={{ '--accent': product.accent } as CSSProperties}>
      <PageMeta title={product.name} description={`${product.tagline} ${product.description}`} />
      <PageHeader
        eyebrow={`${product.category} · ${product.name}`}
        title={
          <>
            {product.name}. <em>{product.tagline}</em>
          </>
        }
        lead={product.description}
      >
        <div className="hero-actions">
          <ButtonLink to={isConsumer ? '/#download' : '/contact'} size="lg">
            {isConsumer ? 'Get the app' : 'Talk to sales'} <ArrowRight size={18} aria-hidden />
          </ButtonLink>
          <ButtonLink to="/products" variant="secondary" size="lg">
            All products
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="product-media-section">
        <div className="container">
          <Reveal className="product-media-frame">
            {images.products[product.slug] && (
              <ImageSlot image={images.products[product.slug]!} radius="16px" priority />
            )}
          </Reveal>
          <dl className="metrics-band">
            {product.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container product-detail-grid">
          <div>
            <h2 className="detail-title tone">
              Why teams choose <strong>{product.name}</strong>
            </h2>
            <ul className="check-list is-large">
              {product.highlights.map((h) => (
                <li key={h}>
                  <Check size={18} aria-hidden /> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="detail-features">
            {product.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <article className="detail-feature card spot">
                  <span className="detail-num">0{i + 1}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="related-title">Explore the ecosystem</h2>
            <div className="related-grid">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  className="related-card card card-hover spot"
                  style={{ '--accent': p.accent } as CSSProperties}
                >
                  <span className="mega-dot" style={{ background: p.accent }} />
                  <h3>{p.name}</h3>
                  <p>{p.tagline}</p>
                  <span className="link-arrow">
                    Learn more <ArrowUpRight size={15} aria-hidden />
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
