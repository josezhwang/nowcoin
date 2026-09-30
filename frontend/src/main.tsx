import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import '@/styles/layout.css'
import '@/styles/sections.css'
import '@/styles/pages.css'
import '@/styles/three-d.css'
import '@/styles/components.css'
import App from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
