<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { demoApi } from '../api'
import ConsoleLayout from '../components/layout/ConsoleLayout.vue'
import DataState from '../components/ui/DataState.vue'
import type { DashboardSummary } from '../contracts'

const summary = ref<DashboardSummary>()
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    summary.value = await demoApi.getDashboardSummary()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '控制台数据加载失败'
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
        <p class="eyebrow">Dashboard</p>
        <h1 class="page-title">控制台总览</h1>
      </div>
      <RouterLink class="quick-btn dark" to="/docs/backend-contract">接口契约</RouterLink>
    </div>

    <DataState :loading="loading" :error="error" :empty="!summary">
      <div v-if="summary" class="dashboard-stack">
        <section class="setup-card">
          <div>
            <p class="muted">快速开始</p>
            <h2>{{ summary.quickStart.completed }}/{{ summary.quickStart.total }} 已完成</h2>
          </div>
          <div class="steps">
            <span
              v-for="step in summary.quickStart.steps"
              :key="step.id"
              class="step-pill"
              :class="{ done: step.done }"
            >
              {{ step.label }}
            </span>
          </div>
        </section>

        <section class="metric-grid">
          <article v-for="metric in summary.metrics" :key="metric.id" class="metric-card">
            <div class="metric-top">
              <span>{{ metric.label }}</span>
              <small>{{ metric.helper }}</small>
            </div>
            <strong>{{ metric.displayValue }}</strong>
            <div class="sparkline" aria-hidden="true">
              <i
                v-for="(point, index) in metric.sparkline"
                :key="index"
                :style="{ height: `${Math.max(point, 6)}px` }"
              />
            </div>
          </article>
        </section>

        <section class="console-grid">
          <article class="panel">
            <div class="panel-title">API 端点</div>
            <div v-for="item in summary.apiInfo" :key="item.endpoint" class="row">
              <div>
                <strong>{{ item.endpoint }}</strong>
                <span>{{ item.host }}</span>
              </div>
              <b>{{ item.latencyMs }}ms</b>
            </div>
          </article>

          <article class="panel">
            <div class="panel-title">公告</div>
            <div v-for="item in summary.announcements" :key="item.id" class="notice">
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </div>
          </article>

          <article class="panel">
            <div class="panel-title">健康度</div>
            <div class="health-score">{{ summary.health.successRate }}%</div>
            <p class="muted">
              平均 {{ summary.health.averageLatencyMs }}ms · {{ summary.health.throughputTps }} TPS
            </p>
            <div v-for="model in summary.health.models" :key="model.modelId" class="health-row">
              <span>{{ model.label }}</span>
              <div class="bar"><i :style="{ width: `${model.score}%` }" /></div>
              <b>{{ model.score }}%</b>
            </div>
          </article>
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
  margin-bottom: 22px;
}

.eyebrow,
.muted {
  margin: 0;
  color: rgba(0, 0, 0, 0.38);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-title {
  margin: 4px 0 0;
  color: #1a1815;
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 700;
}

.dashboard-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.setup-card,
.metric-card,
.panel {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.62);
}

.setup-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
}

.setup-card h2 {
  margin: 4px 0 0;
  font-size: 22px;
}

.steps {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.step-pill {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  padding: 6px 10px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.step-pill.done {
  border-color: rgba(77, 184, 153, 0.28);
  background: rgba(77, 184, 153, 0.12);
  color: #1b7c62;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.metric-card {
  padding: 16px;
}

.metric-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: rgba(0, 0, 0, 0.44);
  font-size: 12px;
}

.metric-top small {
  color: rgba(0, 0, 0, 0.28);
  text-align: right;
}

.metric-card strong {
  display: block;
  margin-top: 14px;
  font-size: 24px;
  letter-spacing: 0;
}

.sparkline {
  display: flex;
  height: 34px;
  align-items: end;
  gap: 3px;
  margin-top: 12px;
}

.sparkline i {
  width: 4px;
  border-radius: 2px;
  background: #6bafdf;
  opacity: 0.72;
}

.console-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1fr;
  gap: 14px;
}

.panel {
  padding: 18px;
}

.panel-title {
  margin-bottom: 14px;
  color: rgba(0, 0, 0, 0.36);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.row,
.notice,
.health-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.row:first-of-type,
.notice:first-of-type {
  border-top: 0;
}

.row strong,
.notice strong {
  display: block;
  color: #1a1815;
  font-size: 13px;
}

.row span,
.notice span {
  display: block;
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.38);
  font-size: 12px;
}

.row b {
  color: #1b7c62;
  font-size: 12px;
}

.notice {
  display: block;
}

.health-score {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: 0;
}

.health-row {
  font-size: 12px;
}

.bar {
  height: 7px;
  flex: 1;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
}

.bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #4db899;
}

@media (max-width: 980px) {
  .metric-grid,
  .console-grid {
    grid-template-columns: 1fr;
  }

  .setup-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
