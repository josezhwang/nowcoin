import { MagneticButton } from '../components/MagneticButton'
import { Reveal, SplitWords } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { tiltHandlers } from '../lib/hooks'

// Placeholder company story — replace with real milestones and team details.
const VALUES = [
  { title: 'Customers own their money', body: 'We design every product so that users stay in control, with clear custody choices and no hidden rehypothecation.' },
  { title: 'Security is the product', body: 'We would rather ship later than ship something we cannot defend. Every release goes through independent review.' },
  { title: 'Radically transparent', body: 'Reserves, fees and incidents are published openly. Trust is earned in public.' },
  { title: 'Make it feel simple', body: 'Crypto is complex. Our job is to absorb that complexity so our customers never have to.' },
]

const TIMELINE = [
  { year: '2019', text: 'Founded with a single mission: make crypto usable for the next billion people.' },
  { year: '2020', text: 'Launched Nowcoin Wallet with MPC key protection and no seed phrases.' },
  { year: '2021', text: 'Nowcoin Exchange goes live with 100+ trading pairs.' },
  { year: '2022', text: 'First Nowcoin Cards shipped; one million customers reached.' },
  { year: '2024', text: 'Nowcoin Pay and Nowcoin Vault launched for businesses and institutions.' },
  { year: '2026', text: 'Nowcoin Connect API opens our infrastructure to every developer.' },
]

const OPENINGS = [
  ['Senior Rust Engineer, Matching Engine', 'Remote · EU'],
  ['Staff Security Engineer, MPC', 'Singapore'],
  ['Product Designer, Card', 'Lisbon'],
  ['Compliance Lead, MiCA', 'Paris'],
]

export function CompanyPage() {
  return (
    <>
      <section className="page-hero container">
        <div className="glow" style={{ width: 520, height: 520, background: '#6d28d9', top: -140, left: '40%', opacity: 0.35 }} />
        <span className="eyebrow">About Nowcoin Digital</span>
        <h1>
          <SplitWords text="We're building the" />
          <br />
          <SplitWords text="financial internet." className="gradient-text" delay={0.25} />
        </h1>
        <p className="page-lede">
          Nowcoin Digital started with a simple idea: owning, spending and building with digital assets should be as easy as
          using a bank app, and far more open.
        </p>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="What we believe" title="Our principles" />
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="feature glass spotlight tilt" {...tiltHandlers}>
                  <span className="feature-num">0{i + 1}</span>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our journey" title="From a wallet to an ecosystem" />
          <ol className="timeline">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <li>
                  <span className="timeline-year">{t.year}</span>
                  <p>{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="careers">
        <div className="container">
          <SectionHeading eyebrow="Careers" title="Build what's next with us" body="We're a remote-first team across 20+ countries." />
          <div className="openings">
            {OPENINGS.map(([role, loc]) => (
              <a key={role} href="#" className="opening">
                <span>{role}</span>
                <span className="opening-loc">{loc}</span>
                <span className="bento-arrow">↗</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <MagneticButton to="/contact" variant="ghost">
              Don't see your role? Get in touch
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  )
}
