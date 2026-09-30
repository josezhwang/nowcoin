import type { TeamMember } from '@/api/types'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { teamPhoto } from '@/config/images'
import { ImageSlot } from './ImageSlot'

const LINK_LABELS = { linkedin: 'LinkedIn', x: 'X', github: 'GitHub' } as const

export function MemberCard({ member, showBio = true }: { member: TeamMember; showBio?: boolean }) {
  const links = Object.entries(member.links) as [keyof typeof LINK_LABELS, string | undefined][]
  return (
    <article className="member card">
      <ImageSlot image={teamPhoto(member.slug, member.name)} radius="14px" className="member-photo" />
      <div className="member-body">
        <h3>{member.name}</h3>
        <p className="member-role">{member.role}</p>
        {showBio && <p className="member-bio">{member.bio}</p>}
        <div className="member-foot">
          <span className="member-loc">{member.department}</span>
          <span className="member-links">
            {links.map(
              ([kind, href]) =>
                href && (
                  <a key={kind} href={href} aria-label={`${member.name} on ${LINK_LABELS[kind]}`} className="social">
                    <SocialIcon kind={kind} size={14} />
                  </a>
                ),
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
