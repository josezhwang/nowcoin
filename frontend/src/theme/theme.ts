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
