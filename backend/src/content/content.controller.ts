import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service.js';

@Controller()
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('products')
  products() {
    return this.content.getProducts();
  }

  @Get('products/:slug')
  product(@Param('slug') slug: string) {
    return this.content.getProduct(slug);
  }

  @Get('cards')
  cards() {
    return this.content.getCardTiers();
  }

  @Get('home')
  home() {
    return this.content.getHome();
  }
}
