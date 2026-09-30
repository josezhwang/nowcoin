import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

const COLUMNS = [
  {
    title: 'Products',
    links: [
      ['Nowcoin Wallet', '/products/wallet'],
      ['Nowcoin Card', '/products/card'],
      ['Nowcoin Exchange', '/products/exchange'],
    ],
  },
  {
    title: 'Business',
    links: [
      ['Nowcoin Pay', '/products/pay'],
      ['Nowcoin Vault', '/products/custody'],
      ['Contact sales', '/contact'],
    ],
  },
  {
    title: 'Developers',
    links: [
      ['Connect API', '/products/api'],
      ['Documentation', '/#developers'],
      ['Status', '/#developers'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/company'],
      ['Careers', '/company#careers'],
      ['Press', '/contact'],
    ],
  },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>The wallet, card, exchange and payment rails for the on-chain economy.</p>
            <div className="socials">
              {['X', 'Discord', 'LinkedIn', 'GitHub'].map((s) => (
                <a key={s} href="#" aria-label={s} className="social">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              {col.links.map(([label, to]) => (
                <Link key={label} to={to}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-badges">
          {['SOC 2 Type II', 'ISO/IEC 27001', 'PCI DSS Level 1', 'Proof of Reserves'].map((b) => (
            <span key={b} className="badge">
              {b}
            </span>
          ))}
        </div>

        <div className="footer-legal">
          <p>
            Crypto-assets are volatile and you may lose some or all of your investment. Past performance is not a
            reliable indicator of future results. Card services are subject to availability in your region.
          </p>
          <div className="footer-bottom">
            <span>© {YEAR} Nowcoin Digital. All rights reserved.</span>
            <span className="footer-legal-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </span>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden>
          Nowcoin
        </div>
      </div>
    </footer>
  )
}
