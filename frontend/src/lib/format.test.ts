import { formatPercent, formatPrice } from './format'

describe('formatPrice', () => {
  it('drops decimals for large prices', () => {
    expect(formatPrice(97210.4)).toBe('$97,210')
  })

  it('keeps cents for mid-range prices', () => {
    expect(formatPrice(23.456)).toBe('$23.46')
  })

  it('shows four decimals below one dollar', () => {
    expect(formatPrice(0.38123)).toBe('$0.3812')
  })
})

describe('formatPercent', () => {
  it('formats the magnitude with two decimals', () => {
    expect(formatPercent(-1.234)).toBe('1.23%')
  })
})
