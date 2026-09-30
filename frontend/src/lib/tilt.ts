import type { PointerEvent } from 'react'

/** Tilts a `.tilt` element toward the cursor in 3D and feeds its glare/spotlight position. */
function trackTilt(e: PointerEvent<HTMLElement>) {
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

function resetTilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
  el.classList.remove('is-tilting')
}

export const tiltHandlers = { onPointerMove: trackTilt, onPointerLeave: resetTilt }
