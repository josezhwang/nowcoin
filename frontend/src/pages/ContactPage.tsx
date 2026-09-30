import { CheckCircle2, Handshake, Headset, Mail, Newspaper, Send } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useContact } from '@/api/queries'
import type { ContactPayload, ContactTopic } from '@/api/types'
import { PageMeta } from '@/components/layout/PageMeta'
import { PageHeader } from '@/components/layout/PageHeader'
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
  {
    icon: Mail,
    label: 'Sales',
    body: 'Pay, Vault and API pricing for businesses.',
    value: site.emails.sales,
    href: `mailto:${site.emails.sales}`,
  },
  { icon: Headset, label: 'Support', body: 'Real people, 24/7, in 12 languages.', value: 'In-app chat' },
  {
    icon: Handshake,
    label: 'Partnerships',
    body: 'Integrations, listings and co-marketing.',
    value: site.emails.sales,
    href: `mailto:${site.emails.sales}`,
  },
  {
    icon: Newspaper,
    label: 'Press',
    body: 'Media enquiries and brand assets.',
    value: site.emails.press,
    href: `mailto:${site.emails.press}`,
  },
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
    <>
      <PageMeta title="Contact" description="Talk to Nowcoin Digital sales, support, partnerships or press." />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let&rsquo;s talk <em>about what you&rsquo;re building</em>
          </>
        }
        lead="Whether you're integrating Nowcoin Pay, moving a treasury into Nowcoin Vault, or just have a question — we usually reply within one business day."
      />

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-side">
            <ul className="channel-grid">
              {CHANNELS.map(({ icon: Icon, label, body, value, href }) => (
                <li key={label} className="channel card">
                  <span className="pillar-icon" aria-hidden>
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h2>{label}</h2>
                  <p>{body}</p>
                  {href ? (
                    <a href={href} className="channel-link">
                      {value}
                    </a>
                  ) : (
                    <span className="channel-link">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {contact.isSuccess ? (
            <div className="contact-form card contact-success" role="status">
              <CheckCircle2 size={44} aria-hidden />
              <h2>Message received</h2>
              <p>Thanks for reaching out. Our team will get back to you within one business day.</p>
              <button type="button" className="btn btn-secondary" onClick={() => contact.reset()}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form card" onSubmit={submit}>
              <h2 className="form-title">Send us a message</h2>
              <div className="form-row">
                <label className="field">
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
                <label className="field">
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
                <label className="field">
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
                <label className="field">
                  Topic
                  <select className="select input" value={form.topic} onChange={field('topic')}>
                    {TOPICS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                How can we help?
                <textarea
                  className="textarea input"
                  rows={6}
                  required
                  maxLength={4000}
                  value={form.message}
                  onChange={field('message')}
                />
              </label>
              <button type="submit" className="btn btn-primary btn-lg" disabled={contact.isPending}>
                {contact.isPending ? 'Sending…' : 'Send message'} <Send size={16} aria-hidden />
              </button>
              <p className="form-status err" role="alert">
                {contact.isError && contact.error.message}
              </p>
              <p className="form-note">
                By submitting, you agree to our <a href="#">privacy policy</a>. We never share your details.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
