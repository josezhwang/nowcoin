import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CardAnatomyScene } from '@/three/CardAnatomyScene'
import { LazyCanvas } from '@/three/LazyCanvas'
import { CardFallback } from '@/components/ui/CardFallback'

const LAYERS = [
  {
    at: 0.1,
    title: 'Holographic face',
    body: 'A laser-etched polycarbonate skin that shifts colour as it catches the light.',
  },
  {
    at: 0.3,
    title: 'EMV secure chip',
    body: 'Bank-grade secure element. Your card number never leaves it unencrypted.',
  },
  {
    at: 0.5,
    title: 'NFC antenna',
    body: 'A three-turn copper coil for tap-to-pay in under 300 ms, anywhere in the world.',
  },
  { at: 0.7, title: '18 g metal core', body: 'Brushed stainless steel. Heavy in the hand, impossible to forget.' },
]

/** Pinned section: scrolling pulls the 3D card apart into its layers. */
export function CardAnatomy() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [active, setActive] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    let idx = -1
    LAYERS.forEach((l, i) => {
      if (p >= l.at) idx = i
    })
    setActive(idx)
  })

  return (
    <section className="anatomy" ref={ref}>
      <div className="anatomy-sticky">
        <div className="container anatomy-grid">
          <div className="anatomy-copy">
            <span className="eyebrow">Engineered in layers</span>
            <h2>
              Take it apart. <span className="gradient-text">Scroll.</span>
            </h2>
            <ol className="anatomy-list">
              {LAYERS.map((l, i) => (
                <li key={l.title} className={i === active ? 'active' : i < active ? 'past' : ''}>
                  <span className="anatomy-num">0{i + 1}</span>
                  <div>
                    <h3>{l.title}</h3>
                    <p>{l.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="anatomy-progress" aria-hidden>
              <motion.span style={{ width: bar }} />
            </div>
          </div>
          <LazyCanvas
            className="anatomy-canvas"
            camera={{ position: [0, 0, 7], fov: 40 }}
            fallback={<CardFallback colors={['#6d28d9', '#0891b2']} className="is-centered" />}
          >
            <CardAnatomyScene progress={scrollYProgress} reduced={reduced} />
          </LazyCanvas>
        </div>
      </div>
    </section>
  )
}
