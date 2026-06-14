import type { ProviderId, ProviderProtocol } from './provider'

export type ApiKey = {
  id: string
  name: string
  keyPreview: string
  status: 'enabled' | 'disabled' | 'expired' | 'exhausted'
  group: string
  remainQuota: number
  usedQuota: number
  unlimitedQuota: boolean
  createdAt: string
  accessedAt?: string
}

export type UsageLog = {
  id: string
  requestId: string
  modelId: string
  modelName: string
  providerId: ProviderId
  tokens: number
  cost: number
  latencyMs: number
  statusCode: number
  createdAt: string
}

export type WalletSummary = {
  balance: number
  currency: 'CNY' | 'USD'
  spentLast24h: number
  projectedDays: number
}

export type WalletTransaction = {
  id: string
  type: 'topup' | 'usage' | 'refund'
  amount: number
  currency: 'CNY' | 'USD'
  description: string
  createdAt: string
}

export type Profile = {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
  group: string
  createdAt: string
}

export type Channel = {
  id: string
  name: string
  providerId: ProviderId
  protocol: ProviderProtocol
  status: 'enabled' | 'disabled'
  models: string[]
  groups: string[]
  priority: number
  weight: number
  balance: number
  responseMs?: number
}

export type ManagedModel = {
  id: string
  name: string
  providerId: ProviderId
  protocol: ProviderProtocol
  inputPerMillion: number
  outputPerMillion: number
  status: 'enabled' | 'disabled'
}

export type ManagedUser = {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
  group: string
  status: 'active' | 'disabled'
  quota: number
  createdAt: string
}

export type SystemSetting = {
  id: string
  label: string
  value: string | number | boolean
  section: string
}
