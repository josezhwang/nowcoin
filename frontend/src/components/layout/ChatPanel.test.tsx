import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ChatPanel } from './ChatPanel'

function renderPanel() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ChatPanel onClose={() => undefined} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => vi.restoreAllMocks())

describe('ChatPanel', () => {
  it('sends the question and shows the reply with site links', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ reply: 'See /products/card for tiers.', source: 'ai' }), { status: 200 }),
      )
    renderPanel()

    fireEvent.change(screen.getByLabelText('Your question'), { target: { value: 'Card tiers?' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('link', { name: '/products/card' })).toHaveAttribute('href', '/products/card')
    expect(screen.getByText('Card tiers?')).toBeInTheDocument()
    // The UI-only greeting is not sent; the conversation starts with the visitor.
    const body = JSON.parse(fetchSpy.mock.calls[0]?.[1]?.body as string)
    expect(body).toEqual({ messages: [{ role: 'user', content: 'Card tiers?' }] })
  })

  it('shows the error and retries the same question', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ reply: 'Back online.', source: 'faq' }), { status: 200 }))
    renderPanel()

    fireEvent.click(screen.getByRole('button', { name: 'Is my crypto safe?' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Network error')

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Back online.')).toBeInTheDocument()
    expect(screen.getAllByText('Is my crypto safe?')).toHaveLength(1)
    const body = JSON.parse(fetchSpy.mock.calls[1]?.[1]?.body as string)
    expect(body.messages).toEqual([{ role: 'user', content: 'Is my crypto safe?' }])
  })
})
