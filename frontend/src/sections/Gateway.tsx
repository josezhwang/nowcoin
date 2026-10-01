import { ArrowLeftRight, ArrowUpRight, CreditCard, ShieldCheck, Store, Wallet, type LucideIcon } from 'lucide-react'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { BrandMark } from '@/components/ui/BrandMark'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { CharReveal } from '@/components/ui/TextReveal'
import { images } from '@/config/images'
import { usePauseOffscreen } from '@/hooks/usePauseOffscreen'

// Stage design size; everything is laid out in these units and scaled as percentages.
const W = 1200
const H = 620
const RING = { x: 600, y: 300, r: 128 }

interface Node {
  key: string
  label: string
  y: number
  icon: ReactNode
}

const productIcon = (slug: string, Icon: LucideIcon) =>
  images.productIcons[slug] ? (
    <ImageSlot image={images.productIcons[slug]!} fit="contain" radius="10px" compact fallback={<Icon size={24} />} />
  ) : (
    <Icon size={24} />
  )

const chainIcon = (key: string, glyph: string) =>
  images.chains[key] ? (
    <ImageSlot image={images.chains[key]!} fit="contain" radius="50%" compact fallback={<b>{glyph}</b>} />
  ) : (
    <b>{glyph}</b>
  )

const PRODUCTS: Node[] = [
  { key: 'wallet', label: 'Wallet', y: 135, icon: productIcon('wallet', Wallet) },
  { key: 'card', label: 'Card', y: 255, icon: productIcon('card', CreditCard) },
  { key: 'pay', label: 'Pay', y: 375, icon: productIcon('pay', Store) },
  { key: 'exchange', label: 'Exchange', y: 495, icon: productIcon('exchange', ArrowLeftRight) },
]

const NETWORKS: Node[] = [
  { key: 'ethereum', label: 'Ethereum', y: 95, icon: chainIcon('ethereum', 'Ξ') },
  { key: 'bitcoin', label: 'Bitcoin', y: 205, icon: chainIcon('bitcoin', '₿') },
  { key: 'solana', label: 'Solana', y: 315, icon: chainIcon('solana', '◎') },
  { key: 'polygon', label: 'Polygon', y: 425, icon: chainIcon('polygon', '⬡') },
  { key: 'base', label: 'Base', y: 535, icon: chainIcon('base', 'B') },
]

const SPREAD = [-12, -7, -2, 3, 8, 13]

/** One bundle of parallel cables between a node and the ring. */
function bundle(fromX: number, fromY: number, toX: number, toY: number) {
  const mid = (fromX + toX) / 2
  return SPREAD.map((o) => {
    const y0 = fromY + o * 0.7
    const y1 = toY + o * 0.45
    return `M${fromX} ${y0} C${mid} ${y0}, ${mid} ${y1}, ${toX} ${y1}`
  })
}

const LEFT_WIRES = PRODUCTS.map((n, i) => bundle(196, n.y, RING.x - RING.r - 18, RING.y + (i - 1.5) * 12))
const RIGHT_WIRES = NETWORKS.map((n, i) => bundle(RING.x + RING.r + 18, RING.y + (i - 2) * 10, 1004, n.y))

const pct = (v: number, of: number) => `${(v / of) * 100}%`

/** One light packet per bundle, each in its own small SVG (cheap to repaint). */
const FLOWS = [...LEFT_WIRES, ...RIGHT_WIRES].map((wires) => {
  const d = wires[2]!
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const xs = nums.filter((_, k) => k % 2 === 0)
  const ys = nums.filter((_, k) => k % 2 === 1)
  const x = Math.min(...xs) - 6
  const y = Math.min(...ys) - 6
  return { d, x, y, w: Math.max(...xs) + 6 - x, h: Math.max(...ys) + 6 - y }
})

function NodeTile({ node, x, kind }: { node: Node; x: number; kind: 'product' | 'network' }) {
  return (
    <div className={`gw-node is-${kind}`} style={{ left: pct(x, W), top: pct(node.y, H) }}>
      <span className="gw-tile">{node.icon}</span>
      <span className="gw-label">{node.label}</span>
    </div>
  )
}

