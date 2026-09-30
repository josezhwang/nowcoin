import { Play, Smartphone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useSubscribe } from '@/api/queries'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { images } from '@/config/images'

export function Cta() {
  const [email, setEmail] = useState('')
  const subscribe = useSubscribe()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    subscribe.mutate(email, { onSuccess: () => setEmail('') })
  }

  return (
    <section className="section cta" id="download" aria-labelledby="cta-title">
      <div className="container">
        <Reveal className="cta-panel">
          <div className="ambient" aria-hidden />
          <div className="cta-copy">
            <span className="badge">
              <span className="badge-dot" aria-hidden />
              Available on iOS and Android
            </span>
            <h2 id="cta-title" className="tone">
              Your money, <strong>finally fluent in crypto</strong>
            </h2>
            <p className="lead">Open an account in minutes. Join 2.4 million people already using Nowcoin.</p>

            <div className="store-buttons">
              <a href="#" className="store">
                <Smartphone size={22} aria-hidden />
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

            <form className="inline-form" onSubmit={submit}>
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                className="input"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email for product updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="cta-status"
              />
              <button type="submit" className="btn btn-primary" disabled={subscribe.isPending}>
                {subscribe.isPending ? 'Joining…' : 'Subscribe'}
              </button>
            </form>
            <p id="cta-status" className={`form-status ${subscribe.isSuccess ? 'ok' : 'err'}`} role="status">
              {subscribe.isSuccess && "You're on the list. Welcome aboard."}
              {subscribe.isError && subscribe.error.message}
            </p>
          </div>
          <div className="cta-media">
            <ImageSlot image={images.cta} fit="contain" radius="20px" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
