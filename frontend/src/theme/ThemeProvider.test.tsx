import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { ThemeProvider } from './ThemeProvider'
import { THEME_STORAGE_KEY } from './theme'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeProvider', () => {
  it('starts from the theme applied by the inline script', () => {
    document.documentElement.dataset.theme = 'light'
    renderToggle()
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument()
  })

  it('toggles the theme, updates <html> and remembers the choice', async () => {
    document.documentElement.dataset.theme = 'dark'
    renderToggle()

    await userEvent.click(screen.getByRole('button', { name: /switch to light theme/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument()
  })
})
