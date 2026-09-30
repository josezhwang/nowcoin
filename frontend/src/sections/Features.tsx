import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { images, type ImageSpec } from '@/config/images'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Feature {
  icon: ImageSpec
  title: string
  body: string
}

// Icons are image slots — drop your own artwork into public/images/features/.
const LEFT: Feature[] = [
  {
    icon: images.features.security,
    title: 'Bank-grade security',
    body: 'MPC key protection, 95% cold storage and monthly proof of reserves.',
  },
  {
    icon: images.features.fast,
    title: 'Lightning fast',
    body: 'Card payments approve in under 300 ms; cross-border transfers settle in seconds.',
  },
  {
    icon: images.features.support,
    title: 'Always helpful',
    body: 'Real people on chat 24/7 in 12 languages, with a median reply time under two minutes.',
  },
]

const RIGHT: Feature[] = [
  {
    icon: images.features.global,
    title: 'Global by default',
    body: 'Hold, spend and send in 150+ currencies across 90+ countries.',
  },
  {
    icon: images.features.fees,
    title: 'Transparent fees',
    body: 'No hidden spreads or FX markups. Every fee is shown before you confirm.',
  },
  {
    icon: images.features.compliance,
    title: 'Fully regulated',
    body: 'Licensed and audited, with segregated customer assets held 1:1.',
  },
]

function FeatureCard({ f, delay }: { f: Feature; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="feature glass spot">
        <ImageSlot image={f.icon} className="feature-icon" fit="contain" radius="14px" compact />
        <h3>{f.title}</h3>
        <p>{f.body}</p>
      </article>
    </Reveal>
  )
}

type Pill = 'blue' | 'green' | 'violet' | 'orange'

// The statement, split into tokens: plain words light up one by one; pills as a unit.
const STATEMENT: { text: string; pill?: Pill }[] = [
  { text: 'Unlock the power of' },
  { text: 'hassle-free', pill: 'blue' },
  { text: 'and' },
  { text: 'secure payments', pill: 'green' },
  { text: 'with Nowcoin — an' },
  { text: 'advanced', pill: 'violet' },
  { text: 'platform crafted to' },
  { text: 'redefine', pill: 'orange' },
  { text: 'how you use digital money.' },
]

type StatementToken = { text: string; pill?: Pill }

const TOKENS: StatementToken[] = STATEMENT.flatMap((seg) =>
  seg.pill ? [seg] : seg.text.split(' ').map((text) => ({ text })),
)

function Token({ token, index, progress }: { token: StatementToken; index: number; progress: MotionValue<number> }) {
  const start = index / TOKENS.length
  const opacity = useTransform(progress, [start, start + 1 / TOKENS.length], [0.16, 1])
  return (
    <>
      <motion.span className={token.pill ? `pill pill-${token.pill}` : undefined} style={{ opacity }}>
        {token.text}
      </motion.span>{' '}
    </>
  )
}

/** Words brighten in reading order as the statement scrolls through the viewport. */
function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })

  if (reduced) {
    return (
      <p className="statement" id="why-title">
        {TOKENS.map((t, i) => (
          <span key={i}>
            <span className={t.pill ? `pill pill-${t.pill}` : undefined}>{t.text}</span>{' '}
          </span>
        ))}
      </p>
    )
  }

  return (
    <p className="statement" id="why-title" ref={ref}>
      {TOKENS.map((t, i) => (
        <Token key={i} token={t} index={i} progress={scrollYProgress} />
      ))}
    </p>
  )
}

export function Features() {
  return (
    <section className="section features" id="why" aria-labelledby="why-title">
      <div className="ambient" aria-hidden />
      <div className="container">
        <ScrollStatement />

        <div className="features-layout">
          <div className="features-col">
            {LEFT.map((f, i) => (
              <FeatureCard key={f.title} f={f} delay={i * 0.08} />
            ))}
          </div>
          <Reveal className="features-center">
            <div className="orbits" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <ImageSlot image={images.features.centerpiece} fit="contain" radius="32px" />
          </Reveal>
          <div className="features-col">
            {RIGHT.map((f, i) => (
              <FeatureCard key={f.title} f={f} delay={i * 0.08 + 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
