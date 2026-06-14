<script setup lang="ts">
defineProps<{
  loading?: boolean
  error?: string
  empty?: boolean
}>()
</script>

<template>
  <div v-if="loading" class="data-state">加载中…</div>
  <div v-else-if="error" class="data-state data-state--error">{{ error }}</div>
  <div v-else-if="empty" class="data-state">暂无数据</div>
  <slot v-else />
</template>

<style scoped>
.data-state {
  display: flex;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.015);
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}

.data-state--error {
  color: #e8702a;
}
</style>
