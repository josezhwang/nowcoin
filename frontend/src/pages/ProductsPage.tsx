import { ArrowUpRight, Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/api/queries'
import type { Product } from '@/api/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { images } from '@/config/images'
import { Cta } from '@/sections/Cta'

const GROUPS: { category: Product['category']; title: string; body: string }[] = [
  { category: 'Consumer', title: 'For people', body: 'Everything you need to hold, spend and grow crypto day to day.' },
  { category: 'Business', title: 'For businesses', body: 'Accept payments, pay globally and safeguard your treasury.' },
  { category: 'Developers', title: 'For developers', body: 'Build crypto into your own product with our APIs.' },
]

function ProductRow({ p, flip }: { p: Product; flip: boolean }) {
  return (
    <Reveal>
      <article
        className={`product-row card${flip ? ' is-flipped' : ''}`}
        style={{ '--accent': p.accent } as CSSProperties}
      >
        <div className="product-row-copy">
          <div className="product-row-head">
            {images.productIcons[p.slug] && (
              <ImageSlot
                image={images.productIcons[p.slug]!}
                compact
                fit="contain"
                radius="12px"
                className="product-icon"
              />
            )}
            <span className="showcase-cat">{p.category}</span>
          </div>
          <h3>{p.name}</h3>
          <p className="showcase-tagline">{p.tagline}</p>
          <p className="showcase-desc">{p.description}</p>
          <ul className="check-list">
            {p.highlights.map((h) => (
              <li key={h}>
                <Check size={16} aria-hidden /> {h}
              </li>
            ))}
          </ul>
          <dl className="showcase-metrics">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          <Link to={`/products/${p.slug}`} className="link-arrow">
            View details <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="product-row-media">
          {images.products[p.slug] && <ImageSlot image={images.products[p.slug]!} radius="14px" />}
        </div>
      </article>
    </Reveal>
  )
}

export default function ProductsPage() {
  const { data: products, isError, refetch } = useProducts()

  return (
    <>
      <PageMeta
        title="Products"
        description="Wallet, card, exchange, payments, custody and APIs — every Nowcoin product."
      />
      <PageHeader
        eyebrow="Products"
        title={
          <>
            One platform. <strong>Six products.</strong> <em>Every way to use crypto.</em>
          </>
        }
        lead="From your first satoshi to treasury-grade custody, every Nowcoin product shares one account, one balance and one security model."
      >
        {products && (
          <nav className="product-jump" aria-label="Jump to product">
            {products.map((p) => (
              <a key={p.slug} href={`#${p.slug}`}>
                <span className="mega-dot" style={{ background: p.accent }} /> {p.name.replace('Nowcoin ', '')}
              </a>
            ))}
          </nav>
        )}
      </PageHeader>

      <section className="section">
        <div className="container">
          {isError && (
            <p className="error-note" role="alert">
              Products are unavailable right now.{' '}
              <button type="button" className="link-button" onClick={() => refetch()}>
                Try again
              </button>
            </p>
          )}
          {!products && !isError && <div className="skeleton" style={{ height: 520 }} />}
          {products &&
            GROUPS.map((g) => {
              const list = products.filter((p) => p.category === g.category)
              if (!list.length) return null
              return (
                <div key={g.category} className="product-group">
                  <header className="product-group-head">
                    <h2>{g.title}</h2>
                    <p>{g.body}</p>
                  </header>
                  <div className="product-rows">
                    {list.map((p, i) => (
                      <div key={p.slug} id={p.slug} className="anchor-target">
                        <ProductRow p={p} flip={i % 2 === 1} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </section>
      <Cta />
    </>
  )
}
