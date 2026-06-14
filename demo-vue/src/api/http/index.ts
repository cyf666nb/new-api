import { requestJson } from '../client'
import type { DemoApi } from '../types'

type QueryValue = string | number | boolean | undefined | null
function withQuery(path: string, query: object = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query as Record<string, QueryValue>)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const queryString = params.toString()
  return queryString ? `${path}?${queryString}` : path
}

export const httpApi: DemoApi = {
  getProviders: () => requestJson('/providers'),
  getPricing: () => requestJson('/models/pricing'),
  getRankings: () => requestJson('/rankings'),
  getDocsTree: () => requestJson('/docs/tree'),
  getDocArticle: (slug) => requestJson(`/docs/articles/${encodeURIComponent(slug)}`),
  getSkills: (query = {}) => requestJson(withQuery('/skills', query)),
  getSkill: (slug) => requestJson(`/skills/${encodeURIComponent(slug)}`),
  getDashboardSummary: () => requestJson('/dashboard/summary'),
  getApiKeys: (query = {}) => requestJson(withQuery('/api-keys', query)),
  getUsageLogs: (query = {}) => requestJson(withQuery('/usage-logs', query)),
  getWalletSummary: () => requestJson('/wallet/summary'),
  getWalletTransactions: (query = {}) => requestJson(withQuery('/wallet/transactions', query)),
  getProfile: () => requestJson('/profile'),
  getChannels: (query = {}) => requestJson(withQuery('/channels', query)),
  getModels: (query = {}) => requestJson(withQuery('/models', query)),
  getUsers: (query = {}) => requestJson(withQuery('/users', query)),
  getSettings: () => requestJson('/settings'),
}
