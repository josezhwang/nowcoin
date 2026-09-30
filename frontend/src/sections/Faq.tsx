import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { HomeContent } from '@/api/types'

export function Faq({ faqs }: { faqs: HomeContent['faqs'] }) {
  const [open, setOpen] = useState<number | null>(0)

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
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {f.question}
                  <span className="faq-icon" aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
