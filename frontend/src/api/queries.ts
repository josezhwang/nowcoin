import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from './client'
import type {
  CardTier,
  ChatMessage,
  ChatReply,
  ContactPayload,
  HomeContent,
  Product,
  TeamMember,
  TickerResponse,
} from './types'

export const queryKeys = {
  products: ['products'] as const,
  product: (slug: string) => ['products', slug] as const,
  cardTiers: ['card-tiers'] as const,
  home: ['home'] as const,
  team: ['team'] as const,
  tickers: ['market', 'tickers'] as const,
}

// Site content changes only on deploy, so it is cached for the session.
const STATIC = { staleTime: Infinity, gcTime: Infinity } as const

export const useProducts = () =>
  useQuery({
    queryKey: queryKeys.products,
    queryFn: ({ signal }) => api.get<Product[]>('/products', signal),
    ...STATIC,
  })

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: ({ signal }) => api.get<Product>(`/products/${encodeURIComponent(slug)}`, signal),
    ...STATIC,
  })

export const useCardTiers = () =>
  useQuery({ queryKey: queryKeys.cardTiers, queryFn: ({ signal }) => api.get<CardTier[]>('/cards', signal), ...STATIC })

export const useHomeContent = () =>
  useQuery({ queryKey: queryKeys.home, queryFn: ({ signal }) => api.get<HomeContent>('/home', signal), ...STATIC })

export const useTeam = () =>
  useQuery({ queryKey: queryKeys.team, queryFn: ({ signal }) => api.get<TeamMember[]>('/team', signal), ...STATIC })

export const useTickers = () =>
  useQuery({
    queryKey: queryKeys.tickers,
    queryFn: ({ signal }) => api.get<TickerResponse>('/market/tickers', signal),
    refetchInterval: 60_000,
    staleTime: 30_000,
  })

export const useSubscribe = () =>
  useMutation({ mutationFn: (email: string) => api.post<{ ok: true }>('/newsletter', { email }) })

export const useContact = () =>
  useMutation({ mutationFn: (payload: ContactPayload) => api.post<{ ok: true }>('/contact', payload) })

export const useChat = () =>
  useMutation({ mutationFn: (messages: ChatMessage[]) => api.post<ChatReply>('/chat', { messages }) })
