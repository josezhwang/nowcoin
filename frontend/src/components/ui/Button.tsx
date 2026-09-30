import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'inverse' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  to: string
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

/** Router link styled as a button. External URLs render a plain anchor. */
export function ButtonLink({ to, variant = 'primary', size = 'md', children, className = '' }: Props) {
  const cls = `btn btn-${variant}${size === 'md' ? '' : ` btn-${size}`} ${className}`.trim()
  if (/^(https?:|mailto:)/.test(to)) {
    return (
      <a href={to} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  )
}
