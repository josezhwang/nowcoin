import { Injectable, Logger } from '@nestjs/common';

export interface Ticker {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

const COINS = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'cardano',
  'dogecoin',
  'avalanche-2',
  'chainlink',
  'polkadot',
];

const CACHE_TTL_MS = 60_000;
const SPARKLINE_POINTS = 32;

// Used when the upstream price feed is unreachable or rate-limited.
const FALLBACK: Omit<Ticker, 'sparkline'>[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 97250,
    change24h: 1.8,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3480,
    change24h: 2.4,
  },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 212, change24h: -0.9 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 688, change24h: 0.6 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 2.31, change24h: 3.2 },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.98,
    change24h: -1.4,
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.38,
    change24h: 4.1,
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 41.2,
    change24h: -2.2,
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 23.7,
    change24h: 1.1,
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 8.4,
    change24h: -0.3,
  },
];

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price: number[] };
}

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private cache: { at: number; data: Ticker[]; live: boolean } | null = null;

  async getTickers(): Promise<{
    live: boolean;
    updatedAt: number;
    tickers: Ticker[];
  }> {
    if (this.cache && Date.now() - this.cache.at < CACHE_TTL_MS) {
      return {
        live: this.cache.live,
        updatedAt: this.cache.at,
        tickers: this.cache.data,
      };
    }

    let data: Ticker[];
    let live = true;
    try {
      data = await this.fetchLive();
    } catch (err) {
      this.logger.warn(
        `Price feed unavailable, serving fallback: ${String(err)}`,
      );
      data = this.fallback();
      live = false;
    }

    this.cache = { at: Date.now(), data, live };
    return { live, updatedAt: this.cache.at, tickers: data };
  }

  private async fetchLive(): Promise<Ticker[]> {
    const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
    url.searchParams.set('vs_currency', 'usd');
    url.searchParams.set('ids', COINS.join(','));
    url.searchParams.set('sparkline', 'true');

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
    const rows = (await res.json()) as CoinGeckoMarket[];

    return rows.map((r) => ({
      id: r.id,
      symbol: r.symbol.toUpperCase(),
      name: r.name,
      price: r.current_price,
      change24h: r.price_change_percentage_24h ?? 0,
      sparkline: downsample(r.sparkline_in_7d?.price ?? [], SPARKLINE_POINTS),
    }));
  }

  private fallback(): Ticker[] {
    return FALLBACK.map((t, i) => ({
      ...t,
      sparkline: syntheticSparkline(t.price, t.change24h, i + 1),
    }));
  }
}

function downsample(values: number[], points: number): number[] {
  if (values.length <= points) return values;
  const step = (values.length - 1) / (points - 1);
  return Array.from({ length: points }, (_, i) => values[Math.round(i * step)]);
}

// Deterministic random walk that ends at `price` and trends with `change`.
function syntheticSparkline(
  price: number,
  change: number,
  seed: number,
): number[] {
  let s = seed * 9301;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const start = price / (1 + change / 100);
  return Array.from({ length: SPARKLINE_POINTS }, (_, i) => {
    const t = i / (SPARKLINE_POINTS - 1);
    const noise = (rand() - 0.5) * price * 0.02 * Math.sin(t * Math.PI);
    return start + (price - start) * t + noise;
  });
}
