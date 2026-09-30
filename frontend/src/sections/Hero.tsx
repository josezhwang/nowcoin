import { ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { avatarPhoto, images } from '@/config/images'
import { HeroDashboard } from './HeroDashboard'

const AVATARS = ['Amara Okafor', 'Jonas Weber', 'Priya Raman', 'Leo Martins']

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-frame">
          <div className="ambient" aria-hidden />
          {/* Optional 3D render behind the dashboard; hidden in production until added. */}
          <ImageSlot
            image={images.hero.art}
            className="hero-art"
            keepRatio={false}
            fit="cover"
            radius="0"
            priority
            fallback={import.meta.env.DEV ? undefined : null}
          />

          <div className="hero-grid">
            <div className="hero-copy">
              <motion.span className="badge" {...rise(0)}>
                <span className="badge-tag">New</span>
                Nowcoin Card Singularity — now in metal
              </motion.span>

              <motion.h1 id="hero-title" className="hero-title tone" {...rise(0.08)}>
                The safe and reliable way to <strong>spend, send and grow</strong> your crypto
              </motion.h1>

              <motion.p className="lead" {...rise(0.16)}>
                One regulated platform for your wallet, card, trades and business payments — with bank-grade security
                and settlement in seconds.
              </motion.p>

              <motion.div className="hero-actions" {...rise(0.24)}>
                <ButtonLink to="/#download" size="lg">
                  Get started <ArrowRight size={18} aria-hidden />
                </ButtonLink>
                <ButtonLink to="/products" variant="secondary" size="lg">
                  Explore products
                </ButtonLink>
              </motion.div>

              <motion.div className="hero-trust" {...rise(0.32)}>
                <div className="avatar-stack" aria-hidden>
                  {AVATARS.map((name) => (
                    <ImageSlot key={name} image={avatarPhoto(name)} radius="50%" compact className="avatar-sm" />
                  ))}
                </div>
                <div>
                  <strong>2.4M+</strong> customers in 90+ countries
                  <span className="rating">
                    <span className="stars" aria-hidden>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                      ))}
                    </span>
                    4.8 average rating
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hero-visual-wrap"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroDashboard />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
