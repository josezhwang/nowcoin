import { Counter } from '@/components/ui/Counter'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { GlobeScene } from '@/three/GlobeScene'
import { LazyCanvas } from '@/three/LazyCanvas'
import { GlowFallback } from '@/components/ui/CardFallback'

const FACTS = [
  { value: 60, suffix: '+', label: 'countries with same-day settlement' },
  { value: 4.2, suffix: 's', decimals: 1, label: 'average cross-border transfer' },
  { value: 24, suffix: '/7', label: 'settlement — weekends included' },
]

export function Network() {
  const reduced = useReducedMotion()
  return (
    <section className="section network" id="network">
      <div className="container network-grid">
        <div className="network-copy">
          <SectionHeading
            eyebrow="Global rails"
            title={
              <>
                Money at the speed <span className="gradient-text">of the internet.</span>
              </>
            }
            body="Nowcoin Pay moves value across borders on stablecoin rails. No correspondent banks, no cut-off times, no four-day waits."
          />
          <div className="network-facts">
            {FACTS.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.1} className="network-fact">
                <strong>
                  <Counter value={f.value} suffix={f.suffix} decimals={f.decimals} />
                </strong>
                <span>{f.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
        <LazyCanvas
          className="globe-canvas"
          camera={{ position: [0, 0, 7], fov: 45 }}
          fallback={<GlowFallback color="#22d3ee" />}
        >
          <GlobeScene reduced={reduced} />
        </LazyCanvas>
      </div>
    </section>
  )
}
