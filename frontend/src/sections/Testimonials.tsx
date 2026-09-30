import { Marquee } from '@/components/ui/Marquee'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { HomeContent } from '@/api/types'

export function Testimonials({ items }: { items: HomeContent['testimonials'] }) {
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half).concat(items.slice(0, 1))]

  return (
    <section className="section testimonials">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Loved worldwide"
          title={
            <>
              Trusted by people <span className="gradient-text">and platforms.</span>
            </>
          }
        />
      </div>
      {rows.map((row, r) => (
        <Marquee key={r} duration={60} reverse={r === 1}>
          {row.map((t) => (
            <figure className="quote glass" key={t.name + r}>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <span className="avatar" aria-hidden>
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      ))}
    </section>
  )
}
