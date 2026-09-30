import { ImageIcon } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { ImageSpec } from '@/config/images'

interface Props {
  image: ImageSpec
  className?: string
  /** Match the slot's box to the image's aspect ratio (default true). */
  keepRatio?: boolean
  fit?: 'cover' | 'contain'
  radius?: string
  /** Hero imagery should load eagerly; everything else lazily. */
  priority?: boolean
  /** Hide the text hint inside tiny slots (icons, avatars). */
  compact?: boolean
  /** Rendered instead of the dashed placeholder when the file is missing. */
  fallback?: React.ReactNode
}

/**
 * Shows an image from `config/images.ts`. If the file hasn't been added yet it
 * keeps the space with a neutral placeholder, printing the expected path and
 * size during development so it's obvious what to export.
 */
export function ImageSlot({
  image,
  className = '',
  keepRatio = true,
  fit = 'cover',
  radius,
  priority = false,
  compact = false,
  fallback,
}: Props) {
  const [missing, setMissing] = useState(false)
  const style = {
    ...(keepRatio ? { aspectRatio: `${image.width} / ${image.height}` } : null),
    ...(radius ? { '--slot-radius': radius } : null),
    '--slot-fit': fit,
  } as CSSProperties

  if (missing) {
    if (fallback !== undefined) return <>{fallback}</>
    return (
      <div
        className={`image-slot is-empty${compact ? ' is-compact' : ''} ${className}`}
        style={style}
        role={image.alt ? 'img' : undefined}
        aria-label={image.alt || undefined}
        aria-hidden={image.alt ? undefined : true}
      >
        <span className="slot-hint">
          <ImageIcon size={compact ? 16 : 22} strokeWidth={1.5} aria-hidden />
          {import.meta.env.DEV && (
            <>
              <span>
                {image.width}×{image.height}
              </span>
              <code>public{image.src}</code>
            </>
          )}
        </span>
      </div>
    )
  }

  return (
    <div className={`image-slot ${className}`} style={style}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        onError={() => setMissing(true)}
      />
    </div>
  )
}
