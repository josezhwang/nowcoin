import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Zap } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useProducts } from '@/api/queries'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { images } from '@/config/images'
import { navLinks, site } from '@/config/site'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const EASE = [0.22, 1, 0.36, 1] as const
const NAV_SOCIALS = site.social.filter((s) => s.icon !== 'linkedin')

/** Highlight that glides between nav links as the pointer moves across them. */
function HoverPill() {
  return (
    <motion.span
      layoutId="nav-hover"
      className="nav-hover"
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      aria-hidden
    />
  )
}

/** Twinkling points of light scattered inside the Open App button. */
function Sparkles() {
  return (
    <span className="sparkles" aria-hidden>
      {Array.from({ length: 7 }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  )
}

export function Nav() {
  const { data: products } = useProducts()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  // The links pill grows out of the logo on first load; clip it only while growing.
  const [expanded, setExpanded] = useState(false)
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
  const linkIn = (i: number) => ({
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 1.35 + i * 0.07, ease: EASE },
  })

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner">
        <ul className="nav-socials" aria-label="Social media">
          {NAV_SOCIALS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.09, ease: EASE }}
            >
              <a href={s.href} aria-label={s.label} className="social" target="_blank" rel="noreferrer">
                <SocialIcon kind={s.icon} size={15} />
              </a>
            </motion.li>
          ))}
        </ul>

        <nav className="nav-pill" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          <motion.span
            className="nav-logo"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <Logo />
          </motion.span>

          <motion.div
            className={`nav-links${expanded ? ' is-expanded' : ''}`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
            onAnimationComplete={() => setExpanded(true)}
          >
            <motion.span {...linkIn(0)}>
              <NavLink to="/" end className={linkClass} onMouseEnter={() => setHovered('home')}>
                {hovered === 'home' && <HoverPill />}
                {site.shortName}
              </NavLink>
            </motion.span>

            <motion.div
              className="nav-item"
              {...linkIn(1)}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                type="button"
                className={`nav-link${location.pathname.startsWith('/products') ? ' is-active' : ''}`}
                aria-expanded={productsOpen}
                aria-controls={menuId}
                onClick={() => setProductsOpen((o) => !o)}
                onMouseEnter={() => setHovered('products')}
              >
                {hovered === 'products' && <HoverPill />}
                {productsLink.label}
                <ChevronDown size={13} className={`chev${productsOpen ? ' open' : ''}`} aria-hidden />
              </button>
              {productsOpen && (
                <motion.div
                  id={menuId}
                  className="mega"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
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
            </motion.div>

            {otherLinks.map((l, i) => (
              <motion.span key={l.label} {...linkIn(i + 2)}>
                {l.to.includes('#') ? (
                  <Link to={l.to} className="nav-link" onMouseEnter={() => setHovered(l.label)}>
                    {hovered === l.label && <HoverPill />}
                    {l.label}
                  </Link>
                ) : (
                  <NavLink to={l.to} className={linkClass} onMouseEnter={() => setHovered(l.label)}>
                    {hovered === l.label && <HoverPill />}
                    {l.label}
                  </NavLink>
                )}
              </motion.span>
            ))}
          </motion.div>
        </nav>

        <motion.div
          className="nav-actions"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
        >
          <ThemeToggle />
          <Link to="/#download" className="open-app">
            <Sparkles />
            <Zap size={16} fill="currentColor" aria-hidden />
            <span>
              Open App
              <small>Enter {site.shortName} Hub</small>
            </span>
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
        </motion.div>
      </div>

      {menuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="container mobile-menu-inner" aria-label="Mobile">
            <Link to="/" className="mobile-link">
              Home
            </Link>
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
              <Link to="/contact" className="btn btn-secondary">
                Contact sales
              </Link>
              <Link to="/#download" className="btn btn-primary">
                Open App
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
