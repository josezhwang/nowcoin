import { Link } from 'react-router-dom'
import { site } from '@/config/site'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f6bff" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logo-g)" />
        <path
          d="M10 22V10l12 12V10"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="logo-word">
        {site.shortName}
        <span> Digital</span>
      </span>
    </Link>
  )
}
