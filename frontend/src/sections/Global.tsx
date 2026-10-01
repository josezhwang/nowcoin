import { motion } from 'framer-motion'
import { ArrowRight, Box, Hand } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { BrandMark } from '@/components/ui/BrandMark'
import { Counter } from '@/components/ui/Counter'
import { DotSphere } from '@/components/ui/DotSphere'
import { Reveal } from '@/components/ui/Reveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePauseOffscreen } from '@/hooks/usePauseOffscreen'
import { ROUTES } from '@/three/globeData'

const ASSETS = ['USDC', 'EUR', 'USD', 'BTC', 'ETH', 'GBP'] as const

interface Transfer {
  id: number
  from: string
  to: string
  amount: string
  asset: string
  seconds: string
}

/** Deterministic, shortened wallet address such as 0x4f2a…9c1e. */
function shortAddress(seed: number) {
  const hex = (n: number) => (Math.imul(n, 2654435761) >>> 0).toString(16).padStart(8, '0')
  return `0x${hex(seed).slice(0, 4)}…${hex(seed * 31 + 7).slice(-4)}`
}

// Illustrative activity for the feed — not real customer data.
function makeTransfer(id: number): Transfer {
  const route = ROUTES[(id * 11 + 3) % ROUTES.length]!
  const [a, b] = (id * 7) % 3 ? [route[0], route[1]] : [route[1], route[0]]
  const asset = ASSETS[(id * 5) % ASSETS.length]!
  const value = ((id * 7919) % 48000) + 120
  return {
    id,
    from: shortAddress(id * 97 + a),
    to: shortAddress(id * 89 + b + 1000),
    asset,
    amount:
      asset === 'BTC'
        ? (value / 97000).toFixed(4)
        : asset === 'ETH'
          ? (value / 3400).toFixed(3)
          : value.toLocaleString('en-US'),
    seconds: (1.8 + ((id * 13) % 32) / 10).toFixed(1),
  }
}

function useTransferFeed(size: number) {
  const reduced = useReducedMotion()
  const [feed, setFeed] = useState(() => Array.from({ length: size }, (_, i) => makeTransfer(size - i)))
  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(() => {
      setFeed((f) => [makeTransfer((f[0]?.id ?? 0) + 1), ...f.slice(0, size - 1)])
    }, 2400)
    return () => window.clearInterval(timer)
  }, [reduced, size])
  return feed
}

const STATS = [
  { value: 90, suffix: '+', label: 'Countries' },
  { value: 4.2, suffix: 's', decimals: 1, label: 'Avg. settlement' },
  { value: 18, prefix: '$', suffix: 'B+', label: 'Quarterly volume' },
]

/** Token badges riding thin guide lines towards the planet (positions in % of the section). */
const TOKENS: { glyph: ReactNode; x: number; y: number; delay: number }[] = [
  { glyph: '₿', x: 12, y: 30, delay: 0 },
  { glyph: 'Ξ', x: 5, y: 58, delay: -1.6 },
  { glyph: <Box size={14} />, x: 91, y: 26, delay: -0.8 },
  { glyph: '₮', x: 95, y: 74, delay: -2.4 },
]

export function Global() {
  const feed = useTransferFeed(5)
  const ref = useRef<HTMLElement>(null)
  usePauseOffscreen(ref)

  return (
    <section className="global force-dark" id="global" aria-labelledby="global-title" ref={ref}>
      <div className="global-aura" aria-hidden />
      <div className="starfield" aria-hidden />
      <svg className="global-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M0 8 L30 52" />
        <path d="M-2 40 L22 88" />
        <path d="M100 6 L74 50" />
        <path d="M102 52 L80 96" />
      </svg>
      {TOKENS.map((t, i) => (
        <span
          key={i}
          className="global-token"
          style={{ left: `${t.x}%`, top: `${t.y}%`, animationDelay: `${t.delay}s` } as CSSProperties}
          aria-hidden
        >
          {t.glyph}
        </span>
      ))}

      <div className="container global-head">
        <Reveal>
          <span className="badge">
            <span className="badge-tag">Live</span>
            <BrandMark size={13} /> Global settlement network
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="global-title" className="edge-gradient">
            Money That Moves At The Speed
            <br />
            Of The Internet, Everywhere
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p>
            Nowcoin settles across borders on stablecoin rails — no correspondent banks, no cut-off times, no weekends
            off.
          </p>
        </Reveal>
      </div>

      <div className="global-stage">
        <DotSphere />

        <aside className="global-feed glass" aria-label="Recent settlements (illustrative)">
          <header>
            <span className="live-dot" aria-hidden /> Live settlements
            <small>Illustrative</small>
          </header>
          <ol>
            {feed.map((t) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="feed-route">
                  <span>{t.from}</span>
                  <ArrowRight size={12} aria-hidden />
                  <span>{t.to}</span>
                </span>
                <span className="feed-time">Settled in {t.seconds}s</span>
                <span className="feed-amount">
                  {t.amount} {t.asset}
                </span>
              </motion.li>
            ))}
          </ol>
        </aside>

        <dl className="global-stats glass">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </dd>
            </div>
          ))}
        </dl>

        <span className="global-hint">
          <Hand size={14} aria-hidden /> Drag the planet
        </span>
      </div>
    </section>
  )
}
