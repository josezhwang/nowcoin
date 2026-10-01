import { createContext } from 'react'
import type { Theme } from './theme'

export interface ThemeContextValue {
  theme: Theme
  /** Switches theme; pass the click origin to animate a circular reveal from it. */
  toggleTheme: (origin?: { x: number; y: number }) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
