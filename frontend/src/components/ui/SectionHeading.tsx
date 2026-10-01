import type { ReactNode } from 'react'
import { BrandMark } from './BrandMark'
import { Reveal } from './Reveal'
import { CharReveal } from './TextReveal'

interface Props {
  eyebrow?: string
  /** Use <em> for the muted part and <strong> for the violet accent. */
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  /** Content shown to the right of the heading on wide screens (e.g. a CTA). */
  aside?: ReactNode
  id?: string
}

export function SectionHeading({ eyebrow, title, body, align = 'left', aside, id }: Props) {
  const cls = `section-head${align === 'center' ? ' center' : ''}${aside ? ' split' : ''}`
  return (
    <div className={cls}>
      <div className="section-head-main">
        {eyebrow && (
          <Reveal>
            <span className="chip-label">
              <BrandMark /> {eyebrow}
            </span>
          </Reveal>
        )}
        <h2 className="tone" id={id}>
          <CharReveal>{title}</CharReveal>
        </h2>
        {body && (
          <Reveal delay={0.1}>
            <p>{body}</p>
          </Reveal>
        )}
      </div>
      {aside && (
        <Reveal delay={0.15} className="section-aside">
          {aside}
        </Reveal>
      )}
    </div>
  )
}
