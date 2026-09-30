import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Boom(): never {
  throw new Error('WebGL context could not be created')
}

describe('ErrorBoundary', () => {
  it('renders the fallback instead of crashing the tree', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(
      <ErrorBoundary fallback={<p>3D unavailable</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('3D unavailable')).toBeInTheDocument()
  })
})
