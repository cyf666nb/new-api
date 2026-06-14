import type { DocArticle, DocArticleMeta, DocTreeSection } from '../contracts'

const modules = import.meta.glob('./docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parseFrontmatter(raw: string): DocArticle {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Doc article is missing frontmatter')
  }

  const meta = Object.fromEntries(
    match[1].split('\n').map((line) => {
      const [key, ...rest] = line.split(':')
      return [key.trim(), rest.join(':').trim()]
    })
  ) as Record<string, string>

  return {
    slug: meta.slug,
    title: meta.title,
    section: meta.section,
    order: Number(meta.order ?? 0),
    providerId: meta.providerId as DocArticle['providerId'],
    updatedAt: meta.updatedAt,
    body: match[2].trim(),
  }
}

export const docArticles: DocArticle[] = Object.values(modules)
  .map(parseFrontmatter)
  .sort((a, b) => a.section.localeCompare(b.section) || a.order - b.order)

export const docArticleMap = Object.fromEntries(
  docArticles.map((article) => [article.slug, article])
) as Record<string, DocArticle>

export function buildDocTree(): DocTreeSection[] {
  const sections = new Map<string, DocArticleMeta[]>()

  for (const article of docArticles) {
    const item: DocArticleMeta = {
      slug: article.slug,
      title: article.title,
      section: article.section,
      order: article.order,
      providerId: article.providerId,
      updatedAt: article.updatedAt,
    }
    sections.set(article.section, [...(sections.get(article.section) ?? []), item])
  }

  return Array.from(sections.entries()).map(([title, items]) => ({
    id: title.toLowerCase(),
    title,
    items: items.sort((a, b) => a.order - b.order),
  }))
}
