import { Moon, Sun } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useTheme } from '@/theme/useTheme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      data-theme-state={theme}
    >
      <Sun className="theme-icon sun" size={18} strokeWidth={1.8} aria-hidden />
      <Moon className="theme-icon moon" size={18} strokeWidth={1.8} aria-hidden />
    </button>
  )
}
