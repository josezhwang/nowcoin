import type { ReactNode } from 'react'

interface Props {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}

/** Framed header used at the top of inner pages, matching the home hero. */
export function PageHeader({ eyebrow, title, lead, children }: Props) {
  return (
    <section className="page-header">
      <div className="container">
        <div className="page-header-frame">
          <div className="ambient" aria-hidden />
          <div className="page-header-inner">
            <span className="badge">
              <span className="badge-dot" aria-hidden />
              {eyebrow}
            </span>
            <h1 className="tone">{title}</h1>
            {lead && <p className="lead">{lead}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
