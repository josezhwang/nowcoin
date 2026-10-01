import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import type { CardTier } from '@/api/types'
import { usePauseOffscreen } from '@/hooks/usePauseOffscreen'
import { AntennaSurface, BackSurface, ChipPlate, CoreSurface, FaceSurface } from './CardSurfaces'
import { CARD_H, CARD_W, layerSpecs, type CardView, type LayerId } from './cardGeometry'

// Design sizes of the stage; it is scaled down uniformly to fit its column.
const WIDE = { w: 1000, h: 620 }
const COMPACT = { w: 580, h: 600 }

/** Scales the fixed-size stage to its container and flags narrow layouts. */
function useFitScale(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const width = entry.contentRect.width
      const compact = width < 700
      const { w, h } = compact ? COMPACT : WIDE
      el.style.setProperty('--dw', `${w}px`)
      el.style.setProperty('--dh', `${h}px`)
      el.style.setProperty('--cs', String(Math.min(1, width / w)))
      el.toggleAttribute('data-compact', compact)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
}

/** Feeds the pointer position (-1…1) to CSS as --px / --py for the tilt and glare. */
function usePointerTilt(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const still =
      matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches ||
      document.documentElement.hasAttribute('data-lowpower')
    if (still) return

    let frame = 0
    const set = (x: number, y: number) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', x.toFixed(3))
        el.style.setProperty('--py', y.toFixed(3))
      })
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
    }
    const leave = () => set(0, 0)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref])
}

const RAILS: [number, number][] = [
  [16, 16],
  [CARD_W - 16, 16],
  [CARD_W - 16, CARD_H - 16],
  [16, CARD_H - 16],
]

interface Props {
  tier: CardTier
  view: CardView
  focus: LayerId | null
  onFocus: (id: LayerId | null) => void
}

/**
 * The Nowcoin Card as a real object: five physical layers (contact plate,
 * printed face, NFC inlay, core, back) stacked in CSS 3D. In the "layers" view
 * they fan apart into an exploded diagram with callouts; "front" and "back"
 * show the assembled card. No WebGL — every layer is a composited plane, so it
 * runs smoothly even on software rendering.
 */
export function CardExplode({ tier, view, focus, onFocus }: Props) {
  const fitRef = useRef<HTMLDivElement>(null)
  usePauseOffscreen(fitRef)
  useFitScale(fitRef)
  usePointerTilt(fitRef)

  const metal = tier.material === 'metal'
  const layers = layerSpecs(metal)

  const surfaces: Record<LayerId, ReactNode> = {
    chip: <ChipPlate />,
    face: (
      <>
        <span className="cx-slice" />
        <FaceSurface name={tier.name} />
      </>
    ),
    antenna: <AntennaSurface />,
    core: (
      <>
        {[1, 2, 3].map((n) => (
          <span key={n} className="cx-slice" style={{ '--d': n } as CSSProperties} />
        ))}
        <CoreSurface metal={metal} />
      </>
    ),
    back: (
      <>
        <BackSurface />
        <BackSurface className="is-under" />
      </>
    ),
  }

  return (
    <div className="cx-fit" ref={fitRef} aria-hidden>
      <div
        className={`cx${metal ? ' is-metal' : ''}`}
        data-view={view}
        data-focus={focus ?? undefined}
        style={{ '--c0': tier.colors[0], '--c1': tier.colors[1] } as CSSProperties}
      >
        <div className="cx-floor" />
        <div className="cx-float">
          <div className="cx-tilt">
            <div className="cx-card">
              <span className="cx-shadow" />
              <span className="cx-pool" />
              {RAILS.map(([x, y]) => (
                <span key={`${x}.${y}`} className="cx-rail" style={{ left: x, top: y }} />
              ))}
              <span className="cx-scan" />

              {/* Painted bottom-up: when the assembled layers are too close for the
                  compositor to depth-sort, DOM order decides — and must match. */}
              {layers
                .map((l, i) => [l, i] as const)
                .reverse()
                .map(([l, i]) => {
                  const lifted = view === 'layers' && focus === l.id ? 28 : 0
                  const z = (view === 'layers' ? l.exploded : l.flat) + lifted
                  return (
                    <div
                      key={l.id}
                      className={`cx-layer is-${l.id}${focus === l.id ? ' is-focus' : ''}`}
                      style={{ '--z': `${z}px`, '--i': i } as CSSProperties}
                    >
                      {surfaces[l.id]}
                      <div
                        className={`cx-pin is-${l.side}`}
                        style={{ '--ax': `${l.anchor[0]}px`, '--ay': `${l.anchor[1]}px` } as CSSProperties}
                      >
                        <div
                          className={`cx-tag is-${l.side}`}
                          style={{ '--lead': `${l.lead}px` } as CSSProperties}
                          onPointerEnter={() => onFocus(l.id)}
                          onPointerLeave={() => onFocus(null)}
                        >
                          <span className="cx-tag-line" />
                          <span className="cx-tag-body">
                            <b>0{i + 1}</b>
                            <span>
                              <strong>{l.title}</strong>
                              <small>{l.body}</small>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
