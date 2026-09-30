import { PageMeta } from '@/components/layout/PageMeta'
import { MagneticButton } from '@/components/ui/MagneticButton'

export default function NotFound() {
  return (
    <section className="not-found container">
      <PageMeta title="Page not found" />
      <span className="eyebrow">Error 404</span>
      <h1 className="gradient-text">Lost in the mempool.</h1>
      <p>The page you are looking for doesn't exist or has moved.</p>
      <MagneticButton to="/">Back to home</MagneticButton>
    </section>
  )
}
