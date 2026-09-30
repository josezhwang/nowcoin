import { useEffect, useState } from 'react'

// Deduplicates concurrent requests and caches successful GETs for the session.
const cache = new Map<string, Promise<unknown>>()

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message
    throw new Error(message ?? `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export function get<T>(path: string, { fresh = false } = {}): Promise<T> {
  if (fresh || !cache.has(path)) {
    const p = request<T>(path)
    cache.set(path, p)
    p.catch(() => cache.delete(path))
  }
  return cache.get(path) as Promise<T>
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

interface ApiState<T> {
  path: string | null
  data: T | null
  error: Error | null
}

export function useApi<T>(path: string | null, { refreshMs }: { refreshMs?: number } = {}) {
  const [state, setState] = useState<ApiState<T>>({ path: null, data: null, error: null })

  useEffect(() => {
    if (!path) return
    let alive = true
    const load = (fresh: boolean) =>
      get<T>(path, { fresh })
        .then((data) => alive && setState({ path, data, error: null }))
        .catch(
          (error: Error) =>
            // Keep showing the last good data if a background refresh fails.
            alive && setState((s) => (s.path === path ? { ...s, error } : { path, data: null, error })),
        )

    load(false)
    const timer = refreshMs ? window.setInterval(() => load(true), refreshMs) : undefined
    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [path, refreshMs])

  const current = state.path === path
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: !!path && !current,
  }
}
