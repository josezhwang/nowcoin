import { Quote, Star } from 'lucide-react'
import type { HomeContent } from '@/api/types'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { avatarPhoto } from '@/config/images'

export function Testimonials({ items }: { items: HomeContent['testimonials'] }) {
  return (
    <section className="section testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading
          id="testimonials-title"
          align="center"
          eyebrow="Customers"
          title={
            <>
              Trusted by people <strong>and platforms</strong>
            </>
          }
        />
        <div className="quote-grid">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.06} className={i === 0 ? 'quote-featured' : undefined}>
              <figure className="quote card spot">
                <Quote size={22} className="quote-mark" aria-hidden />
                <span className="stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} aria-hidden />
                  ))}
                </span>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <ImageSlot image={avatarPhoto(t.name)} radius="50%" compact className="avatar" />
                  <span>
                    <strong>{t.name}</strong>
                    <small>{t.role}</small>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
