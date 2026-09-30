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
  background: string
  fogNear: number
  fogFar: number
  stars: string[]
  starOpacity: number
  additive: boolean
  bloom: boolean
  globeOcean: string
  globeDots: string
  globeArc: string
  atmosphere: string
  vaultShell: string
}

export const scenePalettes: Record<Theme, ScenePalette> = {
  dark: {
    background: '#05050a',
    fogNear: 14,
    fogFar: 70,
    stars: ['#ffffff', '#c4b5fd', '#67e8f9', '#e9d5ff'],
    starOpacity: 1,
    additive: true,
    bloom: true,
    globeOcean: '#07071a',
    globeDots: '#8b7cf6',
    globeArc: '#22d3ee',
    atmosphere: '#7c5cff',
    vaultShell: '#0b1024',
  },
  light: {
    background: '#f4f3fb',
    fogNear: 12,
    fogFar: 60,
    stars: ['#6d28d9', '#4f46e5', '#0891b2', '#a855f7'],
    starOpacity: 0.55,
    additive: false,
    bloom: false,
    globeOcean: '#eceafd',
    globeDots: '#5b43d6',
    globeArc: '#0891b2',
    atmosphere: '#8b5cf6',
    vaultShell: '#dfe7ff',
  },
}
