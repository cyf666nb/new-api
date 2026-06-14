<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { demoApi } from '../api'
import PublicLayout from '../components/layout/PublicLayout.vue'
import SkillCard from '../components/skills/SkillCard.vue'
import DataState from '../components/ui/DataState.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { Provider, Skill, SkillQuery } from '../contracts'

const providers = ref<Provider[]>([])
const skills = ref<Skill[]>([])
const loading = ref(true)
const error = ref('')
const filters = reactive<SkillQuery>({
  providerId: '',
  category: '',
  sourceType: '',
  keyword: '',
})

const categories = computed(() =>
  Array.from(new Set(skills.value.flatMap((skill) => skill.categories))).sort()
)

async function load() {
  loading.value = true
  error.value = ''
  try {
    providers.value = await demoApi.getProviders()
    skills.value = await demoApi.getSkills(filters)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Skills 加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(filters, load)
</script>

<template>
  <PublicLayout>
    <section class="skills-hero">
      <div>
        <div class="sec-label">Skills Market</div>
        <h1>可交付、可溯源的<br><span>AI Skills 市场。</span></h1>
        <p>首版聚合 Claude 官方形态和主流厂商教程资源，先做浏览、筛选、详情和安装说明。</p>
      </div>
    </section>

    <main class="skills-main">
      <aside class="skills-filters">
        <input v-model="filters.keyword" class="filter-input-wide" placeholder="搜索 skills…" />
        <label>厂商</label>
        <button class="filter-chip" :class="{ active: !filters.providerId }" @click="filters.providerId = ''">
          全部
        </button>
        <button
          v-for="provider in providers"
          :key="provider.id"
          class="filter-chip"
          :class="{ active: filters.providerId === provider.id }"
          @click="filters.providerId = provider.id"
        >
          <ProviderIcon :provider-id="provider.id" :size="14" />
          {{ provider.name }}
        </button>

        <label>来源</label>
        <button class="filter-chip" :class="{ active: !filters.sourceType }" @click="filters.sourceType = ''">全部</button>
        <button class="filter-chip" :class="{ active: filters.sourceType === 'official' }" @click="filters.sourceType = 'official'">official</button>
        <button class="filter-chip" :class="{ active: filters.sourceType === 'vendor' }" @click="filters.sourceType = 'vendor'">vendor</button>
        <button class="filter-chip" :class="{ active: filters.sourceType === 'community' }" @click="filters.sourceType = 'community'">community</button>

        <label>分类</label>
        <button class="filter-chip" :class="{ active: !filters.category }" @click="filters.category = ''">全部</button>
        <button
          v-for="category in categories"
          :key="category"
          class="filter-chip"
          :class="{ active: filters.category === category }"
          @click="filters.category = category"
        >
          {{ category }}
        </button>
      </aside>
      <section class="skills-list">
        <DataState :loading="loading" :error="error" :empty="!skills.length">
          <SkillCard v-for="skill in skills" :key="skill.id" :skill="skill" />
        </DataState>
      </section>
    </main>
  </PublicLayout>
</template>

<style scoped>
.skills-hero {
  display: flex;
  min-height: 420px;
  align-items: flex-end;
  background: #fafaf9;
  padding: 140px 48px 56px;
}

.skills-hero h1 {
  max-width: 760px;
  margin: 0;
  font-family: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.skills-hero h1 span {
  color: #6bafdf;
  font-style: italic;
}

.skills-hero p {
  max-width: 520px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  line-height: 1.7;
}

.skills-main {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 32px 48px 90px;
}

.skills-filters {
  display: flex;
  align-self: start;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 96px;
}

.skills-filters label {
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.35);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.filter-input-wide {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: #fff;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: #fff;
  padding: 8px 12px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
}

.filter-chip.active {
  border-color: #1a1815;
  background: #1a1815;
  color: #fff;
}

.skills-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.skills-list > :deep(.data-state) {
  grid-column: 1 / -1;
}

@media (max-width: 980px) {
  .skills-main {
    grid-template-columns: 1fr;
  }

  .skills-filters {
    position: static;
  }

  .skills-list {
    grid-template-columns: 1fr;
  }
}
</style>
