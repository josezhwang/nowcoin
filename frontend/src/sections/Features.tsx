import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { images, type ImageSpec } from '@/config/images'

interface Feature {
  icon: ImageSpec
  title: string
  body: string
}

// Icons are image slots — drop your own artwork into public/images/features/.
const LEFT: Feature[] = [
  {
    icon: images.features.security,
    title: 'Bank-grade security',
    body: 'MPC key protection, 95% cold storage and monthly proof of reserves.',
  },
  {
    icon: images.features.fast,
    title: 'Lightning fast',
    body: 'Card payments approve in under 300 ms; cross-border transfers settle in seconds.',
  },
  {
    icon: images.features.support,
    title: 'Always helpful',
    body: 'Real people on chat 24/7 in 12 languages, with a median reply time under two minutes.',
  },
]

const RIGHT: Feature[] = [
  {
    icon: images.features.global,
    title: 'Global by default',
    body: 'Hold, spend and send in 150+ currencies across 90+ countries.',
  },
  {
    icon: images.features.fees,
    title: 'Transparent fees',
    body: 'No hidden spreads or FX markups. Every fee is shown before you confirm.',
  },
  {
    icon: images.features.compliance,
    title: 'Fully regulated',
    body: 'Licensed and audited, with segregated customer assets held 1:1.',
  },
]

function FeatureCard({ f, delay }: { f: Feature; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="feature glass">
        <ImageSlot image={f.icon} className="feature-icon" fit="contain" radius="14px" compact />
        <h3>{f.title}</h3>
        <p>{f.body}</p>
      </article>
    </Reveal>
  )
}

export function Features() {
  return (
    <section className="section features" id="why" aria-labelledby="why-title">
      <div className="ambient" aria-hidden />
      <div className="container">
        <Reveal>
          <p className="statement" id="why-title">
            Unlock the power of <span className="pill pill-blue">hassle-free</span> and{' '}
            <span className="pill pill-green">secure payments</span> with Nowcoin — an{' '}
            <span className="pill pill-violet">advanced</span> platform crafted to{' '}
            <span className="pill pill-orange">redefine</span> how you use digital money.
          </p>
        </Reveal>

        <div className="features-layout">
          <div className="features-col">
            {LEFT.map((f, i) => (
              <FeatureCard key={f.title} f={f} delay={i * 0.08} />
            ))}
          </div>
          <Reveal className="features-center">
            <ImageSlot image={images.features.centerpiece} fit="contain" radius="32px" />
          </Reveal>
          <div className="features-col">
            {RIGHT.map((f, i) => (
              <FeatureCard key={f.title} f={f} delay={i * 0.08 + 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
