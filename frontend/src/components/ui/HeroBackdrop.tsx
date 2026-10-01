import type { CSSProperties } from 'react'

/**
 * Stakent-style hero backdrop: a giant, dimly lit extruded "N" mark, a stage
 * spotlight from above, a dot-grid halo behind the copy, and short violet light
 * streaks that race along the shape's edges at random intervals.
 */

// Edges the streaks travel along (viewBox 1440×900). [path, duration s, delay s]
const STREAKS: [string, number, number][] = [
  ['M150 560 L310 150', 5.5, -0.5],
  ['M310 150 L1020 60', 7, -3.2],
  ['M1020 60 L1290 560', 6, -1.4],
  ['M1290 560 L1160 860', 5, -4.1],
  ['M930 110 L700 640', 6.5, -2.2],
  ['M580 170 L390 720', 7.5, -5.3],
  ['M1210 330 L1060 770', 5.8, -0.9],
  ['M430 890 L150 560', 6.2, -3.8],
  // Chevrons flanking the headline: "<" on the left, ">" on the right.
  ['M360 470 L270 540 L360 610', 4.6, -1.1],
  ['M1080 460 L1170 530 L1080 600', 4.6, -3.4],
]

export function HeroBackdrop({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`hero-backdrop${compact ? ' is-compact' : ''}`} aria-hidden>
      <svg className="hero-shape" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hb-face" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="var(--shape-face-b)" />
            <stop offset="1" stopColor="var(--shape-face-a)" />
          </linearGradient>
          <linearGradient id="hb-band" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--shape-face-b)" />
            <stop offset="1" stopColor="var(--shape-face-c)" />
          </linearGradient>
          <radialGradient id="hb-vignette" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0.55" stopColor="var(--bg)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--bg)" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Main slab */}
        <polygon points="310,150 1020,60 1290,560 1160,860 430,890 150,560" fill="url(#hb-face)" />
        {/* Extrusion side faces for depth */}
        <polygon points="150,560 310,150 350,190 205,570" fill="var(--shape-face-c)" />
        <polygon points="1290,560 1160,860 1118,818 1238,560" fill="var(--shape-face-c)" />
        {/* The N's diagonal strokes */}
        <polygon points="580,170 930,110 700,640 390,720" fill="url(#hb-band)" />
        <polygon points="850,390 1210,330 1060,770 700,820" fill="url(#hb-band)" opacity="0.8" />
        {/* Hairline edges */}
        <g fill="none" stroke="var(--shape-edge)" strokeWidth="1.2">
          <polygon points="310,150 1020,60 1290,560 1160,860 430,890 150,560" />
          <polygon points="580,170 930,110 700,640 390,720" />
          <polygon points="850,390 1210,330 1060,770 700,820" />
        </g>

        <rect width="1440" height="900" fill="url(#hb-vignette)" />
      </svg>
      {/* Streaks in their own layer so their animation never repaints the shape. */}
      <svg className="hero-shape hero-streaks" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g className="streaks">
          {STREAKS.map(([d, dur, delay], i) => (
            <g key={i} style={{ '--dur': `${dur}s`, '--delay': `${delay}s` } as CSSProperties}>
              <path d={d} pathLength={1} className="streak streak-glow" />
              <path d={d} pathLength={1} className="streak streak-core" />
            </g>
          ))}
        </g>
      </svg>

      <div className="hero-spotlight" />
      <div className="hero-dots" />
    </div>
  )
}
