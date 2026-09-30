import { Link } from 'react-router-dom'
import { site } from '@/config/site'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="rgba(255,255,255,0.06)" />
        <path
          d="M18 46V18l28 28V18"
          fill="none"
          stroke="url(#logo-g)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        Nowcoin <b>Digital</b>
      </span>
    </Link>
  )
}
