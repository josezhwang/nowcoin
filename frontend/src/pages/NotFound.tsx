import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageMeta } from '@/components/layout/PageMeta'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found" />
      <PageHeader
        eyebrow="Error 404"
        title={
          <>
            This page <em>doesn&rsquo;t exist.</em>
          </>
        }
        lead="The link may be broken or the page may have moved."
      >
        <div className="hero-actions">
          <ButtonLink to="/">
            <ArrowLeft size={16} aria-hidden /> Back to home
          </ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Contact support
          </ButtonLink>
        </div>
      </PageHeader>
    </>
  )
}
