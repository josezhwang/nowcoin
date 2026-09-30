import { Controller, Get } from '@nestjs/common';
import { MarketService } from './market.service.js';

@Controller('market')
export class MarketController {
  constructor(private readonly market: MarketService) {}

  @Get('tickers')
  tickers() {
    return this.market.getTickers();
  }
}
