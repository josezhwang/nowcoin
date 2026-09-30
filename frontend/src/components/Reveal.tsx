import { motion, type HTMLMotionProps } from 'framer-motion'
import { Fragment } from 'react'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
}

/** Tips up out of the page in 3D the first time it scrolls into view. */
export function Reveal({ delay = 0, y = 50, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, rotateX: 18, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: '50% 100%' }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

interface SplitWordsProps {
  text: string
  className?: string
  delay?: number
  /** Hold the animation until true (e.g. until the preloader has finished). */
  play?: boolean
}

/** Splits a headline into words that flip up into place one after another. */
export function SplitWords({ text, className, delay = 0, play = true }: SplitWordsProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="split-word" aria-hidden>
            <motion.span
              initial={{ y: '100%', rotateX: -90, opacity: 0 }}
              animate={play ? { y: '0%', rotateX: 0, opacity: 1 } : undefined}
              transition={{ duration: 1.1, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '50% 100%' }}
            >
              {word}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </span>
  )
}
