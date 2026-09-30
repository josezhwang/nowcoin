import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  variant?: 'primary' | 'ghost'
  size?: 'sm'
  children: ReactNode
  onClick?: () => void
}

const MotionLink = motion.create(Link)

/** A pill button that leans toward the cursor. */
export function MagneticButton({ to, variant = 'primary', size, children, onClick }: Props) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <MotionLink
      to={to}
      onClick={onClick}
      className={`btn btn-${variant}${size ? ` btn-${size}` : ''}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </MotionLink>
  )
}
