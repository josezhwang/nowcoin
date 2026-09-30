import { MarketService } from './market.service.js';

describe('MarketService', () => {
  afterEach(() => vi.restoreAllMocks());

  it('serves fallback tickers when the feed fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const res = await new MarketService().getTickers();
    expect(res.live).toBe(false);
    expect(res.tickers.length).toBe(10);
    expect(res.tickers[0].sparkline.length).toBe(32);
  });

  it('caches results between calls', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 100,
            price_change_percentage_24h: 1,
            sparkline_in_7d: { price: [1, 2, 3] },
          },
        ]),
      ),
    );
    const service = new MarketService();
    await service.getTickers();
    const res = await service.getTickers();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(res.live).toBe(true);
    expect(res.tickers[0].symbol).toBe('BTC');
  });
});
