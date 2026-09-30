import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CARD_TIERS,
  FAQS,
  PRODUCTS,
  STATS,
  STEPS,
  TEAM,
  TESTIMONIALS,
} from './content.data.js';
import type { Product } from './content.types.js';

@Injectable()
export class ContentService {
  getProducts() {
    return PRODUCTS;
  }

  getProduct(slug: string): Product {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }

  getCardTiers() {
    return CARD_TIERS;
  }

  getTeam() {
    return TEAM;
  }

  getHome() {
    return {
      stats: STATS,
      steps: STEPS,
      faqs: FAQS,
      testimonials: TESTIMONIALS,
    };
  }
}
