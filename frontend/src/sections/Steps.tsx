import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MagneticButton } from '../components/MagneticButton'
import { Reveal } from '../components/Reveal'

export function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="section steps-section">
      <div className="container steps-grid">
        <div className="steps-intro">
          <Reveal className="section-heading">
            <span className="eyebrow">Get started</span>
            <h2>
              Up and running in <span className="gradient-text">three steps.</span>
            </h2>
            <p>No paperwork marathons, no seed phrases to lose. Most customers are trading within five minutes.</p>
          </Reveal>
          <MagneticButton to="/#download" variant="ghost">
            Download the app
          </MagneticButton>
        </div>

        <div className="steps-list" ref={ref}>
          <div className="steps-rail" aria-hidden>
            <motion.div className="steps-rail-fill" style={{ height: fill }} />
          </div>
          {steps.map((s, i) => (
            <Reveal key={s.title} className="step glass" delay={i * 0.1}>
              <span className="step-num">0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
