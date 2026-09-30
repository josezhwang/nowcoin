import { AnimatePresence, animate, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { finishIntro } from '@/lib/intro'

const MIN_MS = 1600

/** Full-screen intro: a CSS 3D coin spins while a counter runs to 100. */
export function Preloader() {
  const [visible, setVisible] = useState(true)
  const count = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: MIN_MS / 1000,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (count.current) count.current.textContent = String(Math.round(v)).padStart(3, '0')
      },
    })
    const fonts = document.fonts.ready.catch(() => undefined)
    const timer = new Promise((r) => setTimeout(r, MIN_MS + 150))
    Promise.all([fonts, timer]).then(() => {
      setVisible(false)
      finishIntro()
    })
    return () => controls.stop()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = visible ? 'hidden' : ''
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="coin3d" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="coin3d-layer" style={{ transform: `translateZ(${i - 5}px)` }} />
            ))}
            <span className="coin3d-face front">N</span>
            <span className="coin3d-face back">N</span>
          </div>
          <div className="preloader-meta">
            <span className="preloader-brand">Nowcoin Digital</span>
            <span className="preloader-count">
              <span ref={count}>000</span>%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
