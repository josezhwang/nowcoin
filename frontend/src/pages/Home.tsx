import { useHomeContent } from '@/api/queries'
import { PageMeta } from '@/components/layout/PageMeta'
import { CardSection } from '@/sections/CardSection'
import { Cta } from '@/sections/Cta'
import { Developers } from '@/sections/Developers'
import { Faq } from '@/sections/Faq'
import { Features } from '@/sections/Features'
import { Global } from '@/sections/Global'
import { Hero } from '@/sections/Hero'
import { LogoCloud } from '@/sections/LogoCloud'
import { Security } from '@/sections/Security'
import { Showcase } from '@/sections/Showcase'
import { Steps } from '@/sections/Steps'
import { TeamPreview } from '@/sections/TeamPreview'
import { Testimonials } from '@/sections/Testimonials'
import { TickerBar } from '@/sections/TickerBar'

export default function Home() {
  const { data } = useHomeContent()

  return (
    <>
      <PageMeta />
      <Hero />
      <TickerBar />
      <LogoCloud />
      <Features />
      <Showcase />
      <CardSection />
      <Global />
      {data && <Steps steps={data.steps} />}
      <Security />
      <Developers />
      <TeamPreview />
      {data && <Testimonials items={data.testimonials} />}
      {data && <Faq faqs={data.faqs} />}
      <Cta />
    </>
  )
}
