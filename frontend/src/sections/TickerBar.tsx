import { Marquee } from '@/components/ui/Marquee'
import { Sparkline } from '@/components/ui/Sparkline'
import { useTickers } from '@/api/queries'
import { formatPercent, formatPrice } from '@/lib/format'

export function TickerBar() {
  const { data } = useTickers()

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
                  {up ? '▲' : '▼'} {formatPercent(t.change24h)}
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
