<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { demoApi } from '../api'
import ConsoleLayout from '../components/layout/ConsoleLayout.vue'
import DataState from '../components/ui/DataState.vue'
import DataTable from '../components/ui/DataTable.vue'
import type { PageResult, WalletSummary, WalletTransaction } from '../contracts'
import { formatCurrency, formatDate } from '../utils/format'

const summary = ref<WalletSummary>()
const transactions = ref<PageResult<WalletTransaction>>()
const loading = ref(true)
const error = ref('')

const columns = [
  { key: 'description', label: '描述' },
  { key: 'type', label: '类型' },
  { key: 'amount', label: '金额', align: 'right' as const },
  { key: 'createdAt', label: '时间' },
]

const rows = computed(() => transactions.value?.items ?? [])

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [walletSummary, walletTransactions] = await Promise.all([
      demoApi.getWalletSummary(),
      demoApi.getWalletTransactions({ pageSize: 20 }),
    ])
    summary.value = walletSummary
    transactions.value = walletTransactions
  } catch (err) {
    error.value = err instanceof Error ? err.message : '钱包数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <ConsoleLayout>
    <div class="page-header">
      <div>
        <p class="eyebrow">Personal</p>
        <h1 class="page-title">钱包</h1>
      </div>
      <button class="quick-btn dark">充值</button>
    </div>

    <DataState :loading="loading" :error="error" :empty="!summary">
      <div v-if="summary" class="wallet-stack">
        <section class="summary-grid">
          <article class="summary-card primary">
            <span>当前余额</span>
            <strong>{{ formatCurrency(summary.balance, summary.currency === 'CNY' ? '¥' : '$') }}</strong>
            <small>预计可运行 {{ summary.projectedDays }} 天</small>
          </article>
          <article class="summary-card">
            <span>近 24H 消耗</span>
            <strong>{{ formatCurrency(summary.spentLast24h, summary.currency === 'CNY' ? '¥' : '$') }}</strong>
            <small>来自模型调用和重试成本</small>
          </article>
          <article class="summary-card">
            <span>币种</span>
            <strong>{{ summary.currency }}</strong>
            <small>后端可按租户配置</small>
          </article>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>交易记录</h2>
            <span>{{ transactions?.total ?? 0 }} 条</span>
          </div>
          <DataTable :columns="columns" :rows="rows">
            <template #description="{ row }">
              <strong>{{ row.description }}</strong>
            </template>
            <template #type="{ row }">
              <span class="badge" :class="row.type">{{ row.type }}</span>
            </template>
            <template #amount="{ row }">
              <span :class="{ income: row.amount > 0, outcome: row.amount < 0 }">
                {{ formatCurrency(row.amount, row.currency === 'CNY' ? '¥' : '$') }}
              </span>
            </template>
            <template #createdAt="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </DataTable>
        </section>
      </div>
    </DataState>
  </ConsoleLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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

.wallet-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr;
  gap: 14px;
}

.summary-card,
.panel {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.62);
}

.summary-card {
  display: grid;
  gap: 8px;
  padding: 18px;
}

.summary-card span,
.summary-card small,
.panel-head span {
  color: rgba(0, 0, 0, 0.42);
  font-size: 12px;
}

.summary-card strong {
  color: #1a1815;
  font-size: 30px;
  letter-spacing: 0;
}

.summary-card.primary {
  background: #1a1815;
  color: #fff;
}

.summary-card.primary span,
.summary-card.primary small {
  color: rgba(255, 255, 255, 0.62);
}

.summary-card.primary strong {
  color: #fff;
}

.panel {
  padding: 16px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel-head h2 {
  margin: 0;
  font-size: 16px;
}

.badge {
  display: inline-flex;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 8px;
  color: rgba(0, 0, 0, 0.58);
  font-size: 11px;
  font-weight: 800;
}

.badge.topup,
.badge.refund,
.income {
  color: #1b7c62;
}

.badge.usage,
.outcome {
  color: #b6531c;
}

@media (max-width: 840px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
