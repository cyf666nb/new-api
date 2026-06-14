<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { demoApi } from '../api'
import ConsoleLayout from '../components/layout/ConsoleLayout.vue'
import DataState from '../components/ui/DataState.vue'
import DataTable from '../components/ui/DataTable.vue'
import ProviderIcon from '../components/ui/ProviderIcon.vue'
import type { ManagedModel, PageResult, ProviderId } from '../contracts'
import { providerMap, providers } from '../data/providers'

const page = ref<PageResult<ManagedModel>>()
const loading = ref(true)
const error = ref('')
const keyword = ref('')
const provider = ref<'all' | ProviderId>('all')
const status = ref<'all' | ManagedModel['status']>('all')

const columns = [
  { key: 'name', label: '模型' },
  { key: 'providerId', label: '厂商' },
  { key: 'protocol', label: '协议' },
  { key: 'inputPerMillion', label: '输入 /M', align: 'right' as const },
  { key: 'outputPerMillion', label: '输出 /M', align: 'right' as const },
  { key: 'status', label: '状态' },
]

const filteredRows = computed(() => {
  return (page.value?.items ?? []).filter((item) => {
    if (provider.value !== 'all' && item.providerId !== provider.value) return false
    if (status.value !== 'all' && item.status !== status.value) return false
    return true
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    page.value = await demoApi.getModels({ keyword: keyword.value, pageSize: 60 })
  } catch (err) {
    error.value = err instanceof Error ? err.message : '模型数据加载失败'
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
        <h1 class="page-title">模型管理</h1>
      </div>
      <RouterLink class="quick-btn dark" to="/pricing.html">查看定价</RouterLink>
    </div>

    <div class="filters">
      <input v-model="keyword" class="filter-input" placeholder="搜索模型…" />
      <select v-model="provider" class="filter-input">
        <option value="all">全部厂商</option>
        <option v-for="item in providers" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <select v-model="status" class="filter-input">
        <option value="all">全部状态</option>
        <option value="enabled">已启用</option>
        <option value="disabled">已禁用</option>
      </select>
      <span class="filter-count">{{ filteredRows.length }} 个模型</span>
    </div>

    <DataState :loading="loading" :error="error" :empty="filteredRows.length === 0">
      <DataTable :columns="columns" :rows="filteredRows">
        <template #name="{ row }">
          <strong>{{ row.name }}</strong>
        </template>
        <template #providerId="{ row }">
          <span class="provider-cell">
            <ProviderIcon :provider-id="row.providerId" :size="16" />
            {{ providerMap[row.providerId].name }}
          </span>
        </template>
        <template #protocol="{ row }">
          <code>{{ row.protocol }}</code>
        </template>
        <template #inputPerMillion="{ row }">
          ${{ row.inputPerMillion.toFixed(2) }}
        </template>
        <template #outputPerMillion="{ row }">
          ${{ row.outputPerMillion.toFixed(2) }}
        </template>
        <template #status="{ row }">
          <span class="badge" :class="row.status">{{ row.status === 'enabled' ? '已启用' : '已禁用' }}</span>
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

.provider-cell {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
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
