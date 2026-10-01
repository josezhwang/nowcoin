import { motion } from 'framer-motion'
import { ArrowLeftRight, ChevronDown, LineChart, ListFilter, RotateCw } from 'lucide-react'
import { useTickers } from '@/api/queries'
import { BrandMark } from '@/components/ui/BrandMark'
import { Counter } from '@/components/ui/Counter'
import { formatPercent } from '@/lib/format'

const EASE = [0.22, 1, 0.36, 1] as const

function CardIcons() {
  return (
    <span className="hc-icons" aria-hidden>
      <LineChart size={14} />
      <RotateCw size={14} />
      <ListFilter size={14} />
    </span>
  )
}

// Stepped "range" chart like the reference: each period is a short bar at a level.
const STEPS = [
  { x: 0, w: 38, y: 34, dim: true },
  { x: 48, w: 30, y: 44, dim: true },
  { x: 92, w: 34, y: 26, dim: false },
  { x: 140, w: 34, y: 16, dim: false },
]

const PERIODS = [
  ['24H', '$4.12'],
  ['7D', '$28.9'],
  ['30D', '$124'],
  ['Total', '$5.8k'],
] as const

/**
 * Floating, tilted stat cards around the hero headline. They slide in during the
 * intro, count their numbers up, then bob gently and drift with the pointer.
 */
export function HeroCards() {
  const { data } = useTickers()
  const btc = data?.tickers.find((t) => t.symbol === 'BTC')
  const price = btc?.price ?? 97210.45
  const change = btc?.change24h ?? 1.03
  const up = change >= 0

  return (
    <div className="hero-cards" aria-hidden>
      <div className="hc-stack hc-left">
        <motion.div
          className="hc-float hc-a"
          initial={{ opacity: 0, x: -160, rotate: -14 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
        >
          <div className="hc-card">
            <CardIcons />
            <small>Global Settlement Volume</small>
            <strong>
              <Counter value={18.04} from={16.21} decimals={2} prefix="$" suffix="b" delay={0.5} duration={3} />
            </strong>
          </div>
        </motion.div>

        <motion.div
          className="hc-float hc-b"
          initial={{ opacity: 0, x: -140, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
        >
          <div className="hc-card">
            <small>Bitcoin Price</small>
            <strong className="hc-big">
              <Counter value={price} from={price * 0.8} decimals={2} delay={0.6} duration={3} />
            </strong>
            <span className="hc-row">
              USD{' '}
              <span className={up ? 'up' : 'down'}>
                {up ? '+' : '−'}
                {formatPercent(change)}
              </span>
              <span className="hc-fade">24h Change Percent</span>
            </span>
            <span className="hc-controls">
              <span className="hc-select">
                Buy BTC <ChevronDown size={13} />
              </span>
              <span className="hc-round">
                <ArrowLeftRight size={13} />
              </span>
            </span>
          </div>
        </motion.div>
      </div>

      <div className="hc-stack hc-right">
        <motion.div
          className="hc-float hc-c"
          initial={{ opacity: 0, x: 160, rotate: 12 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
        >
          <div className="hc-card">
            <span className="hc-token">
              <span className="hc-token-icon">
                <BrandMark size={18} />
              </span>
              <span>
                Nowcoin Card
                <small className="accent">Cashback</small>
              </span>
            </span>
            <svg className="hc-steps" viewBox="0 0 180 56">
              {STEPS.map((s) => (
                <rect
                  key={s.x}
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height="2.4"
                  rx="1.2"
                  className={s.dim ? 'dim' : undefined}
                />
              ))}
            </svg>
            <span className="hc-periods">
              {PERIODS.map(([p, v]) => (
                <span key={p}>
                  {p}
                  <small>{v}</small>
                </span>
              ))}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="hc-float hc-d"
          initial={{ opacity: 0, x: 120, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, delay: 0.95, ease: EASE }}
        >
          <div className="hc-card">
            <CardIcons />
            <small>Cashback Paid Per Year</small>
            <strong>
              <Counter value={5.85} from={3.1} decimals={2} prefix="$" suffix="m" delay={0.9} duration={3} />
            </strong>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
