<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { demoApi } from '../api'
import ConsoleLayout from '../components/layout/ConsoleLayout.vue'
import DataState from '../components/ui/DataState.vue'
import DataTable from '../components/ui/DataTable.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { Channel, PageResult, ProviderId } from '../contracts'
import { providerMap, providers } from '../data/providers'
import { formatCurrency } from '../utils/format'

const page = ref<PageResult<Channel>>()
const loading = ref(true)
const error = ref('')
const keyword = ref('')
const status = ref<'all' | Channel['status']>('all')
const provider = ref<'all' | ProviderId>('all')

const columns = [
  { key: 'name', label: '名称' },
  { key: 'providerId', label: '厂商' },
  { key: 'status', label: '状态' },
  { key: 'models', label: '模型' },
  { key: 'groups', label: '分组' },
  { key: 'priority', label: '优先级', align: 'right' as const },
  { key: 'weight', label: '权重', align: 'right' as const },
  { key: 'balance', label: '余额', align: 'right' as const },
  { key: 'responseMs', label: '响应', align: 'right' as const },
]

const filteredRows = computed(() => {
  return (page.value?.items ?? []).filter((item) => {
    if (status.value !== 'all' && item.status !== status.value) return false
    if (provider.value !== 'all' && item.providerId !== provider.value) return false
    return true
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    page.value = await demoApi.getChannels({ keyword: keyword.value, pageSize: 50 })
  } catch (err) {
    error.value = err instanceof Error ? err.message : '渠道数据加载失败'
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
        <p class="eyebrow">Admin</p>
        <h1 class="page-title">渠道管理</h1>
      </div>
      <div class="header-actions">
        <button class="quick-btn">标签模式</button>
        <button class="quick-btn dark">创建渠道</button>
      </div>
    </div>

    <div class="filters">
      <input v-model="keyword" class="filter-input" placeholder="搜索渠道或模型…" />
      <select v-model="provider" class="filter-input">
        <option value="all">全部厂商</option>
        <option v-for="item in providers" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <select v-model="status" class="filter-input">
        <option value="all">全部状态</option>
        <option value="enabled">已启用</option>
        <option value="disabled">已禁用</option>
      </select>
      <span class="filter-count">{{ filteredRows.length }} 个渠道</span>
    </div>

    <DataState :loading="loading" :error="error" :empty="filteredRows.length === 0">
      <DataTable :columns="columns" :rows="filteredRows">
        <template #name="{ row }">
          <div class="name-cell">
            <strong>{{ row.name }}</strong>
            <span>{{ row.protocol }}</span>
          </div>
        </template>
        <template #providerId="{ row }">
          <span class="provider-cell">
            <ProviderIcon :provider-id="row.providerId" :size="16" />
            {{ providerMap[row.providerId].name }}
          </span>
        </template>
        <template #status="{ row }">
          <span class="badge" :class="row.status">{{ row.status === 'enabled' ? '已启用' : '已禁用' }}</span>
        </template>
        <template #models="{ row }">
          <span class="muted-line">{{ row.models.join(', ') }}</span>
        </template>
        <template #groups="{ row }">
          <span class="muted-line">{{ row.groups.join(', ') }}</span>
        </template>
        <template #balance="{ row }">
          {{ formatCurrency(row.balance) }}
        </template>
        <template #responseMs="{ row }">
          {{ row.responseMs ? `${row.responseMs}ms` : '-' }}
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

.header-actions {
  display: flex;
  gap: 8px;
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

.name-cell {
  display: grid;
  gap: 3px;
}

.name-cell strong {
  font-size: 13px;
}

.name-cell span,
.muted-line {
  color: rgba(0, 0, 0, 0.42);
  font-size: 11px;
}

.provider-cell {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}

.badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
}

.badge.enabled {
  background: rgba(77, 184, 153, 0.14);
  color: #1b7c62;
}

.badge.disabled {
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
