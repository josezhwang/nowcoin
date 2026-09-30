import { KeyRound, Radar, Scale, Snowflake } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { GlowFallback } from '@/components/ui/CardFallback'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { LazyCanvas } from '@/three/LazyCanvas'
import { VaultScene } from '@/three/VaultScene'

const PILLARS = [
  {
    icon: KeyRound,
    title: 'MPC key sharding',
    body: 'Private keys are split into shards stored in separate secure enclaves. No single device or employee can move funds.',
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
    title: '24/7 threat monitoring',
    body: 'A dedicated security operations team and real-time anomaly detection guard every transaction.',
  },
]

export function Security() {
  const reduced = useReducedMotion()
  return (
    <section className="section security" id="security">
      <div className="container security-grid">
        <LazyCanvas
          className="vault-canvas"
          camera={{ position: [0, 0.4, 7.5], fov: 42 }}
          fallback={<GlowFallback color="#22d3ee" />}
        >
          <VaultScene reduced={reduced} />
        </LazyCanvas>
        <div>
          <SectionHeading
            eyebrow="Security first"
            title={
              <>
                Built like a vault. <span className="gradient-text">Open like a glass box.</span>
              </>
            }
            body="Security is not a feature we bolt on. It's the foundation every product is built on, and we prove it publicly."
          />
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} className="pillar" delay={i * 0.08}>
                <span className="pillar-icon" aria-hidden>
                  <p.icon size={20} strokeWidth={1.8} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
