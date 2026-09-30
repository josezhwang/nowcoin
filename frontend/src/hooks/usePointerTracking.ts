import { useEffect } from 'react'

/**
 * One document-level, rAF-throttled pointer listener that feeds CSS variables
 * to the nearest `.spot` / `[data-pointer]` element under the cursor:
 *   --mx / --my  pointer position in px, relative to the element
 *   --nx / --ny  the same, normalised to -1…1 from the element's centre
 * CSS uses these for border spotlights, the hero grid glow and parallax.
 * Mouse and pen only — touch devices keep the static styling.
 */
export function usePointerTracking() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    let last: PointerEvent | null = null

    const apply = () => {
      frame = 0
      const e = last
      if (!e) return
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>('.spot, [data-pointer]') : null
      if (!target) return
      const r = target.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      target.style.setProperty('--mx', `${x}px`)
      target.style.setProperty('--my', `${y}px`)
      target.style.setProperty('--nx', ((x / r.width) * 2 - 1).toFixed(3))
      target.style.setProperty('--ny', ((y / r.height) * 2 - 1).toFixed(3))
    }

    const onMove = (e: PointerEvent) => {
      last = e
      if (!frame) frame = requestAnimationFrame(apply)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
}
