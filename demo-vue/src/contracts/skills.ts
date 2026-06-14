import type { ProviderId } from './provider'

export type SkillSourceType = 'official' | 'vendor' | 'community'
export type SkillTrustLevel = 'official' | 'verified' | 'curated'

export type Skill = {
  id: string
  slug: string
  name: string
  providerId: ProviderId
  sourceUrl: string
  sourceType: SkillSourceType
  trustLevel: SkillTrustLevel
  summary: string
  description: string
  categories: string[]
  tags: string[]
  targets: string[]
  version: string
  updatedAt: string
  installInstructions: string
  docsSlug: string
}

export type SkillQuery = {
  providerId?: ProviderId | ''
  category?: string
  sourceType?: SkillSourceType | ''
  keyword?: string
}
