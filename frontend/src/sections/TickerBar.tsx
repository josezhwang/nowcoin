import { Marquee } from '../components/Marquee'
import { Sparkline } from '../components/Sparkline'
import { useApi } from '../lib/api'
import { formatPrice } from '../lib/hooks'
import type { TickerResponse } from '../lib/types'

export function TickerBar() {
  const { data } = useApi<TickerResponse>('/market/tickers', { refreshMs: 60_000 })

  return (
    <div className="ticker-bar">
      <div className="ticker-label">
        <span className={`live-dot${data?.live ? '' : ' offline'}`} />
        {data?.live === false ? 'Indicative' : 'Live'}
      </div>
      {data ? (
        <Marquee duration={55}>
          {data.tickers.map((t) => {
            const up = t.change24h >= 0
            return (
              <div className="ticker" key={t.id}>
                <span className="ticker-sym">{t.symbol}</span>
                <span className="ticker-price">{formatPrice(t.price)}</span>
                <span className={`ticker-change ${up ? 'up' : 'down'}`}>
                  {up ? '▲' : '▼'} {Math.abs(t.change24h).toFixed(2)}%
                </span>
                <Sparkline values={t.sparkline} up={up} width={72} height={24} />
              </div>
            )
          })}
        </Marquee>
      ) : (
        <div className="ticker-placeholder" />
      )}
    </div>
  )
}
