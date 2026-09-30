import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'
import { ScrollManager } from '@/components/layout/ScrollManager'
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

export default function App() {
  useEffect(() => startSmoothScroll(), [])

  return (
    <AppProviders>
      <BrowserRouter>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollManager />
        <Nav />
        <main id="main" tabIndex={-1}>
          <ErrorBoundary name="Route" fallback={<CrashScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </BrowserRouter>
    </AppProviders>
  )
}
