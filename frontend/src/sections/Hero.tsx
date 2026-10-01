import { motion } from 'framer-motion'
import { ArrowUpRight, Grip, Layers } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { WordRise } from '@/components/ui/TextReveal'
import { Vault } from '@/components/vault/Vault'
import { HeroCards } from './HeroCards'

const EASE = [0.22, 1, 0.36, 1] as const
const fade = (delay: number, y = 14) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
})

/**
 * Hero: the vault sits at the very top (cubes rising out of a square hole in a
 * rounded slab), with the headline emerging beneath it and stat cards floating
 * at the sides.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden>
        <div className="hero-aura" />
        <div className="starfield" />
        <div className="hero-halo" />
      </div>

      <motion.div
        className="vault-wrap"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.1, ease: EASE }}
      >
        <Vault />
      </motion.div>

      <div className="container hero-inner">
        <motion.span className="badge hero-badge" {...fade(0.9, 8)}>
          <span className="badge-tag">New</span>
          <motion.span
            className="hero-badge-text"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2, ease: EASE }}
          >
            <Grip size={12} aria-hidden /> AI-powered insights
          </motion.span>
        </motion.span>

        <h1 id="hero-title" className="hero-title tone">
          <WordRise delay={0.45}>
            Spend, Send &amp; Grow Crypto
            <br />
            <em>with Total Confidence.</em>
          </WordRise>
        </h1>

        <motion.p className="hero-sub" {...fade(1.05)}>
          Your wallet, card, trades and business payments — on one regulated platform.
        </motion.p>

        <motion.div className="hero-actions" {...fade(1.15)}>
          <span className="cta-wrap">
            <span className="cta-halo" aria-hidden />
            <ButtonLink to="/#download" size="lg" className="hero-cta">
              <Layers size={16} aria-hidden /> Start Earning Now
            </ButtonLink>
          </span>
          <ButtonLink to="/products" variant="secondary" size="lg" className="hero-cta">
            Explore Products <ArrowUpRight size={16} aria-hidden />
          </ButtonLink>
        </motion.div>
      </div>

      <HeroCards />
    </section>
  )
}
