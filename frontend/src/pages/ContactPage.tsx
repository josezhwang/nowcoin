import { CheckCircle2, Headset, Mail, Newspaper, Send } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useContact } from '@/api/queries'
import type { ContactPayload, ContactTopic } from '@/api/types'
import { PageMeta } from '@/components/layout/PageMeta'
import { SplitWords } from '@/components/ui/Reveal'
import { site } from '@/config/site'

const TOPICS: { value: ContactTopic; label: string }[] = [
  { value: 'sales', label: 'Sales — Pay, Vault or API' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'support', label: 'Customer support' },
  { value: 'press', label: 'Press & media' },
  { value: 'other', label: 'Something else' },
]

type FormState = Required<ContactPayload>

const EMPTY: FormState = { name: '', email: '', company: '', topic: 'sales', message: '' }

const CHANNELS = [
  { icon: Mail, label: 'Sales', value: site.emails.sales, href: `mailto:${site.emails.sales}` },
  { icon: Headset, label: 'Support', value: '24/7 in-app chat' },
  { icon: Newspaper, label: 'Press', value: site.emails.press, href: `mailto:${site.emails.press}` },
]

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const contact = useContact()

  const field =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const { company, ...rest } = form
    contact.mutate({ ...rest, company: company.trim() || undefined }, { onSuccess: () => setForm(EMPTY) })
  }

  return (
    <section className="page-hero container contact-grid">
      <PageMeta title="Contact" description="Talk to Nowcoin Digital sales, support or press." />
      <div
        className="glow"
        style={{ width: 480, height: 480, background: '#0891b2', top: -100, left: '-10%', opacity: 0.3 }}
      />
      <div>
        <span className="eyebrow">Contact</span>
        <h1>
          <SplitWords text="Let's talk." />
        </h1>
        <p className="page-lede">
          Whether you're integrating Nowcoin Pay, moving a treasury into Nowcoin Vault, or just have a question, we're
          here.
        </p>
        <ul className="contact-info">
          {CHANNELS.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <span className="contact-icon" aria-hidden>
                <Icon size={18} />
              </span>
              <span>
                <small>{label}</small>
                {href ? <a href={href}>{value}</a> : <span>{value}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {contact.isSuccess ? (
        <div className="contact-form glass contact-success" role="status">
          <CheckCircle2 size={44} aria-hidden />
          <h2>Message received</h2>
          <p>Thanks for reaching out. Our team will get back to you within one business day.</p>
          <button type="button" className="btn btn-ghost" onClick={() => contact.reset()}>
            Send another message
          </button>
        </div>
      ) : (
        <form className="contact-form glass" onSubmit={submit}>
          <div className="form-row">
            <label>
              Name
              <input
                className="input"
                required
                maxLength={120}
                autoComplete="name"
                value={form.name}
                onChange={field('name')}
              />
            </label>
            <label>
              Work email
              <input
                className="input"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={field('email')}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span>
                Company <span className="optional">(optional)</span>
              </span>
              <input
                className="input"
                maxLength={120}
                autoComplete="organization"
                value={form.company}
                onChange={field('company')}
              />
            </label>
            <label>
              Topic
              <select className="select" value={form.topic} onChange={field('topic')}>
                {TOPICS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            How can we help?
            <textarea
              className="textarea"
              rows={5}
              required
              maxLength={4000}
              value={form.message}
              onChange={field('message')}
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={contact.isPending}>
            {contact.isPending ? 'Sending…' : 'Send message'} <Send size={16} className="arrow" aria-hidden />
          </button>
          <p className="form-status err" role="alert">
            {contact.isError && contact.error.message}
          </p>
        </form>
      )}
    </section>
  )
}
