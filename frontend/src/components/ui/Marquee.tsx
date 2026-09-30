import type { ReactNode } from 'react'

/** Infinite horizontal scroller; content is duplicated so the loop is seamless. */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
}) {
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
