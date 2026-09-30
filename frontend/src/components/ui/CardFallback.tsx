import type { CSSProperties } from 'react'
import { site } from '@/config/site'

interface Props {
  colors: readonly [string, string]
  name?: string
  className?: string
}

/** A CSS-3D payment card, used where WebGL is unavailable. */
export function CardFallback({ colors, name = 'Aurora', className = '' }: Props) {
  const style = { '--c0': colors[0], '--c1': colors[1] } as CSSProperties
  return (
    <div
      className={`card-fallback ${className}`}
      style={style}
      role="img"
      aria-label={`${site.shortName} ${name} card`}
    >
      <div className="card-fallback-inner">
        <span className="cf-brand">{site.name}</span>
        <span className="cf-tier">{name}</span>
        <span className="cf-chip" />
        <span className="cf-number">4291 •••• •••• 2049</span>
        <span className="cf-mark">{site.shortName.toUpperCase()}</span>
      </div>
    </div>
  )
}

/** A soft glowing orb, the generic fallback for decorative 3D scenes. */
export function GlowFallback({ color = '#8b5cf6' }: { color?: string }) {
  return <div className="gl-fallback" style={{ '--glow': color } as CSSProperties} aria-hidden />
}
