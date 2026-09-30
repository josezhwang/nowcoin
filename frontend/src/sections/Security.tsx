import { KeyRound, Radar, Scale, Snowflake } from 'lucide-react'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { images } from '@/config/images'

const PILLARS = [
  {
    icon: KeyRound,
    title: 'MPC key sharding',
    body: 'Keys are split across isolated enclaves. No single device or employee can move funds.',
  },
  {
    icon: Snowflake,
    title: '95% cold storage',
    body: 'The vast majority of assets sit in air-gapped, geographically distributed vaults.',
  },
  {
    icon: Scale,
    title: 'Proof of reserves',
    body: 'Customer balances are backed 1:1 and independently attested every month.',
  },
  {
    icon: Radar,
    title: '24/7 monitoring',
    body: 'A dedicated security operations centre and real-time anomaly detection on every transaction.',
  },
]

export function Security() {
  return (
    <section className="section security" id="security" aria-labelledby="security-title">
      <div className="container security-grid">
        <Reveal className="security-media">
          <ImageSlot image={images.security} fit="contain" radius="24px" />
        </Reveal>
        <div>
          <SectionHeading
            id="security-title"
            eyebrow="Security & compliance"
            title={
              <>
                Built like a vault. <em>Audited like a bank.</em>
              </>
            }
            body="Security isn't a feature we add — it's the foundation every product is built on, and we prove it publicly."
          />
          <ul className="pillars">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="pillar-icon" aria-hidden>
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <ul className="cert-row" aria-label="Certifications">
            {images.certifications.map((c) => (
              <li key={c.src} title={c.alt}>
                <ImageSlot image={c} fit="contain" radius="12px" compact />
                <span>{c.alt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
