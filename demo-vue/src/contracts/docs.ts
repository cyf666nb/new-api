import type { ProviderId } from './provider'

export type DocArticleMeta = {
  slug: string
  title: string
  section: string
  order: number
  providerId?: ProviderId
  updatedAt: string
}

export type DocArticle = DocArticleMeta & {
  body: string
}

export type DocTreeSection = {
  id: string
  title: string
  items: DocArticleMeta[]
}
