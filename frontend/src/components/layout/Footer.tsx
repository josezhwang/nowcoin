import { Link } from 'react-router-dom'
import { complianceBadges, footerColumns, site } from '@/config/site'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>The wallet, card, exchange and payment rails for the on-chain economy.</p>
            <ul className="socials" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} className="social" target="_blank" rel="noreferrer">
                    <SocialIcon kind={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {footerColumns.map((col) => (
            <nav key={col.title} className="footer-col" aria-label={col.title}>
              <h2>{col.title}</h2>
              {col.links.map((l) => (
                <Link key={l.label} to={l.to}>
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <ul className="footer-badges" aria-label="Certifications">
          {complianceBadges.map((b) => (
            <li key={b} className="badge">
              {b}
            </li>
          ))}
        </ul>

        <div className="footer-legal">
          <p>
            Crypto-assets are volatile and you may lose some or all of your investment. Past performance is not a
            reliable indicator of future results. Card services are subject to availability in your region.
          </p>
          <div className="footer-bottom">
            <span>
              © {YEAR} {site.name}. All rights reserved.
            </span>
            <span className="footer-legal-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </span>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden>
          {site.shortName}
        </div>
      </div>
    </footer>
  )
}
