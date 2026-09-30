import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const WORDS = ['Spend', 'Trade', 'Earn', 'Build', 'Settle', 'Own']

/** Two giant, tilted text bands that slide in opposite directions with scroll. */
export function KineticBand() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const left = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const right = useTransform(scrollYProgress, [0, 1], ['-30%', '0%'])

  const row = (outline: boolean) =>
    Array.from({ length: 3 }, (_, r) =>
      WORDS.map((w, i) => (
        <span key={`${r}-${i}`} className={outline ? 'kb-word outline' : 'kb-word'}>
          {w}
          <i aria-hidden>✦</i>
        </span>
      )),
    )

  return (
    <div className="kinetic" ref={ref} aria-hidden>
      <div className="kinetic-inner">
        <motion.div className="kb-row" style={{ x: left }}>
          {row(false)}
        </motion.div>
        <motion.div className="kb-row" style={{ x: right }}>
          {row(true)}
        </motion.div>
      </div>
    </div>
  )
}
