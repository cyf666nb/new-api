<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { demoApi } from '../api'
import MarkdownArticle from '../components/docs/MarkdownArticle.vue'
import PublicLayout from '../components/layout/PublicLayout.vue'
import DataState from '../components/ui/DataState.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { DocArticle, DocTreeSection } from '../contracts'

const route = useRoute()
const router = useRouter()

const tree = ref<DocTreeSection[]>([])
const article = ref<DocArticle>()
const loading = ref(true)
const error = ref('')

const currentSlug = computed(() => String(route.params.slug || ''))

async function loadTree() {
  tree.value = await demoApi.getDocsTree()
}

async function loadArticle(slug: string) {
  loading.value = true
  error.value = ''
  try {
    if (!tree.value.length) await loadTree()
    const fallback = tree.value[0]?.items[0]?.slug
    const targetSlug = slug || fallback
    if (!targetSlug) throw new Error('No documentation article found')
    if (!slug) {
      await router.replace(`/docs/${targetSlug}`)
      return
    }
    article.value = await demoApi.getDocArticle(targetSlug)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '文档加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadArticle(currentSlug.value))
watch(currentSlug, (slug) => loadArticle(slug))
</script>

<template>
  <PublicLayout>
    <div class="docs-shell">
      <aside class="docs-sidebar">
        <div class="docs-eyebrow">Docs</div>
        <section v-for="section in tree" :key="section.id">
          <h3>{{ section.title }}</h3>
          <RouterLink
            v-for="item in section.items"
            :key="item.slug"
            class="docs-link"
            :to="`/docs/${item.slug}`"
          >
            <ProviderIcon v-if="item.providerId" :provider-id="item.providerId" :size="14" />
            <span>{{ item.title }}</span>
          </RouterLink>
        </section>
      </aside>
      <main class="docs-article">
        <DataState :loading="loading" :error="error" :empty="!article">
          <MarkdownArticle v-if="article" :body="article.body" />
        </DataState>
      </main>
    </div>
  </PublicLayout>
</template>

<style scoped>
.docs-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: 100vh;
  padding-top: 76px;
}

.docs-sidebar {
  position: sticky;
  top: 76px;
  height: calc(100vh - 76px);
  overflow-y: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding: 28px 28px 40px 48px;
}

.docs-eyebrow {
  color: rgba(0, 0, 0, 0.35);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h3 {
  margin: 24px 0 10px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.docs-link {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.55);
  padding: 9px 10px;
  text-decoration: none;
  font-size: 13px;
}

.docs-link:hover,
.docs-link.router-link-active {
  background: rgba(0, 0, 0, 0.04);
  color: #1a1815;
  font-weight: 600;
}

.docs-article {
  max-width: 920px;
  padding: 56px min(8vw, 96px) 96px;
}

@media (max-width: 860px) {
  .docs-shell {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    position: relative;
    top: auto;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 96px 24px 24px;
  }

  .docs-article {
    padding: 32px 24px 80px;
  }
}
</style>
