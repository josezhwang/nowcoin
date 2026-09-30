import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useProducts } from '@/api/queries'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { images } from '@/config/images'
import { navLinks } from '@/config/site'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  const { data: products } = useProducts()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const location = useLocation()
  const menuId = useId()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on navigation (state reset during render, not in an effect).
  const [lastKey, setLastKey] = useState(location.key)
  if (lastKey !== location.key) {
    setLastKey(location.key)
    setMenuOpen(false)
    setProductsOpen(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setProductsOpen(false)
      setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' is-active' : ''}`
  const [productsLink, ...otherLinks] = navLinks

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner container">
        <div className="nav-pill nav-brand">
          <Logo />
        </div>

        <nav className="nav-pill nav-links" aria-label="Primary">
          <div
            className="nav-item"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              className={`nav-link${location.pathname.startsWith('/products') ? ' is-active' : ''}`}
              aria-expanded={productsOpen}
              aria-controls={menuId}
              onClick={() => setProductsOpen((o) => !o)}
            >
              {productsLink.label}
              <ChevronDown size={14} className={`chev${productsOpen ? ' open' : ''}`} aria-hidden />
            </button>
            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  id={menuId}
                  className="mega"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mega-grid">
                    {products?.map((p) => (
                      <Link key={p.slug} to={`/products/${p.slug}`} className="mega-item">
                        <span className="mega-icon" style={{ color: p.accent }}>
                          {images.productIcons[p.slug] ? (
                            <ImageSlot
                              image={images.productIcons[p.slug]!}
                              compact
                              radius="10px"
                              fit="contain"
                              fallback={<span className="mega-dot" style={{ background: p.accent }} />}
                            />
                          ) : (
                            <span className="mega-dot" style={{ background: p.accent }} />
                          )}
                        </span>
                        <span>
                          <strong>{p.name}</strong>
                          <small>{p.tagline}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/products" className="mega-footer">
                    Compare all products <ArrowUpRight size={15} aria-hidden />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {otherLinks.map((l) =>
            l.to.includes('#') ? (
              <Link key={l.label} to={l.to} className="nav-link">
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.label} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <a href="#" className="btn btn-ghost btn-sm nav-login">
            Log in
          </a>
          <Link to="/#download" className="btn btn-inverse btn-sm">
            Get started <ArrowUpRight size={15} aria-hidden />
          </Link>
          <button
            type="button"
            className={`burger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container mobile-menu-inner" aria-label="Mobile">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to} className="mobile-link">
                  {l.label}
                </Link>
              ))}
              <p className="mobile-label">Products</p>
              <div className="mobile-products">
                {products?.map((p) => (
                  <Link key={p.slug} to={`/products/${p.slug}`}>
                    <span className="mega-dot" style={{ background: p.accent }} />
                    {p.name}
                  </Link>
                ))}
              </div>
              <div className="mobile-cta">
                <a href="#" className="btn btn-secondary">
                  Log in
                </a>
                <Link to="/#download" className="btn btn-primary">
                  Get started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
