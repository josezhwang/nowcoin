export interface Product {
  slug: string;
  name: string;
  category: 'Consumer' | 'Business' | 'Developers';
  tagline: string;
  description: string;
  accent: string;
  features: { title: string; body: string }[];
  metrics: { label: string; value: string }[];
  /** Short capability bullets shown on the product showcase and detail page. */
  highlights: string[];
}

export interface CardTier {
  id: string;
  name: string;
  cashback: string;
  stake: string;
  monthlyFee: string;
  material: 'metal' | 'polycarbonate';
  colors: [string, string];
  perks: string[];
}

export interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  department:
    | 'Leadership'
    | 'Engineering'
    | 'Product & Design'
    | 'Security'
    | 'Operations';
  bio: string;
  links: { linkedin?: string; x?: string; github?: string };
}
