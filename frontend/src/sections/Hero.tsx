import { ArrowRight, Star } from 'lucide-react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Counter } from '@/components/ui/Counter'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { avatarPhoto, images } from '@/config/images'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { HeroDashboard } from './HeroDashboard'

const AVATARS = ['Amara Okafor', 'Jonas Weber', 'Priya Raman', 'Leo Martins']

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // The dashboard starts angled in 3D and settles flat as the page scrolls.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const rotateX = useTransform(smooth, [0, 0.45], [12, 0])
  const rotateY = useTransform(smooth, [0, 0.45], [-14, 0])
  const y = useTransform(smooth, [0, 1], [0, -40])
  const tilt = reduced ? undefined : { rotateX, rotateY, y }

  return (
    <section className="hero" aria-labelledby="hero-title" ref={ref}>
      <div className="container">
        <div className="hero-frame beam" data-pointer>
          <div className="ambient" aria-hidden />
          <div className="aurora" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="hero-grid-glow" aria-hidden />
          <div className="hero-pointer-glow" aria-hidden />
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

              <motion.h1 id="hero-title" className="hero-title tone shimmer" {...rise(0.08)}>
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
                  <strong>
                    <Counter value={2.4} decimals={1} suffix="M+" />
                  </strong>{' '}
                  customers in 90+ countries
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
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div className="hero-tilt" style={tilt}>
                <HeroDashboard />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
