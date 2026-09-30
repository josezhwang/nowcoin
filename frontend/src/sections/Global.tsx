import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Hand } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Counter } from '@/components/ui/Counter'
import { GlowFallback } from '@/components/ui/CardFallback'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ROUTES } from '@/three/globeData'

const GlobeCanvas = lazy(() => import('@/three/GlobeCanvas'))

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

export function Global() {
  const feed = useTransferFeed(5)

  return (
    <section className="section global" id="global" aria-labelledby="global-title">
      <div className="container">
        <SectionHeading
          id="global-title"
          align="center"
          eyebrow="Global network"
          title={
            <>
              Money that moves at <strong>the speed of the internet</strong>
            </>
          }
          body="Nowcoin settles across borders on stablecoin rails — no correspondent banks, no cut-off times, no weekends off."
        />

        <div className="global-stage">
          <div className="global-globe">
            <Suspense fallback={<GlowFallback color="#6d5dfc" />}>
              <GlobeCanvas />
            </Suspense>
            <span className="card-hint">
              <Hand size={14} aria-hidden /> Drag to explore
            </span>
          </div>

          <aside className="global-feed glass" aria-label="Recent settlements (illustrative)">
            <header>
              <span className="live-dot" aria-hidden /> Live settlements
              <small>Illustrative</small>
            </header>
            <ol>
              <AnimatePresence initial={false} mode="popLayout">
                {feed.map((t) => (
                  <motion.li
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
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
              </AnimatePresence>
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
        </div>
      </div>
    </section>
  )
}
