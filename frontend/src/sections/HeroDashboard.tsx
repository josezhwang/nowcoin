import { ArrowDownLeft, ArrowUpRight, Plus, Repeat, Send, Store, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { useTickers } from '@/api/queries'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatPercent, formatPrice } from '@/lib/format'

const TRANSACTIONS = [
  {
    day: 'Today',
    items: [
      { name: 'Amazon', note: 'Shopping', amount: -42.9, time: '10:29' },
      { name: 'Netflix', note: 'Entertainment', amount: -15.49, time: '09:49' },
    ],
  },
  {
    day: 'Yesterday',
    items: [
      { name: 'Balance top-up', note: 'From Nowcoin Wallet', amount: 500, time: '23:08' },
      { name: 'Money transfer', note: 'From Ann Gray', amount: 120, time: '20:50' },
      { name: 'Blue Bottle Coffee', note: 'Food & drink', amount: -6.2, time: '08:14' },
    ],
  },
]

/** A deterministic, QR-looking grid (decorative — it doesn't encode anything). */
function FauxQr() {
  const cells = useMemo(() => {
    const n = 21
    let seed = 7
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    const finder = (x: number, y: number) =>
      [
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].some(([fx = 0, fy = 0]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)
    const out: [number, number][] = []
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rand() > 0.52) out.push([x, y])
    return out
  }, [])
  const finderAt = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.6" fill="currentColor" />
    </g>
  )
  return (
    <svg viewBox="0 0 21 21" className="faux-qr" aria-hidden>
      {finderAt(0, 0)}
      {finderAt(14, 0)}
      {finderAt(0, 14)}
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x + 0.1} y={y + 0.1} width="0.8" height="0.8" rx="0.2" fill="currentColor" />
      ))}
    </svg>
  )
}

/** Product UI mock for the hero — real HTML so it stays crisp and themeable. */
export function HeroDashboard() {
  const { data } = useTickers()
  const btc = data?.tickers.find((t) => t.symbol === 'BTC')
  const up = (btc?.change24h ?? 0) >= 0

  return (
    <div className="hero-visual" aria-label="Preview of the Nowcoin app" role="img">
      <div className="dash">
        <div className="dash-top">
          <span className="dash-brand">
            <span className="dash-logo" /> Nowcoin
          </span>
          <span className="dash-tabs" aria-hidden>
            <span className="is-active">My cards</span>
            <span>Cashback</span>
            <span>Activity</span>
          </span>
          <span className="dash-price">
            BTC/USD <b>{btc ? formatPrice(btc.price) : '—'}</b>
            {btc && <i className={up ? 'up' : 'down'}>{(up ? '+' : '−') + formatPercent(btc.change24h)}</i>}
          </span>
        </div>

        <div className="dash-body">
          <div className="dash-main">
            <div className="dash-row">
              <h3>My virtual cards</h3>
              <span className="dash-chip">
                Add new card <Plus size={12} aria-hidden />
              </span>
            </div>
            <div className="dash-card">
              <span className="dash-card-logo" />
              <span className="dash-card-ccy">USD</span>
              <span className="dash-card-num">•••• •••• 7677 8545</span>
              <span className="dash-card-bal">$1,456.00</span>
              <span className="dash-card-net">NOWCOIN</span>
            </div>
            <div className="dash-actions">
              <span className="dash-action blue">
                <ArrowDownLeft size={15} aria-hidden /> Top up card
              </span>
              <span className="dash-action violet">
                <Send size={15} aria-hidden /> Send money
              </span>
              <span className="dash-action">
                <Repeat size={15} aria-hidden /> Exchange
              </span>
              <span className="dash-action">
                <Store size={15} aria-hidden /> Pay merchant
              </span>
            </div>
          </div>

          <div className="dash-side">
            <h3>Transactions</h3>
            {TRANSACTIONS.map((g) => (
              <div key={g.day} className="dash-group">
                <small>{g.day}</small>
                {g.items.map((t) => (
                  <div key={t.name} className="dash-tx">
                    <span className="dash-tx-time">{t.time}</span>
                    <span className="dash-tx-icon">{t.amount > 0 ? <Wallet size={13} /> : t.name[0]}</span>
                    <span className="dash-tx-name">
                      {t.name}
                      <small>{t.note}</small>
                    </span>
                    <span className={`dash-tx-amt${t.amount > 0 ? ' up' : ''}`}>
                      {t.amount > 0 ? '+' : '−'}${Math.abs(t.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="float float-qr glass">
        <small>Receive money</small>
        <FauxQr />
      </div>

      <div className="float float-price glass">
        <small>BTC / USD</small>
        <strong>{btc ? formatPrice(btc.price) : '—'}</strong>
        {btc && (
          <>
            <span className={up ? 'up' : 'down'}>
              <ArrowUpRight size={12} aria-hidden style={up ? undefined : { transform: 'rotate(90deg)' }} />
              {formatPercent(btc.change24h)}
            </span>
            <Sparkline values={btc.sparkline} up={up} width={120} height={30} />
          </>
        )}
      </div>

      <div className="float float-amount glass">
        <span className="amount-value">$200</span>
        <span className="amount-track">
          <span />
        </span>
        <span className="amount-chips">
          <span>$100</span>
          <span className="is-active">$500</span>
          <span>$1,000</span>
        </span>
      </div>
    </div>
  )
}
