import { useInView } from 'framer-motion'
import {
  Bitcoin,
  Box,
  ChevronDown,
  Coins,
  Gem,
  Globe,
  Layers,
  Lock,
  Server,
  ShieldCheck,
  SquareActivity,
  type LucideIcon,
} from 'lucide-react'
import { useId, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import { useTickers } from '@/api/queries'
import { BrandMark } from '@/components/ui/BrandMark'
import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import { CharReveal } from '@/components/ui/TextReveal'

/* ---------------- Shared card shell ---------------- */

function BentoCard({
  icon: Icon,
  title,
  sub,
  className = '',
  children,
  delay = 0,
}: {
  icon: LucideIcon | (() => React.ReactNode)
  title: string
  sub: React.ReactNode
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={`bento-cell ${className}`}>
      <article className="bento-card card corner-dots spot">
        <span className="bento-icon" aria-hidden>
          <Icon size={18} strokeWidth={1.7} />
        </span>
        <h3>{title}</h3>
        <p className="bento-sub">{sub}</p>
        <div className="bento-visual">{children}</div>
      </article>
    </Reveal>
  )
}

/* ---------------- Verified security: tokens orbiting the mark ---------------- */

function EthGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M12 2 5 12.2 12 16l7-3.8L12 2Zm0 15.6-7-3.9L12 22l7-8.3-7 3.9Z" fill="currentColor" />
    </svg>
  )
}

const ORBIT: (LucideIcon | typeof EthGlyph)[] = [Bitcoin, EthGlyph, Gem, Lock, ShieldCheck, Globe]

function OrbitVisual() {
  return (
    <div className="orbit-panel">
      <svg className="orbit-arcs" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx="200" cy="110" r={70 + i * 11} />
        ))}
      </svg>
      <div className="orbit">
        <div className="orbit-ring">
          {ORBIT.map((Icon, i) => (
            <span key={i} className="orbit-slot" style={{ '--a': `${(i / ORBIT.length) * 360}deg` } as CSSProperties}>
              <span className="orbit-badge">
                <Icon size={15} />
              </span>
            </span>
          ))}
        </div>
        <span className="orbit-core">
          <BrandMark size={26} />
        </span>
      </div>
    </div>
  )
}

/* ---------------- Connect API: data flowing into the automation core ---------------- */

function ApiVisual() {
  return (
    <div className="api-panel">
      <svg className="api-lines" viewBox="0 0 320 200" preserveAspectRatio="none" aria-hidden>
        <path d="M40 100 H130" />
        <path d="M190 100 H280" />
        <path d="M160 18 V70" />
        <path d="M160 130 V182" />
        <g className="api-flow">
          <path d="M40 100 H130" />
          <path d="M280 100 H190" />
          <path d="M160 18 V70" />
          <path d="M160 182 V130" />
        </g>
      </svg>
      <span className="api-node n-top">API</span>
      <span className="api-node n-left">API</span>
      <span className="api-node n-right">API</span>
      <span className="api-node n-bottom">SDK</span>
      <span className="api-core">
        <BrandMark size={24} />
      </span>
      <small className="api-caption">Process Automation</small>
    </div>
  )
}

/* ---------------- Portfolio tracker ---------------- */

function PortfolioVisual() {
  return (
    <div className="pf-panel">
      <span className="pf-lev">10X</span>
      <span className="pf-badge">
        <Coins size={12} aria-hidden />
        <small className="up">+5.67%</small>
        $230.13
      </span>
      <span className="pf-pair">
        <span className="pf-coins" aria-hidden>
          <i>₿</i>
          <i>₮</i>
        </span>
        BTC/USDT
      </span>
      <small className="pf-label">Unrealized PNL</small>
      <span className="pf-value">
        <Counter value={3166.99} from={2410} decimals={2} duration={2.4} />
        <small>USDT</small>
      </span>
      <span className="pf-foot">
        <small>Potential</small>
        <span className="pf-chip">1.09%</span>
      </span>
    </div>
  )
}

/* ---------------- Earn calculator (interactive) ---------------- */

// Placeholder earn rates — replace with the real product rates.
const ASSETS = [
  { symbol: 'ETH', name: 'Ethereum ecosystem', apy: 0.042, fallback: 3480 },
  { symbol: 'BTC', name: 'Bitcoin network', apy: 0.021, fallback: 97210 },
  { symbol: 'SOL', name: 'Solana ecosystem', apy: 0.068, fallback: 212 },
  { symbol: 'USDC', name: 'Stablecoin', apy: 0.05, fallback: 1 },
] as const

const PERIODS = [
  { days: 1, label: '1 Day Earnings' },
  { days: 7, label: '7 Day Earnings' },
  { days: 30, label: '30 Day Earnings' },
  { days: 365, label: '1 Year Earnings' },
]

