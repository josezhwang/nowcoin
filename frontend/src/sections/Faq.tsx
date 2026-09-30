import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { HomeContent } from '@/api/types'

export function Faq({ faqs }: { faqs: HomeContent['faqs'] }) {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <em>answered.</em>
            </>
          }
          body={
            <>
              Can&rsquo;t find what you need? <Link to="/contact">Talk to our team</Link> — we&rsquo;re online 24/7.
            </>
          }
        />
        <div className="faq-list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.question} className={`faq${isOpen ? ' open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`${baseId}-a${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {f.question}
                  <span className="faq-icon" aria-hidden />
                </button>
                <div className="faq-a" id={`${baseId}-a${i}`} role="region" aria-hidden={!isOpen}>
                  <div>
                    <p>{f.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
