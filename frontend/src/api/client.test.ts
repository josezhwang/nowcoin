import { api, ApiError } from './client'

const mockFetch = (impl: () => Promise<Response>) => vi.spyOn(globalThis, 'fetch').mockImplementation(impl)

afterEach(() => vi.restoreAllMocks())

describe('api client', () => {
  it('returns parsed JSON on success', async () => {
    mockFetch(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await expect(api.get('/health')).resolves.toEqual({ ok: true })
  })

  it('surfaces the first NestJS validation message as an ApiError', async () => {
    mockFetch(async () => new Response(JSON.stringify({ message: ['email must be an email'] }), { status: 400 }))
    const err = await api.post('/newsletter', { email: 'x' }).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 400, message: 'email must be an email' })
  })

  it('maps network failures to a friendly ApiError with status 0', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(api.get('/products')).rejects.toMatchObject({ status: 0 })
  })
})