function CalculatorVisual() {
  const { data } = useTickers()
  const [symbol, setSymbol] = useState<(typeof ASSETS)[number]['symbol']>('ETH')
  const [amountText, setAmountText] = useState('10,000')
  const [inAsset, setInAsset] = useState(false)
  const selectId = useId()
  const amountId = useId()
  const chartRef = useRef<SVGSVGElement>(null)
  const chartIn = useInView(chartRef, { once: true, margin: '-40px' })

  const asset = ASSETS.find((a) => a.symbol === symbol)!
  const price = data?.tickers.find((t) => t.symbol === symbol)?.price ?? asset.fallback
  const amount = Number(amountText.replace(/[^\d.]/g, '')) || 0
  const assetAmount = amount / price
  const yearly = amount * asset.apy

  const earnings = useMemo(
    () => PERIODS.map((p) => ({ ...p, usd: (amount * asset.apy * p.days) / 365 })),
    [amount, asset.apy],
  )

  const onAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 9)
    setAmountText(digits ? Number(digits).toLocaleString('en-US') : '')
  }

  return (
    <div className="calc">
      <svg ref={chartRef} className={`calc-chart${chartIn ? ' is-in' : ''}`} viewBox="0 0 60 300" aria-hidden>
        <path d="M2 298 C 18 280, 22 190, 30 150 S 44 40, 58 6" pathLength={1} />
        <circle cx="30" cy="150" r="3.2" />
      </svg>
      <span className={`calc-tip${chartIn ? ' is-in' : ''}`} aria-hidden>
        {yearly >= 1000 ? `${(yearly / 1000).toFixed(1)}k` : Math.round(yearly).toLocaleString('en-US')} USDT/yr
      </span>

      <label className="calc-asset" htmlFor={selectId}>
        <span className="calc-coin" aria-hidden>
          <EthGlyph size={14} />
        </span>
        <span>
          <small>Choose Asset</small>
          {asset.symbol} <em>({asset.name})</em>
        </span>
        <ChevronDown size={14} aria-hidden />
        <select
          id={selectId}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value as typeof symbol)}
          aria-label="Choose asset"
        >
          {ASSETS.map((a) => (
            <option key={a.symbol} value={a.symbol}>
              {a.symbol} — {(a.apy * 100).toFixed(1)}% APY
            </option>
          ))}
        </select>
      </label>

      <div className="calc-box">
        <div className="calc-box-head">
          <label htmlFor={amountId}>Enter Amount</label>
          <button
            type="button"
            className={`calc-toggle${inAsset ? ' is-on' : ''}`}
            onClick={() => setInAsset((v) => !v)}
            aria-pressed={inAsset}
            aria-label={`Show earnings in ${inAsset ? 'USDT' : asset.symbol}`}
          >
            <span>USDT</span>
            <i aria-hidden />
            <span>{asset.symbol}</span>
          </button>
        </div>
        <div className="calc-amount">
          <span className="calc-coin tether" aria-hidden>
            ₮
          </span>
          <span className="calc-amount-field">
            <small>Enter the Amount</small>
            <span>
              <input
                id={amountId}
                inputMode="numeric"
                value={amountText}
                onChange={onAmount}
                placeholder="0"
                style={{ width: `${Math.max(amountText.length, 1) + 0.5}ch` }}
              />
              USDT
              <em>
                ≈ {assetAmount.toLocaleString('en-US', { maximumFractionDigits: 5 })} {asset.symbol}
              </em>
            </span>
          </span>
        </div>
        <ul className="calc-rows">
          {earnings.map((e) => (
            <li key={e.days}>
              <span>
                <small>{e.label}</small>
                {inAsset ? (
                  <Counter value={e.usd / price} decimals={6} suffix={` ${asset.symbol}`} duration={1} />
                ) : (
                  <Counter value={e.usd} decimals={2} prefix="$" duration={1} />
                )}
              </span>
              {e.days === 1 && <em>at {(asset.apy * 100).toFixed(1)}% APY</em>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <rect x="5" y="5" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="5" y="14" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="14" y="14" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  )
}

/* ---------------- Section ---------------- */

export function Bento() {
  return (
    <section className="section bento-section" aria-labelledby="bento-title">
      <div className="container bento-grid">
        <div className="bento-cell bento-intro">
          <Reveal>
            <span className="badge">
              <span className="chip-label">
                <BrandMark /> Nowcoin
              </span>
              <Layers size={13} aria-hidden /> Spend with ease
            </span>
          </Reveal>
          <h2 id="bento-title" className="tone">
            <CharReveal>
              Empowering
              <br />
              Holders,{' '}
              <span className="prompt">
                &gt;<i>_</i>
              </span>
              <br />
              <em>
                Redefining
                <br />
                Money
              </em>
            </CharReveal>
          </h2>
          <Reveal delay={0.1}>
            <p>Enhance your portfolio with reliable, regulated infrastructure.</p>
          </Reveal>
        </div>

        <BentoCard
          className="b-verified"
          icon={Server}
          title="Verified Security"
          sub={
            <>
              No.1 industry standard
              <br />
              Certified MPC custody, audited monthly
            </>
          }
          delay={0.05}
        >
          <OrbitVisual />
        </BentoCard>

        <BentoCard
          className="b-calc"
          icon={DotsIcon}
          title="Earn Calculator"
          sub="Asset-, amount- and period-based reward estimates"
          delay={0.12}
        >
          <CalculatorVisual />
        </BentoCard>

        <BentoCard
          className="b-api"
          icon={Box}
          title="Nowcoin Connect API"
          sub={
            <>
              300+ supported assets
              <br />+ real-time webhooks via UI &amp; API
            </>
          }
          delay={0.08}
        >
          <ApiVisual />
        </BentoCard>

        <BentoCard
          className="b-portfolio"
          icon={SquareActivity}
          title="Portfolio Tracker"
          sub="Track every position and card spend in one place"
          delay={0.14}
        >
          <PortfolioVisual />
        </BentoCard>
      </div>
    </section>
  )
}
