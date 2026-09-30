import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useProducts } from '@/api/queries'
import { navLinks } from '@/config/site'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function Nav() {
  const { data: products } = useProducts()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const location = useLocation()
  const megaId = useId()

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMegaOpen(false)
      setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const navClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' is-active' : ''}`

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${hidden && !menuOpen ? ' is-hidden' : ''}`}>
      <div className="nav-inner">
        <Logo />

        <nav className="nav-links" aria-label="Primary">
          <div className="nav-item" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <button
              type="button"
              className="nav-link"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((o) => !o)}
            >
              Products <ChevronDown size={14} className={`chev${megaOpen ? ' open' : ''}`} aria-hidden />
            </button>
            <AnimatePresence>
              {megaOpen && products && (
                <motion.div
                  id={megaId}
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
          {navLinks.map((l) =>
            l.to.includes('#') ? (
              <Link key={l.label} to={l.to} className="nav-link">
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.label} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="nav-cta">
          <ThemeToggle />
          <MagneticButton to="/contact" variant="ghost" size="sm">
            Contact sales
          </MagneticButton>
          <MagneticButton to="/#download" size="sm">
            Get the app
          </MagneticButton>
        </div>

        <div className="nav-mobile-actions">
          <ThemeToggle />
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
            {navLinks.map((l) => (
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
