import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { images } from '@/config/images'
import { usePauseOffscreen } from '@/hooks/usePauseOffscreen'

const CAPTIONS = [
  'Card payments',
  'Cross-border transfers',
  'Merchant checkout',
  'Portfolio view',
  'Treasury approvals',
  'Earn dashboard',
  'Developer console',
  'Metal card',
]

/** Two rows of image cards drifting in opposite directions (PeachWeb gallery). */
export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  usePauseOffscreen(ref)
  const rows = [images.gallery.slice(0, 4), images.gallery.slice(4, 8)]

  return (
    <section className="section gallery" aria-labelledby="gallery-title" ref={ref}>
      <div className="container">
        <SectionHeading
          id="gallery-title"
          eyebrow="In action"
          title={
            <>
              Nowcoin, wherever
              <br />
              <em>money moves</em>
            </>
          }
          aside={
            <ButtonLink to="/products" variant="secondary">
              Browse products <ArrowUpRight size={15} aria-hidden />
            </ButtonLink>
          }
        />
      </div>
      {rows.map((row, r) => (
        <div key={r} className={`gallery-row${r ? ' is-reverse' : ''}`}>
          <div className="gallery-track">
            {[...row, ...row].map((img, i) => (
              <figure key={i} className="gallery-card" aria-hidden={i >= row.length || undefined}>
                <ImageSlot image={img} radius="14px" />
                <figcaption>{CAPTIONS[(r * 4 + (i % row.length)) % CAPTIONS.length]}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
