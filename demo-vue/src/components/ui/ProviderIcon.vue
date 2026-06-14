<script setup lang="ts">
import { computed } from 'vue'

import { providerMap } from '../../data/providers'
import type { ProviderId } from '../../contracts'

const props = withDefaults(
  defineProps<{
    providerId: ProviderId
    size?: number
    color?: string
  }>(),
  {
    size: 22,
    color: 'currentColor',
  }
)

const iconModules = import.meta.glob('../../assets/provider-icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const provider = computed(() => providerMap[props.providerId])
const rawSvg = computed(() => {
  const icon = provider.value?.icon
  const key = Object.keys(iconModules).find((path) => path.endsWith(`/${icon}`))
  return key ? iconModules[key] : ''
})
</script>

<template>
  <span
    class="provider-icon"
    :title="provider?.displayName"
    :style="{ width: `${size}px`, height: `${size}px`, color }"
    v-html="rawSvg"
  />
</template>

<style scoped>
.provider-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.provider-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
