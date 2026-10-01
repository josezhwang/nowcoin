import { animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Props {
  value: number
  /** Starting value for the first count (default 0). */
  from?: number
  prefix?: string
  suffix?: string
  decimals?: number
  /** Thousands separators (default true). */
  grouping?: boolean
  /** Seconds to wait before counting. */
  delay?: number
  duration?: number
}

/**
 * Counts up to `value` the first time it scrolls into view, then eases smoothly
 * to any new value (live prices, calculator results).
 */
export function Counter({
  value,
  from = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  grouping = true,
  delay = 0,
  duration = 2.2,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const shown = useRef<number | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    const fmt = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    })
    const write = (v: number) => {
      shown.current = v
      el.textContent = `${prefix}${fmt.format(v)}${suffix}`
    }
    if (reduced) {
      write(value)
      return
    }
    const first = shown.current === null
    const controls = animate(shown.current ?? from, value, {
      duration: first ? duration : 0.8,
      delay: first ? delay : 0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: write,
    })
    return () => controls.stop()
  }, [inView, value, from, prefix, suffix, decimals, grouping, delay, duration, reduced])

  return (
    <span ref={ref} className="tabular">
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  )
}
