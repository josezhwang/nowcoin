import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTeam } from '@/api/queries'
import type { TeamMember } from '@/api/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/Button'
import { MemberCard } from '@/components/ui/MemberCard'
import { Reveal } from '@/components/ui/Reveal'

type Filter = 'All' | TeamMember['department']

export default function TeamPage() {
  const { data: team, isError, refetch } = useTeam()
  const [filter, setFilter] = useState<Filter>('All')

  const departments = useMemo<Filter[]>(
    () => ['All', ...Array.from(new Set(team?.map((m) => m.department) ?? []))],
    [team],
  )
  const visible = filter === 'All' ? team : team?.filter((m) => m.department === filter)

  return (
    <>
      <PageMeta title="Team" description="Meet the people building Nowcoin Digital." />
      <PageHeader
        eyebrow="Our team"
        title={
          <>
            Built by operators <strong>from finance and crypto</strong>
          </>
        }
        lead="We're 180+ people across 20+ countries — engineers, designers, security specialists and compliance experts — building the financial layer of the internet."
      >
        <dl className="header-stats">
          <div>
            <dt>Team members</dt>
            <dd>180+</dd>
          </div>
          <div>
            <dt>Countries</dt>
            <dd>20+</dd>
          </div>
          <div>
            <dt>Languages spoken</dt>
            <dd>30</dd>
          </div>
        </dl>
      </PageHeader>

      <section className="section">
        <div className="container">
          {isError && (
            <p className="error-note" role="alert">
              The team list is unavailable right now.{' '}
              <button type="button" className="link-button" onClick={() => refetch()}>
                Try again
              </button>
            </p>
          )}

          {team && (
            <div className="segmented team-filter" role="tablist" aria-label="Filter by department">
              {departments.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={filter === d}
                  className={`segmented-item${filter === d ? ' is-active' : ''}`}
                  onClick={() => setFilter(d)}
                >
                  {filter === d && <motion.span layoutId="team-pill" className="segmented-pill" />}
                  {d}
                </button>
              ))}
            </div>
          )}

          <div className="team-grid">
            {visible
              ? visible.map((m, i) => (
                  <Reveal key={m.slug} delay={(i % 4) * 0.05}>
                    <MemberCard member={m} />
                  </Reveal>
                ))
              : !isError &&
                Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton" style={{ height: 460 }} />)}
          </div>

          <Reveal className="join-card card">
            <div>
              <h2 className="tone">
                Want to build <strong>the future of money</strong> with us?
              </h2>
              <p className="lead">We hire globally and remote-first. See open roles or tell us how you'd contribute.</p>
            </div>
            <div className="hero-actions">
              <ButtonLink to="/company#careers">
                Open roles <ArrowUpRight size={16} aria-hidden />
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                Get in touch
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
