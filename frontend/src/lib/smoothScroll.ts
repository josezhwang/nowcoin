import Lenis from 'lenis'

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.1, anchors: false })
  let frame = 0
  const raf = (time: number) => {
    lenis?.raf(time)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)
  return () => {
    cancelAnimationFrame(frame)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | number, immediate = false) {
  const offset = -80
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : offset, immediate })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' })
    return
  }
  const el = document.querySelector(target)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
}
