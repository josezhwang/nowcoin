// Mirrors backend/src/content/content.types.ts and market.service.ts.
export interface Product {
  slug: string
  name: string
  category: 'Consumer' | 'Business' | 'Developers'
  tagline: string
  description: string
  accent: string
  features: { title: string; body: string }[]
  metrics: { label: string; value: string }[]
  highlights: string[]
}

export interface CardTier {
  id: string
  name: string
  cashback: string
  stake: string
  monthlyFee: string
  material: 'metal' | 'polycarbonate'
  colors: [string, string]
  perks: string[]
}

export interface Stat {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export interface HomeContent {
  stats: Stat[]
  steps: { title: string; body: string }[]
  faqs: { question: string; answer: string }[]
  testimonials: { quote: string; name: string; role: string }[]
}

export interface Ticker {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  sparkline: number[]
}

export interface TickerResponse {
  live: boolean
  updatedAt: number
  tickers: Ticker[]
}

export type ContactTopic = 'sales' | 'partnership' | 'support' | 'press' | 'other'

export interface ContactPayload {
  name: string
  email: string
  company?: string
  topic: ContactTopic
  message: string
}

export interface TeamMember {
  slug: string
  name: string
  role: string
  department: 'Leadership' | 'Engineering' | 'Product & Design' | 'Security' | 'Operations'
  bio: string
  links: { linkedin?: string; x?: string; github?: string }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatReply {
  reply: string
  /** `ai` when Claude answered, `faq` when the backend's keyword fallback did. */
  source: 'ai' | 'faq'
}
