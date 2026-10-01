import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSubscribe } from '@/api/queries'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { images } from '@/config/images'
import { footerColumns, site } from '@/config/site'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

export function Footer() {
  const [email, setEmail] = useState('')
  const subscribe = useSubscribe()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    subscribe.mutate(email, { onSuccess: () => setEmail('') })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo withWordmark />
            <p>{site.description}</p>
            <form className="footer-newsletter" onSubmit={submit}>
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                className="input"
                type="email"
                required
                autoComplete="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary" disabled={subscribe.isPending} aria-label="Subscribe">
                <ArrowRight size={18} aria-hidden />
              </button>
            </form>
            <p className={`form-status ${subscribe.isSuccess ? 'ok' : 'err'}`} role="status">
              {subscribe.isSuccess && 'Subscribed — thanks!'}
              {subscribe.isError && subscribe.error.message}
            </p>
          </div>

          <div className="footer-cols">
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
        </div>

        <div className="footer-mid">
          <ul className="footer-badges" aria-label="Certifications">
            {images.certifications.map((c) => (
              <li key={c.src}>
                <ImageSlot image={c} fit="contain" radius="6px" compact className="cert-icon" />
                {c.alt}
              </li>
            ))}
          </ul>
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
              <a href="#">Licences</a>
            </span>
          </div>
        </div>
        {/* Oversized wordmark: faint by default, lit by a gradient spotlight under the pointer. */}
        <div className="footer-wordmark" data-pointer aria-hidden>
          <span className="wm-base">{site.shortName}</span>
          <span className="wm-glow">{site.shortName}</span>
        </div>
      </div>
    </footer>
  )
}
