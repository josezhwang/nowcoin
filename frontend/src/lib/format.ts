const usd = new Map<number, Intl.NumberFormat>()

/** Formats a USD price with precision that suits its magnitude (e.g. $97,210 vs $0.3812). */
export function formatPrice(n: number) {
  const digits = n < 1 ? 4 : n < 100 ? 2 : 0
  let fmt = usd.get(digits)
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits })
    usd.set(digits, fmt)
  }
  return fmt.format(n)
}

export function formatPercent(n: number) {
  return `${Math.abs(n).toFixed(2)}%`
}
