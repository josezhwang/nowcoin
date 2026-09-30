import { useEffect, useRef } from 'react'

/**
 * A dot plus a lagging ring that grows over interactive elements and shows a
 * label for elements with `data-cursor="Drag"` (etc). Mouse devices only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('has-cursor')

    const pos = { x: -100, y: -100 }
    const lag = { x: -100, y: -100 }
    let frame = 0

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const target = e.target as Element | null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      const interactive = target?.closest('a, button, [role="tab"], select, label, .tilt')
      const text = target?.closest('input, textarea')
      ring.current?.classList.toggle('is-hover', !!interactive && !labelled)
      ring.current?.classList.toggle('is-label', !!labelled)
      ring.current?.classList.toggle('is-text', !!text)
      dot.current?.classList.toggle('is-text', !!text)
      if (label.current) label.current.textContent = labelled?.dataset.cursor ?? ''
    }
    const onDown = () => ring.current?.classList.add('is-down')
    const onUp = () => ring.current?.classList.remove('is-down')
    const onLeave = () => {
      pos.x = pos.y = -100
    }

    const tick = () => {
      lag.x += (pos.x - lag.x) * 0.18
      lag.y += (pos.y - lag.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}
