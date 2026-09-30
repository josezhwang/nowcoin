import { useHomeContent } from '@/api/queries'
import { PageMeta } from '@/components/layout/PageMeta'
import { CardAnatomy } from '@/sections/CardAnatomy'
import { CardSection } from '@/sections/CardSection'
import { Cta } from '@/sections/Cta'
import { Developers } from '@/sections/Developers'
import { Faq } from '@/sections/Faq'
import { Hero } from '@/sections/Hero'
import { KineticBand } from '@/sections/KineticBand'
import { Network } from '@/sections/Network'
import { Partners } from '@/sections/Partners'
import { Products } from '@/sections/Products'
import { Security } from '@/sections/Security'
import { Stats } from '@/sections/Stats'
import { Steps } from '@/sections/Steps'
import { Testimonials } from '@/sections/Testimonials'
import { TickerBar } from '@/sections/TickerBar'

export default function Home() {
  const { data } = useHomeContent()

  return (
    <>
      <PageMeta />
      <Hero />
      <TickerBar />
      {data ? <Stats stats={data.stats} /> : <div className="stats-skeleton container" aria-hidden />}
      <Partners />
      <Products />
      <KineticBand />
      <CardAnatomy />
      <CardSection />
      <Network />
      {data && <Steps steps={data.steps} />}
      <Security />
      <Developers />
      {data && <Testimonials items={data.testimonials} />}
      {data && <Faq faqs={data.faqs} />}
      <Cta />
    </>
  )
}
