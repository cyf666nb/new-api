import type { ProviderId, ProviderProtocol } from './provider'

export type ModelCapability =
  | 'chat'
  | 'vision'
  | 'tools'
  | 'reasoning'
  | 'code'
  | 'fast'
  | 'long-context'
  | 'open-weights'
  | 'multimodal'

export type PricingModel = {
  id: string
  name: string
  providerId: ProviderId
  protocol: ProviderProtocol
  quotaType: 'token' | 'request'
  inputPerMillion: number
  outputPerMillion: number
  contextWindow: string
  endpoint: string
  group: string
  tags: string[]
  capabilities: ModelCapability[]
  benchmark?: string
  isEnabled: boolean
  updatedAt: string
}

export type PricingData = {
  models: PricingModel[]
  groups: Array<{ id: string; name: string; ratio: number }>
  endpoints: Array<{ id: string; name: string }>
}

export type RankingItem = {
  id: string
  rank: number
  modelId: string
  modelName: string
  providerId: ProviderId
  score: number
  usageCount: number
  latencyMs: number
  trend: 'up' | 'down' | 'flat'
}
