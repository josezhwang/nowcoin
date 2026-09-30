import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface Props {
  eyebrow?: string
  /** Use <em> for de-emphasised words and <strong> for the gradient accent. */
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
    <Reveal className={cls}>
      <div className="section-head-main">
        {eyebrow && (
          <span className="badge">
            <span className="badge-dot" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h2 className="tone" id={id}>
          {title}
        </h2>
        {body && <p>{body}</p>}
      </div>
      {aside && <div className="section-aside">{aside}</div>}
    </Reveal>
  )
}