/**
 * "Cross-chain gateway" diagram after the Ithaca reference: products wired into
 * a central settlement engine, which fans out to the networks. The stage is
 * tilted in perspective; light packets run along the cable bundles.
 */
export function Gateway() {
  const ref = useRef<HTMLElement>(null)
  usePauseOffscreen(ref)

  return (
    <section className="section gateway force-dark" aria-labelledby="gateway-title" ref={ref}>
      <div className="starfield" aria-hidden />
      <div className="gw-perspective" aria-hidden>
        <div className="gw-stage">
          <svg className="gw-wires" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            {[...LEFT_WIRES, ...RIGHT_WIRES].flat().map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
          {FLOWS.map((f, i) => (
            <svg
              key={f.d}
              className="gw-flow"
              viewBox={`${f.x} ${f.y} ${f.w} ${f.h}`}
              preserveAspectRatio="none"
              style={
                {
                  left: pct(f.x, W),
                  top: pct(f.y, H),
                  width: pct(f.w, W),
                  height: pct(f.h, H),
                  '--dur': `${3 + (i % 3) * 0.7}s`,
                  '--delay': `${-i * 0.45}s`,
                } as CSSProperties
              }
            >
              <path d={f.d} pathLength={1} />
            </svg>
          ))}

          <div className="gw-gateway" style={{ left: pct(70, W), top: pct(40, H) }}>
            <i /> Gateway
          </div>

          {PRODUCTS.map((n) => (
            <NodeTile key={n.key} node={n} x={150} kind="product" />
          ))}
          {NETWORKS.map((n) => (
            <NodeTile key={n.key} node={n} x={1050} kind="network" />
          ))}

          <div
            className="gw-ring"
            style={{
              left: pct(RING.x - RING.r, W),
              top: pct(RING.y - RING.r, H),
              width: pct(RING.r * 2, W),
            }}
          >
            <svg viewBox="-150 -150 300 300" className="gw-ring-base">
              <defs>
                <path id="gw-arc-text" d="M -104 0 A 104 104 0 0 1 104 0" />
              </defs>
              <circle r="128" className="gw-ring-glow" />
              <circle r="128" className="gw-ring-line" />
              <text className="gw-ring-text">
                <textPath href="#gw-arc-text" startOffset="7%">
                  NOWCOIN
                </textPath>
              </text>
            </svg>
            <svg viewBox="-150 -150 300 300" className="gw-ring-arc">
              <circle r="128" pathLength={100} />
            </svg>
            <svg viewBox="-150 -150 300 300" className="gw-ring-dash">
              <circle r="96" />
            </svg>
            <span className="gw-ring-label">
              Unified
              <br />
              Settlement Engine
            </span>
            <span className="gw-ports is-left" />
            <span className="gw-ports is-right" />
          </div>

          <div className="gw-chip" style={{ left: pct(RING.x, W), top: pct(RING.y + RING.r + 54, H) }}>
            <ShieldCheck size={13} /> MPC SECURED
          </div>
        </div>
      </div>

      <div className="container gw-copy">
        <Reveal className="gw-brand">
          <span className="gw-wordmark">N O W C O I N</span>
          <span className="gw-badge">
            <BrandMark size={12} /> Verified infrastructure
          </span>
        </Reveal>
        <h2 id="gateway-title" className="tone">
          <CharReveal>
            One Engine. Every Product,
            <br />
            <em>Every Chain.</em>
          </CharReveal>
        </h2>
        <Reveal delay={0.1}>
          <p>
            Wallet, card, payments and trading all settle through the same audited engine — routed to the right network
            automatically, in seconds.
          </p>
        </Reveal>
        <Reveal delay={0.18} className="gw-actions">
          <ButtonLink to="/products">
            View All Products <ArrowUpRight size={15} aria-hidden />
          </ButtonLink>
          <ButtonLink to="/company" variant="secondary">
            Learn More <ArrowUpRight size={15} aria-hidden />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
