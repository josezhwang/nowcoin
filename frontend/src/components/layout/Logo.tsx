import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/ui/BrandMark'
import { site } from '@/config/site'

/** Dark rounded tile with the N glyph; optionally followed by the wordmark. */
export function Logo({ withWordmark = false }: { withWordmark?: boolean }) {
  return (
    <Link to="/" className="logo" aria-label={`${site.name} home`}>
      <span className="logo-tile">
        <BrandMark size={20} />
      </span>
      {withWordmark && (
        <span className="logo-word">
          {site.shortName}
          <span> Digital</span>
        </span>
      )}
    </Link>
  )
}
