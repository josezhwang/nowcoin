import { Play, Smartphone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useSubscribe } from '@/api/queries'
import { Reveal } from '@/components/ui/Reveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CoinRainScene } from '@/three/CoinRainScene'
import { LazyCanvas } from '@/three/LazyCanvas'

export function Cta() {
  const [email, setEmail] = useState('')
  const subscribe = useSubscribe()
  const reduced = useReducedMotion()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    subscribe.mutate(email, { onSuccess: () => setEmail('') })
  }

  return (
    <section className="section cta-section" id="download">
      <div className="container">
        <Reveal className="cta-panel">
          <div className="cta-orb" aria-hidden />
          <LazyCanvas className="cta-coins" camera={{ position: [0, 0, 8], fov: 40 }} fallback={null}>
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
              <Smartphone size={20} aria-hidden />
              <span>
                <small>Download on the</small>App Store
              </span>
            </a>
            <a href="#" className="store">
              <Play size={20} aria-hidden />
              <span>
                <small>Get it on</small>Google Play
              </span>
            </a>
          </div>

          <form className="newsletter" onSubmit={submit} noValidate={false}>
            <label htmlFor="nl-email" className="sr-only">
              Email address
            </label>
            <input
              id="nl-email"
              className="input"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={subscribe.isError || undefined}
              aria-describedby="nl-status"
            />
            <button type="submit" className="btn btn-primary" disabled={subscribe.isPending}>
              {subscribe.isPending ? 'Joining…' : 'Get product updates'}
            </button>
          </form>
          <p
            id="nl-status"
            className={`form-status ${subscribe.isSuccess ? 'ok' : 'err'}`}
            role="status"
            aria-live="polite"
          >
            {subscribe.isSuccess && "You're on the list. Welcome aboard."}
            {subscribe.isError && subscribe.error.message}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
