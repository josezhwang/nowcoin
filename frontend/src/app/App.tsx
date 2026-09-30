import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Cursor } from '@/components/layout/Cursor'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollManager } from '@/components/layout/ScrollManager'
import { startSmoothScroll } from '@/lib/smoothScroll'
import { AppProviders } from './providers'

// Route-level code splitting: each page (and the three.js world) is its own chunk.
const Home = lazy(() => import('@/pages/Home'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const CompanyPage = lazy(() => import('@/pages/CompanyPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const World = lazy(() => import('@/three/World'))

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
        <Preloader />
        <Suspense fallback={null}>
          <World />
        </Suspense>
        <Cursor />
        <Nav />
        <main id="main" tabIndex={-1}>
          <ErrorBoundary name="Route" fallback={<CrashScreen />}>
            <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </BrowserRouter>
    </AppProviders>
  )
}
