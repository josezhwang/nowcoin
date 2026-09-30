import { ArrowUpRight } from 'lucide-react'
import { useTeam } from '@/api/queries'
import { ButtonLink } from '@/components/ui/Button'
import { MemberCard } from '@/components/ui/MemberCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function TeamPreview() {
  const { data: team } = useTeam()
  const leaders = team?.filter((m) => m.department === 'Leadership') ?? []

  return (
    <section className="section team-preview" aria-labelledby="team-title">
      <div className="container">
        <SectionHeading
          id="team-title"
          eyebrow="Leadership"
          title={
            <>
              The people <strong>behind Nowcoin</strong>
            </>
          }
          body="Operators from payments, trading and regulation, building the financial layer of the internet."
          aside={
            <ButtonLink to="/team" variant="secondary">
              Meet the whole team <ArrowUpRight size={16} aria-hidden />
            </ButtonLink>
          }
        />
        <div className="team-grid">
          {team
            ? leaders.map((m, i) => (
                <Reveal key={m.slug} delay={i * 0.06}>
                  <MemberCard member={m} showBio={false} />
                </Reveal>
              ))
            : Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton" style={{ height: 380 }} />)}
        </div>
      </div>
    </section>
  )
}
