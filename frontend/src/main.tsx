import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/layout.css'
import '@/styles/hero.css'
import '@/styles/sections.css'
import '@/styles/vault.css'
import '@/styles/peach.css'
import '@/styles/home.css'
import '@/styles/pages.css'
import '@/styles/effects.css'
import App from '@/app/App'
import { isSoftwareRenderer, supportsWebGL } from '@/lib/webgl'

// Machines without GPU acceleration get a lighter set of decorative loops (see effects.css).
if (!supportsWebGL() || isSoftwareRenderer()) document.documentElement.dataset.lowpower = ''

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
