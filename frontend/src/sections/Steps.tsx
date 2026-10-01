import { ArrowUpRight } from 'lucide-react'
import type { HomeContent } from '@/api/types'
import { ButtonLink } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { images } from '@/config/images'

/** PeachWeb-style three-step flow, each card with a screenshot slot. */
export function Steps({ steps }: { steps: HomeContent['steps'] }) {
  return (
    <section className="section steps" aria-labelledby="steps-title">
      <div className="container">
        <SectionHeading
          id="steps-title"
          eyebrow="Get started"
          title={
            <>
              From sign-up to spending
              <br />
              <em>in three steps</em>
            </>
          }
          aside={
            <ButtonLink to="/#download" variant="secondary">
              Open your account <ArrowUpRight size={15} aria-hidden />
            </ButtonLink>
          }
        />
        <ol className="steps-row">
          <span className="steps-rail" aria-hidden>
            <i />
          </span>
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <li className="step-card spot">
                <span className="step-num">0{i + 1}</span>
                <h3>{s.title}</h3>
                {images.steps[i] && <ImageSlot image={images.steps[i]!} radius="14px" className="step-shot" />}
                <p>{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
