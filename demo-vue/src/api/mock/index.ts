import { buildDocTree, docArticleMap } from '../../content/docs'
import { providers } from '../../data/providers'
import {
  apiKeys,
  channels,
  dashboardSummary,
  managedModels,
  managedUsers,
  pricingModels,
  rankings,
  settings,
  skillCategories,
  skills,
  usageLogs,
  walletSummary,
  walletTransactions,
} from '../../data/seed'
import type { PageQuery, PageResult, PricingData, Profile, Skill, SkillQuery } from '../../contracts'
import type { DemoApi } from '../types'

const delay = <T>(data: T) => new Promise<T>((resolve) => window.setTimeout(() => resolve(data), 80))

function pageResult<T>(items: T[], query: PageQuery = {}): PageResult<T> {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 20
  const keyword = query.keyword?.trim().toLowerCase()
  const filtered = keyword
    ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(keyword))
    : items

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

function filterSkills(query: SkillQuery = {}): Skill[] {
  const keyword = query.keyword?.trim().toLowerCase()
  return skills.filter((skill) => {
    if (query.providerId && skill.providerId !== query.providerId) return false
    if (query.category && !skill.categories.includes(query.category)) return false
    if (query.sourceType && skill.sourceType !== query.sourceType) return false
    if (keyword) {
      const haystack = [skill.name, skill.summary, skill.description, skill.tags.join(' ')].join(' ').toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })
}

export const mockApi: DemoApi = {
  getProviders: () => delay(providers),
  getPricing: () =>
    delay<PricingData>({
      models: pricingModels,
      groups: [
        { id: 'default', name: 'default', ratio: 1 },
        { id: 'premium', name: 'premium', ratio: 1.5 },
        { id: 'enterprise', name: 'enterprise', ratio: 2 },
      ],
      endpoints: [
        { id: 'chat', name: 'Chat' },
        { id: 'anthropic', name: 'Anthropic' },
        { id: 'gemini', name: 'Gemini' },
        { id: 'embeddings', name: 'Embeddings' },
        { id: 'image', name: 'Image' },
      ],
    }),
  getRankings: () => delay(rankings),
  getDocsTree: () => delay(buildDocTree()),
  getDocArticle: (slug) => {
    const article = docArticleMap[slug]
    if (!article) return Promise.reject(new Error(`Doc article not found: ${slug}`))
    return delay(article)
  },
  getSkills: (query) => delay(filterSkills(query)),
  getSkill: (slug) => {
    const skill = skills.find((item) => item.slug === slug)
    if (!skill) return Promise.reject(new Error(`Skill not found: ${slug}`))
    return delay(skill)
  },
  getDashboardSummary: () => delay(dashboardSummary),
  getApiKeys: (query) => delay(pageResult(apiKeys, query)),
  getUsageLogs: (query) => delay(pageResult(usageLogs, query)),
  getWalletSummary: () => delay(walletSummary),
  getWalletTransactions: (query) => delay(pageResult(walletTransactions, query)),
  getProfile: () =>
    delay<Profile>({
      id: 'user_1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      group: 'enterprise',
      createdAt: '2026-06-10T09:00:00Z',
    }),
  getChannels: (query) => delay(pageResult(channels, query)),
  getModels: (query) => delay(pageResult(managedModels, query)),
  getUsers: (query) => delay(pageResult(managedUsers, query)),
  getSettings: () => delay(settings),
}

export { skillCategories }
