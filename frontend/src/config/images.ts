/**
 * Every image the site can show. Drop files into `frontend/public/images/` at
 * these paths; until a file exists, the slot renders a neutral placeholder
 * (which also prints the expected path and size in development).
 *
 * Sizes are the recommended export size. Use PNG/WebP with transparency for
 * icons, logos and 3D renders; JPG/WebP for photos and screenshots.
 */
export interface ImageSpec {
  src: string
  width: number
  height: number
  alt: string
}

const img = (path: string, width: number, height: number, alt: string): ImageSpec => ({
  src: `/images/${path}`,
  width,
  height,
  alt,
})

export const images = {
  /** Round node icons on the Features dome (shown at 44px — export square). */
  features: {
    security: img('features/security.png', 160, 160, 'Security'),
    fast: img('features/fast.png', 160, 160, 'Speed'),
    support: img('features/support.png', 160, 160, 'Support'),
    global: img('features/global.png', 160, 160, 'Transparency'),
  },
  /** Product UI screenshots, 16:10. Keys match product slugs from the API. */
  products: {
    wallet: img('products/wallet.png', 1600, 1000, 'Nowcoin Wallet app'),
    card: img('products/card.png', 1600, 1000, 'Nowcoin Card in the app'),
    exchange: img('products/exchange.png', 1600, 1000, 'Nowcoin Exchange trading screen'),
    pay: img('products/pay.png', 1600, 1000, 'Nowcoin Pay merchant dashboard'),
    custody: img('products/custody.png', 1600, 1000, 'Nowcoin Vault custody console'),
    api: img('products/api.png', 1600, 1000, 'Nowcoin Connect developer dashboard'),
  } as Record<string, ImageSpec>,
  /** Square-ish product icons used in menus and cards. */
  productIcons: {
    wallet: img('products/icons/wallet.png', 128, 128, ''),
    card: img('products/icons/card.png', 128, 128, ''),
    exchange: img('products/icons/exchange.png', 128, 128, ''),
    pay: img('products/icons/pay.png', 128, 128, ''),
    custody: img('products/icons/custody.png', 128, 128, ''),
    api: img('products/icons/api.png', 128, 128, ''),
  } as Record<string, ImageSpec>,
  /** Blockchain logos on the gateway diagram (round, transparent background). */
  chains: {
    ethereum: img('chains/ethereum.png', 128, 128, 'Ethereum'),
    bitcoin: img('chains/bitcoin.png', 128, 128, 'Bitcoin'),
    solana: img('chains/solana.png', 128, 128, 'Solana'),
    polygon: img('chains/polygon.png', 128, 128, 'Polygon'),
    base: img('chains/base.png', 128, 128, 'Base'),
  } as Record<string, ImageSpec>,
  /** 3D render that floats over the highlight cards (transparent PNG). */
  highlights: {
    float: img('highlights/float.png', 640, 640, ''),
  },
  /** "Get started" step screenshots. */
  steps: [
    img('steps/step-1.png', 800, 600, 'Creating an account'),
    img('steps/step-2.png', 800, 600, 'Funding the wallet'),
    img('steps/step-3.png', 800, 600, 'Spending with the card'),
  ],
  /** Gallery of app and card shots. */
  gallery: Array.from({ length: 8 }, (_, i) => img(`gallery/gallery-${i + 1}.jpg`, 1200, 800, 'Nowcoin in use')),
  partners: [
    img('partners/partner-1.svg', 240, 80, 'Partner logo'),
    img('partners/partner-2.svg', 240, 80, 'Partner logo'),
    img('partners/partner-3.svg', 240, 80, 'Partner logo'),
    img('partners/partner-4.svg', 240, 80, 'Partner logo'),
    img('partners/partner-5.svg', 240, 80, 'Partner logo'),
    img('partners/partner-6.svg', 240, 80, 'Partner logo'),
  ],
  /** Footer certification badges — list only certifications the company actually holds. */
  certifications: [
    img('certifications/soc2.png', 200, 200, 'SOC 2 Type II'),
    img('certifications/iso27001.png', 200, 200, 'ISO/IEC 27001'),
    img('certifications/pci-dss.png', 200, 200, 'PCI DSS Level 1'),
    img('certifications/mica.png', 200, 200, 'MiCA'),
  ],
  cta: img('cta/app-phones.png', 1000, 1000, 'Nowcoin app on two phones'),
  company: {
    office: img('company/office.jpg', 1600, 900, 'The Nowcoin Digital team at work'),
  },
} as const

/** Team portraits (4:5) are keyed by the member slug from /api/team. */
export const teamPhoto = (slug: string, name: string) => img(`team/${slug}.jpg`, 800, 1000, name)

/** Testimonial avatars (1:1), keyed by a slug of the author's name. */
export const avatarPhoto = (name: string) =>
  img(`avatars/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`, 160, 160, name)
