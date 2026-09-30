import { fireEvent, render, screen } from '@testing-library/react'
import { ImageSlot } from './ImageSlot'

const spec = { src: '/images/features/security.png', width: 160, height: 160, alt: 'Security' }

describe('ImageSlot', () => {
  it('renders the image when the file exists', () => {
    render(<ImageSlot image={spec} />)
    expect(screen.getByRole('img', { name: 'Security' })).toHaveAttribute('src', spec.src)
  })

  it('keeps the space with a labelled placeholder when the file is missing', () => {
    const { container } = render(<ImageSlot image={spec} />)
    fireEvent.error(screen.getByRole('img', { name: 'Security' }))
    const slot = container.querySelector('.image-slot')
    expect(slot).toHaveClass('is-empty')
    expect(slot).toHaveAttribute('aria-label', 'Security')
    expect(screen.getByText(`public${spec.src}`)).toBeInTheDocument()
  })

  it('renders a custom fallback instead of the placeholder when given one', () => {
    render(<ImageSlot image={spec} fallback={<span>fallback</span>} />)
    fireEvent.error(screen.getByRole('img', { name: 'Security' }))
    expect(screen.getByText('fallback')).toBeInTheDocument()
  })
})
