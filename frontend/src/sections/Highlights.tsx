import { Award, Globe2, ShieldCheck, Zap, type LucideIcon } from 'lucide-react'
import { Counter } from '@/components/ui/Counter'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { images } from '@/config/images'

interface Highlight {
  icon: LucideIcon
  kicker: string
  value: number
  decimals?: number
  prefix?: string
  suffix: string
  title: string
  body: string
}

// Placeholder figures — replace with audited numbers.
const HIGHLIGHTS: Highlight[] = [
  {
    icon: Globe2,
    kicker: 'Trusted Worldwide',
    value: 2.4,
    decimals: 1,
    suffix: 'M+',
    title: 'customers',
    body: 'Holding, spending and sending crypto in 90+ countries.',
  },
  {
    icon: Zap,
    kicker: 'Lightning Settlement',
    value: 4.2,
    decimals: 1,
    suffix: 's',
    title: 'average transfer',
    body: 'Cross-border on stablecoin rails — weekends included.',
  },
  {
    icon: ShieldCheck,
    kicker: 'Fully Reserved',
    value: 1,
    prefix: '1:',
    suffix: '',
    title: 'backed reserves',
    body: 'Customer assets segregated and attested every month.',
  },
]

/** PeachWeb-style "award" cards: a small kicker over one huge number. */
export function Highlights() {
  return (
    <section className="highlights" aria-label="Nowcoin in numbers">
      <div className="container highlights-grid">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.kicker} delay={i * 0.08}>
            <article className="hl-card spot">
              <span className="hl-kicker">
                <h.icon size={14} aria-hidden /> {h.kicker}
              </span>
              <strong className="hl-value">
                <Counter value={h.value} decimals={h.decimals} prefix={h.prefix} suffix={h.suffix} />
                <small>{h.title}</small>
              </strong>
              <p>{h.body}</p>
              <Award className="hl-mark" size={64} strokeWidth={1} aria-hidden />
              <span className="hl-edge" aria-hidden />
            </article>
          </Reveal>
        ))}
        {/* Your 3D render floats across the cards (hidden in production until added). */}
        <div className="hl-float" aria-hidden>
          <ImageSlot image={images.highlights.float} fit="contain" fallback={import.meta.env.DEV ? undefined : null} />
        </div>
      </div>
    </section>
  )
}
