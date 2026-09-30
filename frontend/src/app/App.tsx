import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'
import { ScrollManager } from '@/components/layout/ScrollManager'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { usePointerTracking } from '@/hooks/usePointerTracking'
import { startSmoothScroll } from '@/lib/smoothScroll'
import CompanyPage from '@/pages/CompanyPage'
import ContactPage from '@/pages/ContactPage'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import ProductPage from '@/pages/ProductPage'
import ProductsPage from '@/pages/ProductsPage'
import TeamPage from '@/pages/TeamPage'
import { AppProviders } from './providers'

// Pages are small and imported eagerly so navigation never shows a loading state.
// Only the three.js scenes (card, globe) are split out and loaded on demand.

function CrashScreen() {
  return (
    <div className="crash container" role="alert">
      <h1>Something went wrong.</h1>
      <p>Please refresh the page. If the problem persists, contact support.</p>
      <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  )
}

/** Routes with a short fade-and-rise whenever the page changes. */
function AnimatedRoutes() {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </motion.div>
  )
}

export default function App() {
  useEffect(() => startSmoothScroll(), [])
  usePointerTracking()

  return (
    <AppProviders>
      <BrowserRouter>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollManager />
        <ScrollProgress />
        <Nav />
        <main id="main" tabIndex={-1}>
          <ErrorBoundary name="Route" fallback={<CrashScreen />}>
            <AnimatedRoutes />
          </ErrorBoundary>
        </main>
        <Footer />
      </BrowserRouter>
    </AppProviders>
  )
}
