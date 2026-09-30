import { animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { Stat } from '@/api/types'

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ value, prefix = '', suffix = '', decimals = 0 }: Omit<Stat, 'label'>) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, prefix, suffix, decimals])

  return (
    <span ref={ref}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  )
}
