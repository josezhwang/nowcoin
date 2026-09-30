import { ArrowUpRight, Eye, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { images } from '@/config/images'

// Placeholder company story — replace with real milestones and roles.
const VALUES = [
  {
    icon: HeartHandshake,
    title: 'Customers own their money',
    body: 'Clear custody choices and no hidden rehypothecation — ever.',
  },
  {
    icon: ShieldCheck,
    title: 'Security is the product',
    body: "We'd rather ship later than ship something we can't defend.",
  },
  { icon: Eye, title: 'Radically transparent', body: 'Reserves, fees and incidents are published openly.' },
  {
    icon: Sparkles,
    title: 'Make it feel simple',
    body: 'We absorb the complexity of crypto so customers never have to.',
  },
]

const TIMELINE = [
  { year: '2019', text: 'Founded with one mission: make crypto usable for the next billion people.' },
  { year: '2020', text: 'Launched Nowcoin Wallet with MPC key protection and no seed phrases.' },
  { year: '2021', text: 'Nowcoin Exchange goes live with 100+ trading pairs.' },
  { year: '2022', text: 'First Nowcoin Cards shipped; one million customers reached.' },
  { year: '2024', text: 'Nowcoin Pay and Nowcoin Vault launched for businesses and institutions.' },
  { year: '2026', text: 'Nowcoin Connect API opens our infrastructure to every developer.' },
]

const OPENINGS = [
  { role: 'Senior Rust Engineer, Matching Engine', team: 'Engineering', type: 'Remote' },
  { role: 'Staff Security Engineer, MPC', team: 'Security', type: 'Hybrid' },
  { role: 'Product Designer, Card', team: 'Design', type: 'Remote' },
  { role: 'Compliance Lead', team: 'Legal', type: 'Hybrid' },
]

export default function CompanyPage() {
  return (
    <>
      <PageMeta title="Company" description="Our mission, values and story — and how to join us." />
      <PageHeader
        eyebrow="About Nowcoin Digital"
        title={
          <>
            We&rsquo;re building <strong>the financial internet</strong>
          </>
        }
        lead="Nowcoin Digital started with a simple idea: owning, spending and building with digital assets should be as easy as using a bank app — and far more open."
      />

      <section className="product-media-section">
        <div className="container">
          <Reveal className="product-media-frame">
            <ImageSlot image={images.company.office} radius="16px" />
          </Reveal>
          <dl className="metrics-band">
            <div>
              <dt>Founded</dt>
              <dd>2019</dd>
            </div>
            <div>
              <dt>Customers</dt>
              <dd>2.4M+</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>180+</dd>
            </div>
            <div>
              <dt>Countries served</dt>
              <dd>90+</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What we believe"
            title={
              <>
                Principles <em>we don&rsquo;t compromise on</em>
              </>
            }
          />
          <div className="values-grid">
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <article className="value card spot">
                  <span className="pillar-icon" aria-hidden>
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our journey"
            title={
              <>
                From a wallet <strong>to an ecosystem</strong>
              </>
            }
          />
          <ol className="timeline">
            {TIMELINE.map((t) => (
              <li key={t.year}>
                <span className="timeline-year">{t.year}</span>
                <p>{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="careers">
        <div className="container">
          <SectionHeading
            eyebrow="Careers"
            title={
              <>
                Build what&rsquo;s next <em>with us</em>
              </>
            }
            aside={
              <ButtonLink to="/team" variant="secondary">
                Meet the team <ArrowUpRight size={16} aria-hidden />
              </ButtonLink>
            }
          />
          <ul className="openings">
            {OPENINGS.map((o) => (
              <li key={o.role}>
                <a href="#" className="opening">
                  <span className="opening-role">{o.role}</span>
                  <span className="opening-meta">{o.team}</span>
                  <span className="opening-meta">{o.type}</span>
                  <ArrowUpRight size={18} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
