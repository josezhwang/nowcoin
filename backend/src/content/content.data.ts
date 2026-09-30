// Marketing copy served to the website. Figures are placeholders — replace
// them with audited numbers before going live.
import type {
  CardTier,
  Faq,
  Product,
  Stat,
  Step,
  Testimonial,
} from './content.types.js';

export const PRODUCTS: Product[] = [
  {
    slug: 'wallet',
    name: 'Nowcoin Wallet',
    category: 'Consumer',
    tagline: 'One wallet for every chain.',
    description:
      'A self-custody wallet with MPC key protection, cross-chain swaps and a built-in portfolio view. Your keys stay yours; the complexity does not.',
    accent: '#8b5cf6',
    features: [
      {
        title: 'MPC key protection',
        body: 'Keys are split across your device and secure enclaves, so no single point can ever leak them.',
      },
      {
        title: '40+ networks',
        body: 'Ethereum, Solana, Bitcoin, Base, Arbitrum and more, all from a single recovery flow.',
      },
      {
        title: 'Gasless swaps',
        body: 'Route across DEX aggregators and pay network fees in the token you are swapping.',
      },
    ],
    metrics: [
      { label: 'Networks', value: '40+' },
      { label: 'Assets', value: '12k+' },
      { label: 'Recovery', value: '< 2 min' },
    ],
  },
  {
    slug: 'card',
    name: 'Nowcoin Card',
    category: 'Consumer',
    tagline: 'Spend crypto anywhere cards are accepted.',
    description:
      'A Visa debit card that converts crypto to fiat at the point of sale, with up to 5% back and zero foreign exchange fees.',
    accent: '#22d3ee',
    features: [
      {
        title: 'Real-time conversion',
        body: 'Pay in 150+ currencies while we settle from your chosen crypto balance in milliseconds.',
      },
      {
        title: 'Up to 5% back',
        body: 'Earn rewards on every purchase, paid instantly into your wallet.',
      },
      {
        title: 'Freeze in one tap',
        body: 'Lock, unlock, set limits and rotate card numbers from the app.',
      },
    ],
    metrics: [
      { label: 'Merchants', value: '100M+' },
      { label: 'Cashback', value: 'up to 5%' },
      { label: 'FX fees', value: '0%' },
    ],
  },
  {
    slug: 'exchange',
    name: 'Nowcoin Exchange',
    category: 'Consumer',
    tagline: 'Deep liquidity. Sub-millisecond matching.',
    description:
      'Spot and advanced trading for 300+ pairs with institutional-grade order books, maker rebates and pro charting tools.',
    accent: '#a3e635',
    features: [
      {
        title: 'Matching engine',
        body: 'A low-latency engine designed for millions of orders per second.',
      },
      {
        title: 'Pro tools',
        body: 'Advanced orders, TradingView charts and portfolio margin in one interface.',
      },
      {
        title: 'Proof of reserves',
        body: 'Customer balances are backed 1:1 and verified with Merkle-tree attestations.',
      },
    ],
    metrics: [
      { label: 'Pairs', value: '300+' },
      { label: 'Latency', value: '< 1 ms' },
      { label: 'Maker fee', value: '0.02%' },
    ],
  },
  {
    slug: 'pay',
    name: 'Nowcoin Pay',
    category: 'Business',
    tagline: 'Accept crypto. Settle in fiat.',
    description:
      'A payment gateway for online and in-store merchants. Customers pay with any major token; you receive EUR, USD or stablecoins the same day.',
    accent: '#f472b6',
    features: [
      {
        title: 'Plug-in checkout',
        body: 'Drop-in widgets for Shopify, WooCommerce and custom storefronts.',
      },
      {
        title: 'Instant settlement',
        body: 'Lock the exchange rate at checkout and eliminate volatility risk.',
      },
      {
        title: 'Global payouts',
        body: 'Pay suppliers and contractors in 60+ countries via stablecoin rails.',
      },
    ],
    metrics: [
      { label: 'Settlement', value: 'Same day' },
      { label: 'Fee', value: 'from 0.5%' },
      { label: 'Tokens', value: '50+' },
    ],
  },
  {
    slug: 'custody',
    name: 'Nowcoin Vault',
    category: 'Business',
    tagline: 'Institutional custody without compromise.',
    description:
      'Segregated, insured cold storage with MPC signing, policy engines and multi-approver workflows built for funds, treasuries and fintechs.',
    accent: '#fbbf24',
    features: [
      {
        title: 'Policy engine',
        body: 'Define quorum approvals, whitelists and velocity limits per wallet.',
      },
      {
        title: 'Air-gapped cold storage',
        body: 'Geographically distributed HSMs with no online attack surface.',
      },
      {
        title: 'Audit-ready',
        body: 'Every action is signed, timestamped and exportable for auditors.',
      },
    ],
    metrics: [
      { label: 'Cold storage', value: '95%' },
      { label: 'Approvals', value: 'M-of-N' },
      { label: 'Reporting', value: 'Real-time' },
    ],
  },
  {
    slug: 'api',
    name: 'Nowcoin Connect API',
    category: 'Developers',
    tagline: 'Crypto infrastructure as a few lines of code.',
    description:
      'REST and WebSocket APIs plus SDKs to embed wallets, issue cards, move stablecoins and run KYC inside your own product.',
    accent: '#60a5fa',
    features: [
      {
        title: 'Card issuing',
        body: 'Issue virtual and physical cards to your users programmatically.',
      },
      {
        title: 'Embedded wallets',
        body: 'Create non-custodial wallets on sign-up with no seed phrases.',
      },
      {
        title: 'Webhooks',
        body: 'Signed, retried events for deposits, trades, card swipes and more.',
      },
    ],
    metrics: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'SDKs', value: '6' },
      { label: 'p95 latency', value: '80 ms' },
    ],
  },
];

