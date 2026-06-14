<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { demoApi } from '../api'
import ConsoleLayout from '../components/layout/ConsoleLayout.vue'
import DataState from '../components/ui/DataState.vue'
import DataTable from '../components/ui/DataTable.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { PageResult, ProviderId, UsageLog } from '../contracts'
import { providerMap, providers } from '../data/providers'
import { formatCurrency, formatDate, formatNumber } from '../utils/format'

const page = ref<PageResult<UsageLog>>()
const loading = ref(true)
const error = ref('')
const keyword = ref('')
const provider = ref<'all' | ProviderId>('all')
const statusClass = ref<'all' | 'success' | 'error'>('all')

const columns = [
  { key: 'requestId', label: '请求' },
  { key: 'modelName', label: '模型' },
  { key: 'providerId', label: '厂商' },
  { key: 'tokens', label: 'Tokens', align: 'right' as const },
  { key: 'cost', label: '费用', align: 'right' as const },
  { key: 'latencyMs', label: '延迟', align: 'right' as const },
  { key: 'statusCode', label: '状态' },
  { key: 'createdAt', label: '时间' },
]

const filteredRows = computed(() => {
  return (page.value?.items ?? []).filter((item) => {
    if (provider.value !== 'all' && item.providerId !== provider.value) return false
    if (statusClass.value === 'success' && item.statusCode >= 400) return false
    if (statusClass.value === 'error' && item.statusCode < 400) return false
    return true
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    page.value = await demoApi.getUsageLogs({ keyword: keyword.value, pageSize: 80 })
  } catch (err) {
    error.value = err instanceof Error ? err.message : '日志数据加载失败'
  } finally {
    loading.value = false
  }
}

watch(keyword, load)
onMounted(load)
</script>

<template>
  <ConsoleLayout>
    <div class="page-header">
      <div>
        <p class="eyebrow">General</p>
        <h1 class="page-title">用量日志</h1>
      </div>
      <RouterLink class="quick-btn" to="/docs/backend-contract">日志字段说明</RouterLink>
    </div>

    <div class="filters">
      <input v-model="keyword" class="filter-input" placeholder="搜索请求、模型…" />
      <select v-model="provider" class="filter-input">
        <option value="all">全部厂商</option>
        <option v-for="item in providers" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <select v-model="statusClass" class="filter-input">
        <option value="all">全部状态</option>
        <option value="success">成功</option>
        <option value="error">错误</option>
      </select>
      <span class="filter-count">{{ filteredRows.length }} 条日志</span>
    </div>

    <DataState :loading="loading" :error="error" :empty="filteredRows.length === 0">
      <DataTable :columns="columns" :rows="filteredRows">
        <template #requestId="{ row }">
          <code>{{ row.requestId }}</code>
        </template>
        <template #modelName="{ row }">
          <div class="model-cell">
            <strong>{{ row.modelName }}</strong>
            <span>{{ row.modelId }}</span>
          </div>
        </template>
        <template #providerId="{ row }">
          <span class="provider-cell">
            <ProviderIcon :provider-id="row.providerId" :size="16" />
            {{ providerMap[row.providerId].name }}
          </span>
        </template>
        <template #tokens="{ row }">
          {{ formatNumber(row.tokens) }}
        </template>
        <template #cost="{ row }">
          {{ formatCurrency(row.cost) }}
        </template>
        <template #latencyMs="{ row }">
          {{ row.latencyMs }}ms
        </template>
        <template #statusCode="{ row }">
          <span class="badge" :class="{ error: row.statusCode >= 400 }">{{ row.statusCode }}</span>
        </template>
        <template #createdAt="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </DataTable>
    </DataState>
  </ConsoleLayout>
</template>

<style scoped>
.page-header,
.filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header {
  justify-content: space-between;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0;
  color: rgba(0, 0, 0, 0.38);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-title {
  margin: 4px 0 0;
  font-family: var(--font-serif);
  font-size: 28px;
}

.filters {
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-input {
  min-width: 150px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: #fff;
  padding: 8px 11px;
  color: #1a1815;
  font: inherit;
  font-size: 12px;
}

.filter-count {
  margin-left: auto;
  color: rgba(0, 0, 0, 0.35);
  font-size: 12px;
}

.provider-cell,
.model-cell {
  display: inline-grid;
  gap: 3px;
}

.provider-cell {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}

.model-cell span {
  color: rgba(0, 0, 0, 0.38);
  font-size: 11px;
}

code {
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
  padding: 3px 6px;
  color: rgba(0, 0, 0, 0.62);
  font-family: var(--font-mono);
  font-size: 11px;
}

.badge {
  display: inline-flex;
  border-radius: 999px;
  background: rgba(77, 184, 153, 0.14);
  padding: 4px 8px;
  color: #1b7c62;
  font-size: 11px;
  font-weight: 800;
}

.badge.error {
  background: rgba(232, 112, 42, 0.12);
  color: #b6531c;
}

@media (max-width: 720px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .filter-count {
    margin-left: 0;
  }
}
</style>
