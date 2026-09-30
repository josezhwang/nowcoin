import { site } from '@/config/site'

interface Props {
  /** Page name; omitted on the home page. */
  title?: string
  description?: string
}

/** Per-route <title> and description — React 19 hoists these into <head>. */
export function PageMeta({ title, description = site.description }: Props) {
  return (
    <>
      <title>{title ? `${title} · ${site.name}` : `${site.name} — Money, reimagined on-chain`}</title>
      <meta name="description" content={description} />
    </>
  )
}
