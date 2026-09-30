import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApi } from '../lib/api'
import type { Product } from '../lib/types'
import { Logo } from './Logo'
import { MagneticButton } from './MagneticButton'

const LINKS = [
  { label: 'Card', to: '/#card' },
  { label: 'Business', to: '/products/pay' },
  { label: 'Developers', to: '/#developers' },
  { label: 'Company', to: '/company' },
]

export function Nav() {
  const { data: products } = useApi<Product[]>('/products')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > 400 && y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on navigation (state reset during render, not in an effect).
  const [lastKey, setLastKey] = useState(location.key)
  if (lastKey !== location.key) {
    setLastKey(location.key)
    setMenuOpen(false)
    setMegaOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${hidden && !menuOpen ? ' is-hidden' : ''}`}>
      <div className="nav-inner">
        <Logo />

        <nav className="nav-links" aria-label="Primary">
          <div className="nav-item" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <button
              className="nav-link"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((o) => !o)}
            >
              Products <span className={`chev${megaOpen ? ' open' : ''}`}>⌄</span>
            </button>
            <AnimatePresence>
              {megaOpen && products && (
                <motion.div
                  className="mega glass"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {products.map((p) => (
                    <Link key={p.slug} to={`/products/${p.slug}`} className="mega-item">
                      <span className="mega-dot" style={{ background: p.accent, boxShadow: `0 0 14px ${p.accent}` }} />
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.tagline}</small>
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <MagneticButton to="/contact" variant="ghost" size="sm">
            Contact sales
          </MagneticButton>
          <MagneticButton to="/#download" size="sm">
            Get the app
          </MagneticButton>
        </div>

        <button
          className={`burger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Products</p>
            {products?.map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} className="mobile-link small">
                {p.name}
              </Link>
            ))}
            <p className="eyebrow">Explore</p>
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="mobile-link">
                {l.label}
              </Link>
            ))}
            <div className="mobile-cta">
              <Link to="/contact" className="btn btn-ghost">
                Contact sales
              </Link>
              <Link to="/#download" className="btn btn-primary">
                Get the app
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
