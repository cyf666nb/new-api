<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, watch } from 'vue'

import { demoPages, type DemoPageId } from '../generated/pages'
import { activateDemoPage, deactivateDemoPage } from '../utils/demoRuntime'

const props = defineProps<{
  pageId: DemoPageId
}>()

const page = computed(() => demoPages[props.pageId])

watch(
  page,
  async (currentPage) => {
    await nextTick()
    await activateDemoPage(currentPage, props.pageId)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  deactivateDemoPage()
})
</script>

<template>
  <main class="demo-page" v-html="page.html" />
</template>
