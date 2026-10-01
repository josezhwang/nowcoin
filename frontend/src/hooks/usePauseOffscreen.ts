import { useEffect, type RefObject } from 'react'

/**
 * Pauses every CSS animation inside `ref` while it is scrolled out of view
 * (via a `data-paused` attribute — see effects.css). Keeps decorative loops
 * from costing CPU when nobody can see them.
 */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>, margin = '120px') {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) el.removeAttribute('data-paused')
        else el.setAttribute('data-paused', '')
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
}
