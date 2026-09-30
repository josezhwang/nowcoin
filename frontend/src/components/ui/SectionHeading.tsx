import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'

interface Props {
  eyebrow: string
  title: ReactNode
  body?: ReactNode
  center?: boolean
}

export function SectionHeading({ eyebrow, title, body, center }: Props) {
  return (
    <Reveal className={`section-heading${center ? ' center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </Reveal>
  )
}
