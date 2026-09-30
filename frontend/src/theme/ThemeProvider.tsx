import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ThemeContext, type ThemeContextValue } from './context'
import { getInitialTheme, persistTheme, scenePalettes, THEME_STORAGE_KEY, type Theme } from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => persistTheme(theme), [theme])

  // Follow the OS setting until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      let stored: string | null = null
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      if (!stored) setTheme(mq.matches ? 'light' : 'dark')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback<ThemeContextValue['toggleTheme']>(
    (origin) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduced || !origin) {
        setTheme(next)
        return
      }
      // Circular reveal from the toggle using the View Transitions API.
      const transition = document.startViewTransition(() => flushSync(() => setTheme(next)))
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y),
      )
      transition.ready
        .then(() =>
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
              ],
            },
            { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
          ),
        )
        .catch(() => undefined)
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, palette: scenePalettes[theme], toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
