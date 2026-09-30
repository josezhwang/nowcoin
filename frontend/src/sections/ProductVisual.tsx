import { Sparkline } from '../components/Sparkline'

// Lightweight CSS/SVG illustrations for each bento tile.
const CHART = [22, 24, 23, 27, 26, 30, 29, 34, 32, 37, 41, 39, 44, 48, 46, 52]

export function ProductVisual({ slug }: { slug: string }) {
  switch (slug) {
    case 'wallet':
      return (
        <div className="pv pv-wallet">
          <div className="pv-balance">
            <small>Total balance</small>
            <strong>$48,210.55</strong>
            <span className="up">▲ 4.21% today</span>
          </div>
          {[
            ['BTC', 'Bitcoin', '0.4120', '#f59e0b'],
            ['ETH', 'Ethereum', '5.83', '#8b5cf6'],
            ['SOL', 'Solana', '112.4', '#22d3ee'],
          ].map(([sym, name, amt, c]) => (
            <div className="pv-asset" key={sym}>
              <span className="pv-coin" style={{ background: c }}>
                {sym[0]}
              </span>
              <span>{name}</span>
              <span className="pv-amt">
                {amt} {sym}
              </span>
            </div>
          ))}
        </div>
      )
    case 'card':
      return (
        <div className="pv pv-card">
          <div className="mini-card mini-card-back" />
          <div className="mini-card">
            <span>Nowcoin Digital</span>
            <span className="mini-chip" />
            <span className="mini-num">•••• 2049</span>
          </div>
        </div>
      )
    case 'exchange':
      return (
        <div className="pv pv-exchange">
          <div className="pv-pair">
            BTC/USDT <span className="up">+2.8%</span>
          </div>
          <Sparkline values={CHART} up width={260} height={90} />
          <div className="pv-book">
            <span className="up">Buy 97,210</span>
            <span className="down">Sell 97,236</span>
          </div>
        </div>
      )
    case 'pay':
      return (
        <div className="pv pv-pay">
          <div className="pv-checkout">
            <span>Order #4821</span>
            <strong>€42.00</strong>
            <span className="pv-paid">✓ Paid in USDC</span>
          </div>
        </div>
      )
    case 'custody':
      return (
        <div className="pv pv-custody">
          {[0, 1, 2].map((i) => (
            <span key={i} className="pv-ring" style={{ animationDelay: `${i * -2}s` }} />
          ))}
          <span className="pv-lock">🔒</span>
        </div>
      )
    case 'api':
      return (
        <pre className="pv pv-code">
          <code>
            <span className="tk-k">const</span> card = <span className="tk-k">await</span> nowcoin.cards.
            <span className="tk-f">issue</span>({'{'}
            {'\n'}  user: <span className="tk-s">'usr_8f2k'</span>,{'\n'}  type: <span className="tk-s">'virtual'</span>
            {'\n'}
            {'}'})
          </code>
        </pre>
      )
    default:
      return null
  }
}
