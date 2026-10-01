import { useInView } from 'framer-motion'
import { Coins, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { BrandMark } from '@/components/ui/BrandMark'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { CharReveal } from '@/components/ui/TextReveal'
import { images, type ImageSpec } from '@/config/images'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Dome geometry (viewBox 1200×620): a hemisphere seen slightly from above.
const CX = 600
const BASE = 640
const R = 580

/** Meridians: half-ellipses from the pole down to the base line. */
const MERIDIANS = [0.18, 0.4, 0.62, 0.82, 1].flatMap((k) => {
  const rx = R * k
  return [
    `M${CX} ${BASE - R} A ${rx} ${R} 0 0 1 ${CX + rx} ${BASE}`,
    `M${CX} ${BASE - R} A ${rx} ${R} 0 0 0 ${CX - rx} ${BASE}`,
  ]
})

/** Parallels: shallow arcs across the dome at several latitudes. */
const PARALLELS = [0.22, 0.42, 0.62, 0.8].map((t) => {
  const y = BASE - R * Math.sin((t * Math.PI) / 2)
  const w = R * Math.cos((t * Math.PI) / 2)
  return `M${CX - w} ${y} A ${w} ${w * 0.1} 0 0 0 ${CX + w} ${y}`
})

// Streaks run along a few meridians and parallels. [path index, kind, dur, delay]
const DOME_STREAKS: [number, 'm' | 'p', number, number][] = [
  [2, 'm', 4.8, -0.6],
  [5, 'm', 5.6, -2.9],
  [7, 'm', 5.2, -1.7],
  [0, 'm', 6.4, -4.1],
  [1, 'p', 6, -3.3],
  [2, 'p', 7, -0.2],
]

interface Tag {
  title: string
  accent: string
  body: string
  icon: ImageSpec
  /** Position on the dome (percent of the stage). */
  x: number
  y: number
}

// Node icons are image slots: drop your artwork into public/images/features/.
const TAGS: Tag[] = [
  {
    title: 'Lightning',
    accent: 'Fast',
    body: 'Card payments approve in under 300 ms',
    icon: images.features.fast,
    x: 30,
    y: 8,
  },
  {
    title: 'Complete',
    accent: 'Transparency',
    body: 'Reserves verified 1:1, every month',
    icon: images.features.global,
    x: 62,
    y: 18,
  },
  {
    title: 'Always',
    accent: 'Helpful',
    body: 'Real people on chat 24/7, in 12 languages',
    icon: images.features.support,
    x: 8,
    y: 50,
  },
  {
    title: 'Robust',
    accent: 'Security',
    body: 'MPC keys, cold storage and 24/7 monitoring',
    icon: images.features.security,
    x: 78,
    y: 48,
  },
]

const MODES = ['Flexibility', 'Instantaneity', 'Fluidity']

function DomeTag({ tag, index }: { tag: Tag; index: number }) {
  return (
    <Reveal
      delay={0.15 + index * 0.1}
      className="dome-tag-wrap"
      style={{ left: `${tag.x}%`, top: `${tag.y}%` } as CSSProperties}
    >
      <div className="dome-tag">
        <strong>
          {tag.title} <span className="accent">{tag.accent}</span>
        </strong>
        <small>{tag.body}</small>
      </div>
      <span className="dome-node">
        <ImageSlot image={tag.icon} fit="contain" radius="50%" compact fallback={<BrandMark size={16} />} />
      </span>
    </Reveal>
  )
}

export function FeatureDome() {
  const frameRef = useRef<HTMLDivElement>(null)
  const frameIn = useInView(frameRef, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const [mode, setMode] = useState(1)

  // Cycle the highlighted tab in the centre card.
  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => setMode((m) => (m + 1) % MODES.length), 2600)
    return () => window.clearInterval(t)
  }, [reduced])

  return (
    <section className="section dome-section" aria-labelledby="dome-title">
      <div className="starfield" aria-hidden />
      <div className="container">
        <div className={`dome-head${frameIn ? ' is-in' : ''}`} ref={frameRef}>
          {/* HUD brackets that draw themselves around the title */}
          <svg className="hud" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
            <path d="M40 0 V120 Q40 130 50 130 H120" pathLength={1} />
            <path d="M760 0 V120 Q760 130 750 130 H680" pathLength={1} />
            <path d="M140 58 Q110 58 110 70 V170 Q110 182 122 182" pathLength={1} />
            <path d="M660 58 Q690 58 690 70 V170 Q690 182 678 182" pathLength={1} />
          </svg>
          <Reveal className="dome-icon" aria-hidden>
            <span className="dome-icon-stack">
              <Coins size={22} />
            </span>
          </Reveal>
          <h2 id="dome-title" className="tone">
            <CharReveal>
              Features
              <br />
              <em>of the</em> Nowcoin Platform
            </CharReveal>
          </h2>
          <Reveal delay={0.1}>
            <p>
              The most transparent and easiest way to hold, spend and move crypto — with{' '}
              <b>zero lockups, so you stay in control</b> of your money.
            </p>
          </Reveal>
        </div>

        <div className="dome-stage">
          <svg className="dome" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax meet" aria-hidden>
            <g className="dome-lines">
              {MERIDIANS.map((d) => (
                <path key={d} d={d} />
              ))}
              {PARALLELS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </svg>
          <svg className="dome dome-streaks" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax meet" aria-hidden>
            <g className="streaks">
              {DOME_STREAKS.map(([i, kind, dur, delay]) => {
                const d = kind === 'm' ? MERIDIANS[i]! : PARALLELS[i]!
                return (
                  <g key={`${kind}${i}`} style={{ '--dur': `${dur}s`, '--delay': `${delay}s` } as CSSProperties}>
                    <path d={d} pathLength={1} className="streak streak-glow" />
                    <path d={d} pathLength={1} className="streak streak-core" />
                  </g>
                )
              })}
            </g>
          </svg>

          {TAGS.map((t, i) => (
            <DomeTag key={t.accent} tag={t} index={i} />
          ))}

          <Reveal delay={0.3} className="dome-card-wrap">
            <div className="dome-card corner-dots">
              <div className="dome-modes" aria-hidden>
                {MODES.map((m, i) => (
                  <span key={m} className={i === mode ? 'is-active' : undefined}>
                    {m}
                  </span>
                ))}
              </div>
              <Sparkles size={18} className="dome-spark" aria-hidden />
              <p>Send, spend and move your crypto anytime you want — no minimum terms.</p>
              <strong>Zero Lockup</strong>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
