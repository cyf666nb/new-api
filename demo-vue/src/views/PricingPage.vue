<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { demoApi } from '../api'
import PublicLayout from '../components/layout/PublicLayout.vue'
import DataState from '../components/ui/DataState.vue'
import DataTable from '../components/ui/DataTable.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { PricingData, PricingModel, ProviderId } from '../contracts'
import { providerMap } from '../data/providers'

const data = ref<PricingData>()
const loading = ref(true)
const error = ref('')
const search = ref('')
const activeGroup = ref('')
const activeProvider = ref<ProviderId | ''>('')
const activeEndpoint = ref('')
const view = ref<'table' | 'cards'>('table')

const columns = [
  { key: 'name', label: '模型' },
  { key: 'quotaType', label: '类型' },
  { key: 'inputPerMillion', label: '输入 /M', align: 'right' as const },
  { key: 'outputPerMillion', label: '输出 /M', align: 'right' as const },
  { key: 'providerId', label: '厂商' },
  { key: 'endpoint', label: '端点' },
  { key: 'group', label: '分组' },
]

const providersInUse = computed(() => {
  const ids = new Set((data.value?.models ?? []).map((model) => model.providerId))
  return Array.from(ids).map((id) => providerMap[id])
})

const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return (data.value?.models ?? []).filter((model) => {
    if (activeGroup.value && model.group !== activeGroup.value) return false
    if (activeProvider.value && model.providerId !== activeProvider.value) return false
    if (activeEndpoint.value && model.endpoint !== activeEndpoint.value) return false
    if (keyword) {
      const provider = providerMap[model.providerId]
      const haystack = [model.name, provider.name, model.tags.join(' ')].join(' ').toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    data.value = await demoApi.getPricing()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '定价数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function price(value: number) {
  return `$${value.toFixed(2)}`
}
</script>

<template>
  <PublicLayout>
    <div class="pricing-shell">
      <aside class="pricing-sidebar">
        <input v-model="search" class="filter-input-wide" placeholder="搜索模型…" />

        <div class="filter-section">
          <label>分组</label>
          <button class="filter-chip" :class="{ active: !activeGroup }" @click="activeGroup = ''">全部</button>
          <button
            v-for="group in data?.groups ?? []"
            :key="group.id"
            class="filter-chip"
            :class="{ active: activeGroup === group.id }"
            @click="activeGroup = group.id"
          >
            {{ group.name }} ×{{ group.ratio }}
          </button>
        </div>

        <div class="filter-section">
          <label>厂商</label>
          <button class="filter-chip" :class="{ active: !activeProvider }" @click="activeProvider = ''">全部</button>
          <button
            v-for="provider in providersInUse"
            :key="provider.id"
            class="filter-chip"
            :class="{ active: activeProvider === provider.id }"
            @click="activeProvider = provider.id"
          >
            <ProviderIcon :provider-id="provider.id" :size="14" />
            {{ provider.name }}
          </button>
        </div>

        <div class="filter-section">
          <label>端点类型</label>
          <button class="filter-chip" :class="{ active: !activeEndpoint }" @click="activeEndpoint = ''">全部</button>
          <button
            v-for="endpoint in data?.endpoints ?? []"
            :key="endpoint.id"
            class="filter-chip"
            :class="{ active: activeEndpoint === endpoint.id }"
            @click="activeEndpoint = endpoint.id"
          >
            {{ endpoint.name }}
          </button>
        </div>

        <p class="filter-count">{{ filtered.length }} 个模型</p>
      </aside>

      <main class="pricing-main">
        <div class="pricing-toolbar">
          <div>
            <div class="sec-label">Pricing</div>
          </div>
          <div class="toolbar-actions">
            <button class="quick-btn" :class="{ active: view === 'table' }" @click="view = 'table'">表格</button>
            <button class="quick-btn" :class="{ active: view === 'cards' }" @click="view = 'cards'">卡片</button>
          </div>
        </div>

        <DataState :loading="loading" :error="error" :empty="!filtered.length">
          <DataTable v-if="view === 'table'" :columns="columns" :rows="filtered as unknown as Record<string, unknown>[]">
            <template #name="{ row }">
              <div class="model-name">{{ (row as unknown as PricingModel).name }}</div>
              <div class="model-sub">{{ (row as unknown as PricingModel).contextWindow }} ctx</div>
            </template>
            <template #quotaType="{ row }">
              <span class="tag-badge">{{ (row as unknown as PricingModel).quotaType }}</span>
            </template>
            <template #inputPerMillion="{ row }">
              <span class="price-cell">{{ price((row as unknown as PricingModel).inputPerMillion) }}</span>
            </template>
            <template #outputPerMillion="{ row }">
              <span class="price-cell output">{{ price((row as unknown as PricingModel).outputPerMillion) }}</span>
            </template>
            <template #providerId="{ row }">
              <span class="provider-cell">
                <ProviderIcon :provider-id="(row as unknown as PricingModel).providerId" :size="15" />
                {{ providerMap[(row as unknown as PricingModel).providerId].name }}
              </span>
            </template>
            <template #endpoint="{ row }">
              <span class="tag-badge muted">{{ (row as unknown as PricingModel).endpoint }}</span>
            </template>
            <template #group="{ row }">
              <span class="tag-badge muted">{{ (row as unknown as PricingModel).group }}</span>
            </template>
          </DataTable>

          <div v-else class="pricing-cards">
            <article v-for="model in filtered" :key="model.id" class="pricing-card">
              <div class="pricing-card__head">
                <ProviderIcon :provider-id="model.providerId" :size="22" />
                <div>
                  <h3>{{ model.name }}</h3>
                  <p>{{ providerMap[model.providerId].displayName }}</p>
                </div>
              </div>
              <div class="price-grid">
                <div><span>输入 /1M</span><strong>{{ price(model.inputPerMillion) }}</strong></div>
                <div><span>输出 /1M</span><strong class="output">{{ price(model.outputPerMillion) }}</strong></div>
                <div><span>上下文</span><strong>{{ model.contextWindow }}</strong></div>
              </div>
              <div class="tag-row">
                <span v-for="tag in model.tags" :key="tag">{{ tag }}</span>
              </div>
            </article>
          </div>
        </DataState>
      </main>
    </div>
  </PublicLayout>
</template>

<style scoped>
.pricing-shell {
  display: flex;
  min-height: 100vh;
  padding: 80px 48px 0;
  background: #fafaf9;
  box-sizing: border-box;
}

.pricing-sidebar {
  position: sticky;
  top: 80px;
  width: 240px;
  max-height: calc(100vh - 80px);
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  padding: 16px 24px 40px 0;
}

.pricing-main {
  flex: 1;
  min-width: 0;
  padding: 16px 0 80px 32px;
}

.pricing-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.filter-input-wide {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 20px;
}

.filter-section label {
  flex-basis: 100%;
  color: rgba(0, 0, 0, 0.35);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.filter-chip,
.quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: #fff;
  padding: 7px 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
}

.filter-chip.active,
.quick-btn.active {
  border-color: #1a1815;
  background: #1a1815;
  color: #fff;
}

.filter-count {
  margin-top: 24px;
  color: rgba(0, 0, 0, 0.35);
  font-size: 11px;
}

.model-name {
  font-weight: 700;
}

.model-sub {
  color: rgba(0, 0, 0, 0.35);
  font-size: 11px;
}

.tag-badge {
  border-radius: 4px;
  background: rgba(107, 175, 223, 0.08);
  color: #6bafdf;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
}

.tag-badge.muted {
  background: rgba(0, 0, 0, 0.035);
  color: rgba(0, 0, 0, 0.45);
}

.price-cell {
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
}

.output {
  color: #4db899;
  font-weight: 800;
}

.provider-cell {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.pricing-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.018);
  padding: 24px;
}

.pricing-card__head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pricing-card h3 {
  margin: 0;
  font-family: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  font-size: 20px;
}

.pricing-card p {
  margin: 2px 0 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 24px 0;
}

.price-grid span {
  display: block;
  color: rgba(0, 0, 0, 0.35);
  font-size: 10px;
  font-weight: 700;
}

.price-grid strong {
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-row span {
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 10px;
  font-weight: 700;
}
</style>
