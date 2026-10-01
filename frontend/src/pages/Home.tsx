import { useHomeContent } from '@/api/queries'
import { PageMeta } from '@/components/layout/PageMeta'
import { Bento } from '@/sections/Bento'
import { CardSection } from '@/sections/CardSection'
import { Cta } from '@/sections/Cta'
import { Faq } from '@/sections/Faq'
import { FeatureDome } from '@/sections/FeatureDome'
import { Gallery } from '@/sections/Gallery'
import { Gateway } from '@/sections/Gateway'
import { Global } from '@/sections/Global'
import { Hero } from '@/sections/Hero'
import { Highlights } from '@/sections/Highlights'
import { LogoCloud } from '@/sections/LogoCloud'
import { Showcase } from '@/sections/Showcase'
import { Steps } from '@/sections/Steps'
import { TeamPreview } from '@/sections/TeamPreview'
import { Testimonials } from '@/sections/Testimonials'

export default function Home() {
  const { data } = useHomeContent()

  return (
    <>
      <PageMeta />
      <Hero />
      <LogoCloud />
      <Highlights />
      <Gateway />
      <Bento />
      <FeatureDome />
      {data && <Steps steps={data.steps} />}
      <Showcase />
      <Global />
      <CardSection />
      <Gallery />
      <TeamPreview />
      {data && <Testimonials items={data.testimonials} />}
      {data && <Faq faqs={data.faqs} />}
      <Cta />
    </>
  )
}