export const CARD_TIERS: CardTier[] = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    cashback: '1%',
    stake: 'No stake',
    monthlyFee: 'Free',
    material: 'polycarbonate',
    colors: ['#1f1f2e', '#3b3b58'],
    perks: ['1% back on every purchase', 'Free ATM withdrawals up to €200/mo', 'Virtual card in seconds'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    cashback: '2%',
    stake: '€400',
    monthlyFee: 'Free',
    material: 'metal',
    colors: ['#22d3ee', '#6366f1'],
    perks: ['2% back on every purchase', '100% rebate on streaming subscriptions', 'Free ATM withdrawals up to €400/mo'],
  },
  {
    id: 'nebula',
    name: 'Nebula',
    cashback: '3%',
    stake: '€4,000',
    monthlyFee: 'Free',
    material: 'metal',
    colors: ['#a855f7', '#ec4899'],
    perks: ['3% back on every purchase', 'Airport lounge access for you + 1', 'Priority 24/7 support'],
  },
  {
    id: 'singularity',
    name: 'Singularity',
    cashback: '5%',
    stake: '€40,000',
    monthlyFee: 'Free',
    material: 'metal',
    colors: ['#fbbf24', '#f97316'],
    perks: ['5% back on every purchase', 'Unlimited lounge access worldwide', 'Dedicated private account manager'],
  },
];

export const STATS: Stat[] = [
  { label: 'Customers worldwide', value: 2.4, suffix: 'M+', decimals: 1 },
  { label: 'Quarterly volume', value: 18, prefix: '$', suffix: 'B+' },
  { label: 'Countries served', value: 90, suffix: '+' },
  { label: 'Platform uptime', value: 99.99, suffix: '%', decimals: 2 },
];

export const STEPS: Step[] = [
  {
    title: 'Create your account',
    body: 'Sign up with email or passkey and verify your identity in under three minutes.',
  },
  {
    title: 'Fund your wallet',
    body: 'Deposit by bank transfer, Apple Pay, Google Pay or from any on-chain wallet.',
  },
  {
    title: 'Spend, trade, earn',
    body: 'Tap your Nowcoin Card, trade 300+ assets or put idle balances to work.',
  },
];

export const FAQS: Faq[] = [
  {
    question: 'Is my crypto safe with Nowcoin Digital?',
    answer:
      'Customer assets are held 1:1 and segregated from company funds. The majority is kept in air-gapped cold storage, and we publish regular proof-of-reserves attestations.',
  },
  {
    question: 'How does the Nowcoin Card convert crypto when I pay?',
    answer:
      'When you tap your card, we sell the exact amount of your chosen crypto at the live rate and settle the merchant in local currency. It all happens in milliseconds.',
  },
  {
    question: 'Which countries do you support?',
    answer:
      'The app and exchange are available in 90+ countries. Card availability depends on your region; check the app for the latest list.',
  },
  {
    question: 'Can my business accept crypto payments?',
    answer:
      'Yes. Nowcoin Pay offers plug-ins for popular e-commerce platforms plus an API for custom checkouts, with same-day fiat settlement.',
  },
  {
    question: 'Do you offer APIs for developers?',
    answer:
      'Nowcoin Connect exposes REST and WebSocket APIs with SDKs for TypeScript, Python, Go, Java, Swift and Kotlin. A free sandbox is available instantly.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'We moved our treasury to Nowcoin Vault in a week. The policy engine alone replaced three internal tools.',
    name: 'Amara Okafor',
    role: 'CFO, Lumen Labs',
  },
  {
    quote:
      'Nowcoin Pay cut our cross-border settlement time from four days to four hours.',
    name: 'Jonas Weber',
    role: 'Head of Payments, Kinetik',
  },
  {
    quote:
      'The Connect API is the cleanest crypto SDK we have integrated. Card issuing took an afternoon.',
    name: 'Priya Raman',
    role: 'CTO, Stackpay',
  },
  {
    quote: 'I use my Nowcoin Card every day. The cashback basically pays for my coffee habit.',
    name: 'Leo Martins',
    role: 'Designer, Lisbon',
  },
  {
    quote:
      'Finally a wallet my parents can use without writing down 24 words.',
    name: 'Sofia Chen',
    role: 'Product Manager, Singapore',
  },
];
