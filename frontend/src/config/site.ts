/**
 * Brand and navigation config — the single place to change company details.
 * Values marked "placeholder" must be replaced before launch.
 */
export const site = {
  name: 'Nowcoin Digital',
  shortName: 'Nowcoin',
  description: 'Nowcoin Digital builds the wallet, card, exchange and payment infrastructure for the on-chain economy.',
  domain: 'nowcoin.digital', // placeholder
  emails: {
    sales: 'sales@nowcoin.digital', // placeholder
    support: 'support@nowcoin.digital', // placeholder
    press: 'press@nowcoin.digital', // placeholder
  },
  social: [
    { label: 'X', href: 'https://x.com/', icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'Discord', href: 'https://discord.com/', icon: 'discord' },
  ],
} as const

export type SocialIcon = (typeof site.social)[number]['icon']

export const navLinks = [
  { label: 'Card', to: '/#card' },
  { label: 'Business', to: '/products/pay' },
  { label: 'Developers', to: '/#developers' },
  { label: 'Company', to: '/company' },
] as const

export const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'Nowcoin Wallet', to: '/products/wallet' },
      { label: 'Nowcoin Card', to: '/products/card' },
      { label: 'Nowcoin Exchange', to: '/products/exchange' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'Nowcoin Pay', to: '/products/pay' },
      { label: 'Nowcoin Vault', to: '/products/custody' },
      { label: 'Contact sales', to: '/contact' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Connect API', to: '/products/api' },
      { label: 'Documentation', to: '/#developers' },
      { label: 'Status', to: '/#developers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/company' },
      { label: 'Careers', to: '/company#careers' },
      { label: 'Press', to: '/contact' },
    ],
  },
] as const

// Placeholder: list only certifications the company actually holds.
export const complianceBadges = ['SOC 2 Type II', 'ISO/IEC 27001', 'PCI DSS Level 1', 'Proof of Reserves'] as const
