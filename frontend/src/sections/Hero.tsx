import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SplitWords } from '@/components/ui/Reveal'
import { CardFallback } from '@/components/ui/CardFallback'
import { useIntroDone } from '@/lib/intro'
import { supportsWebGL } from '@/lib/webgl'

// The 3D card, coins and particle disk are rendered by the shared <World />
// canvas behind the page; this component is the copy layered on top.
export function Hero() {
  const play = useIntroDone()
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden>
        <div
          className="glow"
          style={{ width: 620, height: 620, background: '#6d28d9', top: -220, right: '8%', opacity: 0.35 }}
        />
        <div className="hero-grid" />
      </div>

      {!supportsWebGL() && (
        <div className="hero-fallback" aria-hidden>
          <CardFallback colors={['#6d28d9', '#0891b2']} />
        </div>
      )}

      <div className="container hero-content">
        <motion.span className="hero-pill" {...fadeUp(0.1)}>
          <span className="pill-tag">New</span> Nowcoin Card Singularity — now in metal
          <ArrowRight size={14} aria-hidden />
        </motion.span>

        <h1 className="hero-title">
          <SplitWords text="Money," delay={0.2} play={play} />
          <br />
          <SplitWords text="reimagined" className="gradient-text" delay={0.3} play={play} />
          <br />
          <SplitWords text="on-chain." delay={0.45} play={play} />
        </h1>

        <motion.p className="hero-sub" {...fadeUp(0.7)}>
          Buy, hold, spend and build with crypto. One platform for your wallet, your card, your trades, and the payment
          rails behind your business.
        </motion.p>

        <motion.div className="hero-actions" {...fadeUp(0.85)}>
          <MagneticButton to="/#download">
            Get started <ArrowRight size={16} className="arrow" aria-hidden />
          </MagneticButton>
          <MagneticButton to="/#products" variant="ghost">
            Explore products
          </MagneticButton>
        </motion.div>

        <motion.ul className="hero-trust" {...fadeUp(1)}>
          <li>
            <strong>2.4M+</strong> customers
          </li>
          <li>
            <strong>1:1</strong> reserves
          </li>
          <li>
            <strong>90+</strong> countries
          </li>
        </motion.ul>
      </div>

      <div className="scroll-hint" aria-hidden>
        <span />
        Scroll to fly
      </div>
    </section>
  )
}
