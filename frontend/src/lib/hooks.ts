import { useEffect, useState, type PointerEvent } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** True once the display fonts used in canvas textures have loaded. */
export function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all([
      document.fonts.load('600 64px Unbounded'),
      document.fonts.load('500 32px "JetBrains Mono"'),
    ])
      .catch(() => undefined)
      .finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])
  return ready
}

/** Tilts a `.tilt` element toward the cursor in 3D and feeds its glare/spotlight position. */
export function trackTilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width
  const py = (e.clientY - rect.top) / rect.height
  el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`)
  el.style.setProperty('--ry', `${(px - 0.5) * 12}deg`)
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  el.classList.add('is-tilting')
}

export function resetTilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
  el.classList.remove('is-tilting')
}

export const tiltHandlers = { onPointerMove: trackTilt, onPointerLeave: resetTilt }

export const formatPrice = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n < 1 ? 4 : n < 100 ? 2 : 0,
  })
