import type { HomeContent } from '@/api/types'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { images } from '@/config/images'

export function Steps({ steps }: { steps: HomeContent['steps'] }) {
  return (
    <section className="section steps" aria-labelledby="steps-title">
      <div className="container">
        <SectionHeading
          id="steps-title"
          align="center"
          eyebrow="Get started"
          title={
            <>
              Up and running <strong>in three steps</strong>
            </>
          }
          body="No paperwork marathons, no seed phrases to lose. Most customers are live within five minutes."
        />
        <ol className="steps-grid">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li className="step card">
                {images.steps[i] && <ImageSlot image={images.steps[i]!} radius="12px" className="step-media" />}
                <span className="step-num">Step {i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
