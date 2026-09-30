import { useState, type FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { post } from '../lib/api'
import { useReducedMotion } from '../lib/hooks'
import { CoinRainScene } from '../three/CoinRainScene'
import { LazyCanvas } from '../three/LazyCanvas'

export function Cta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [sending, setSending] = useState(false)
  const reduced = useReducedMotion()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      await post('/newsletter', { email })
      setStatus({ ok: true, msg: "You're on the list. Welcome aboard." })
      setEmail('')
    } catch (err) {
      setStatus({ ok: false, msg: (err as Error).message })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section cta-section" id="download">
      <div className="container">
        <Reveal className="cta-panel">
          <div className="cta-orb" aria-hidden />
          <LazyCanvas className="cta-coins" camera={{ position: [0, 0, 8], fov: 40 }}>
            <CoinRainScene reduced={reduced} count={window.innerWidth < 700 ? 10 : 22} />
          </LazyCanvas>
          <span className="eyebrow">Join 2.4M+ people</span>
          <h2>
            Your money,
            <br />
            <span className="gradient-text">finally fluent in crypto.</span>
          </h2>
          <p>Download the Nowcoin app and open an account in minutes.</p>

          <div className="store-buttons">
            <a href="#" className="store">
              <span aria-hidden>↓</span>
              <span>
                <small>Download on the</small>App Store
              </span>
            </a>
            <a href="#" className="store">
              <span aria-hidden>↓</span>
              <span>
                <small>Get it on</small>Google Play
              </span>
            </a>
          </div>

          <form className="newsletter" onSubmit={submit}>
            <label htmlFor="nl-email" className="sr-only">
              Email address
            </label>
            <input
              id="nl-email"
              className="input"
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary" disabled={sending}>
              {sending ? 'Joining…' : 'Get product updates'}
            </button>
          </form>
          <p className={`form-status ${status?.ok ? 'ok' : 'err'}`} role="status">
            {status?.msg}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
