import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import type { CardTier } from '@/api/types'
import { CardExplode } from './CardExplode'
import { coilPath } from './cardGeometry'

// jsdom has neither observer; the component only needs them to exist.
class Noop {
  observe() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', Noop)
vi.stubGlobal('IntersectionObserver', Noop)

const tier = (material: CardTier['material']): CardTier => ({
  id: 'aurora',
  name: 'Aurora',
  cashback: '2%',
  stake: '€400',
  monthlyFee: 'Free',
  material,
  colors: ['#22d3ee', '#6366f1'],
  perks: [],
})

describe('CardExplode', () => {
  it('stacks the five physical layers, painted bottom-up', () => {
    const { container } = render(<CardExplode tier={tier('metal')} view="layers" focus={null} onFocus={() => {}} />)
    const ids = [...container.querySelectorAll('.cx-layer')].map((el) => el.classList[1])
    expect(ids).toEqual(['is-back', 'is-core', 'is-antenna', 'is-face', 'is-chip'])
    expect(container.querySelector('.cx')).toHaveAttribute('data-view', 'layers')
  })

  it('fans the layers apart only in the exploded view', () => {
    const z = (view: 'layers' | 'front') => {
      const { container, unmount } = render(
        <CardExplode tier={tier('metal')} view={view} focus={null} onFocus={() => {}} />,
      )
      const value = (container.querySelector('.cx-layer.is-chip') as HTMLElement).style.getPropertyValue('--z')
      unmount()
      return parseFloat(value)
    }
    expect(z('layers')).toBeGreaterThan(100)
    expect(z('front')).toBeLessThan(10)
  })

  it('describes the core by material and reports hovered callouts', () => {
    const onFocus = vi.fn()
    const { container, getByText, rerender } = render(
      <CardExplode tier={tier('metal')} view="layers" focus={null} onFocus={onFocus} />,
    )
    expect(getByText('Stainless-steel core')).toBeInTheDocument()
    fireEvent.pointerEnter(container.querySelector('.is-antenna .cx-tag')!)
    expect(onFocus).toHaveBeenCalledWith('antenna')

    rerender(<CardExplode tier={tier('polycarbonate')} view="layers" focus={null} onFocus={onFocus} />)
    expect(getByText('Polycarbonate core')).toBeInTheDocument()
  })

  it('draws the antenna as one continuous coil', () => {
    const d = coilPath(4)
    expect(d.match(/M/g)).toHaveLength(1)
    expect(d.match(/A/g)).toHaveLength(16)
  })
})
