import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTarget } from '@/lib/smoothScroll'

/** Scrolls to the top on navigation, or to the #hash target once it renders. */
export function ScrollManager() {
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
