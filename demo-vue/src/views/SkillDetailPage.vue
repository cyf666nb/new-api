<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { demoApi } from '../api'
import PublicLayout from '../components/layout/PublicLayout.vue'
import DataState from '../components/ui/DataState.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { Skill } from '../contracts'
import { providerMap } from '../data/providers'

const route = useRoute()
const skill = ref<Skill>()
const loading = ref(true)
const error = ref('')
const copied = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  try {
    skill.value = await demoApi.getSkill(String(route.params.slug))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Skill 加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)

async function copyInstallInstructions() {
  if (!skill.value) return
  copied.value = false
  try {
    await navigator.clipboard.writeText(skill.value.installInstructions)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = skill.value.installInstructions
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <PublicLayout>
    <main class="skill-detail">
      <DataState :loading="loading" :error="error" :empty="!skill">
        <template v-if="skill">
          <RouterLink class="back-link" to="/skills">← Skills 市场</RouterLink>
          <header>
            <ProviderIcon :provider-id="skill.providerId" :size="34" />
            <div>
              <div class="sec-label">{{ providerMap[skill.providerId].displayName }}</div>
              <h1>{{ skill.name }}</h1>
              <p>{{ skill.description }}</p>
            </div>
          </header>
          <section class="detail-grid">
            <div class="detail-card">
              <div class="card-head">
                <h2>安装说明</h2>
                <button class="quick-btn" @click="copyInstallInstructions">
                  {{ copied ? '已复制' : '复制' }}
                </button>
              </div>
              <pre><code>{{ skill.installInstructions }}</code></pre>
            </div>
            <div class="detail-card">
              <h2>元数据</h2>
              <dl>
                <dt>来源</dt><dd><a :href="skill.sourceUrl" target="_blank" rel="noreferrer">{{ skill.sourceType }}</a></dd>
                <dt>可信级别</dt><dd>{{ skill.trustLevel }}</dd>
                <dt>版本</dt><dd>{{ skill.version }}</dd>
                <dt>更新</dt><dd>{{ skill.updatedAt }}</dd>
                <dt>文档</dt><dd><RouterLink :to="`/docs/${skill.docsSlug}`">{{ skill.docsSlug }}</RouterLink></dd>
              </dl>
            </div>
          </section>
          <section class="detail-card">
            <h2>标签和目标</h2>
            <div class="tag-row">
              <span v-for="tag in [...skill.categories, ...skill.tags, ...skill.targets]" :key="tag">{{ tag }}</span>
            </div>
          </section>
        </template>
      </DataState>
    </main>
  </PublicLayout>
</template>

<style scoped>
.skill-detail {
  max-width: 1000px;
  padding: 130px 48px 90px;
}

.back-link {
  color: rgba(0, 0, 0, 0.45);
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
}

header {
  display: flex;
  gap: 18px;
  margin-top: 30px;
  margin-bottom: 32px;
}

h1 {
  margin: 0;
  font-family: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  font-size: clamp(3rem, 7vw, 5.5rem);
  line-height: 1;
}

p {
  max-width: 720px;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.7;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 18px;
}

.detail-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.018);
  padding: 24px;
}

h2 {
  margin: 0 0 16px;
  font-family: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  font-size: 22px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.card-head h2 {
  margin: 0;
}

pre {
  overflow: auto;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.04);
  padding: 16px;
}

code {
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  font-size: 13px;
}

dl {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 10px;
  margin: 0;
  font-size: 13px;
}

dt {
  color: rgba(0, 0, 0, 0.36);
}

dd {
  margin: 0;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-row span {
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.04);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 820px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
