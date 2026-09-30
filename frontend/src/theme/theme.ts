export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'nowcoin-theme'

/** Reads the theme the inline script in index.html already applied, to avoid a flash. */
export function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function persistTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the theme still applies for this visit.
  }
}

/** Colours the WebGL scenes need, which CSS custom properties can't reach. */
export interface ScenePalette {
  /** Additive blending glows on dark backgrounds but vanishes on light ones. */
  additive: boolean
  globeOcean: string
  globeDots: string
  globeArc: string
  atmosphere: string
  /** Halo opacity multiplier. */
  atmosphereStrength: number
  globeRim: string
}

export const scenePalettes: Record<Theme, ScenePalette> = {
  dark: {
    additive: true,
    globeOcean: '#0b0a1d',
    globeDots: '#9d8cff',
    globeArc: '#8fa2ff',
    atmosphere: '#6d5dfc',
    atmosphereStrength: 1.25,
    globeRim: '#3a2f8f',
  },
  light: {
    additive: false,
    globeOcean: '#f3f2ff',
    globeDots: '#3f36c9',
    globeArc: '#5b4cf0',
    atmosphere: '#8b5cf6',
    atmosphereStrength: 0.45,
    globeRim: '#d8d2ff',
  },
}
