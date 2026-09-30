import { useState, type FormEvent } from 'react'
import { SplitWords } from '../components/Reveal'
import { post } from '../lib/api'

const TOPICS = [
  ['sales', 'Sales — Pay, Vault or API'],
  ['partnership', 'Partnerships'],
  ['support', 'Customer support'],
  ['press', 'Press & media'],
  ['other', 'Something else'],
] as const

const EMPTY = { name: '', email: '', company: '', topic: 'sales', message: '' }

export function ContactPage() {
  const [form, setForm] = useState(EMPTY)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      await post('/contact', { ...form, company: form.company || undefined })
      setStatus({ ok: true, msg: 'Thanks! Our team will get back to you within one business day.' })
      setForm(EMPTY)
    } catch (err) {
      setStatus({ ok: false, msg: (err as Error).message })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="page-hero container contact-grid">
      <div className="glow" style={{ width: 480, height: 480, background: '#0891b2', top: -100, left: '-10%', opacity: 0.3 }} />
      <div>
        <span className="eyebrow">Contact</span>
        <h1>
          <SplitWords text="Let's talk." />
        </h1>
        <p className="page-lede">
          Whether you're integrating Nowcoin Pay, moving a treasury into Nowcoin Vault, or just have a question, we're here.
        </p>
        <dl className="contact-info">
          <div>
            <dt>Sales</dt>
            <dd>sales@nowcoin.digital</dd>
          </div>
          <div>
            <dt>Support</dt>
            <dd>24/7 in-app chat</dd>
          </div>
          <div>
            <dt>Press</dt>
            <dd>press@nowcoin.digital</dd>
          </div>
        </dl>
      </div>

      <form className="contact-form glass" onSubmit={submit}>
        <div className="form-row">
          <label>
            Name
            <input className="input" required maxLength={120} value={form.name} onChange={set('name')} />
          </label>
          <label>
            Work email
            <input className="input" type="email" required value={form.email} onChange={set('email')} />
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              Company <span className="optional">(optional)</span>
            </span>
            <input className="input" maxLength={120} value={form.company} onChange={set('company')} />
          </label>
          <label>
            Topic
            <select className="select" value={form.topic} onChange={set('topic')}>
              {TOPICS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          How can we help?
          <textarea className="textarea" rows={5} required maxLength={4000} value={form.message} onChange={set('message')} />
        </label>
        <button className="btn btn-primary" disabled={sending}>
          {sending ? 'Sending…' : 'Send message'} <span className="arrow">→</span>
        </button>
        <p className={`form-status ${status?.ok ? 'ok' : 'err'}`} role="status">
          {status?.msg}
        </p>
      </form>
    </section>
  )
}
