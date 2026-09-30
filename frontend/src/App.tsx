import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { scrollToTarget, startSmoothScroll } from './lib/smoothScroll'
import { CompanyPage } from './pages/CompanyPage'
import { ContactPage } from './pages/ContactPage'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProductPage } from './pages/ProductPage'
import { World } from './three/World'

/** Scrolls to the top on navigation, or to the #hash target once it renders. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollToTarget(0, true)
      return
    }
    // Sections that depend on API data may mount (and push the target down)
    // after navigation, so keep re-aiming briefly unless the user takes over.
    let tries = 0
    let userScrolled = false
    const stop = () => (userScrolled = true)
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    const timer = window.setInterval(() => {
      const el = document.querySelector(hash)
      tries++
      if (userScrolled || tries > 40) return window.clearInterval(timer)
      if (el && (tries === 1 || Math.abs(el.getBoundingClientRect().top - 80) > 8)) scrollToTarget(hash)
    }, 100)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [pathname, hash, key])

  return null
}

export default function App() {
  useEffect(() => startSmoothScroll(), [])

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <Preloader />
        <World />
        <Cursor />
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  )
}
