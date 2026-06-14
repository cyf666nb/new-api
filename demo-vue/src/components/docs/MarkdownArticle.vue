<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const props = defineProps<{
  body: string
}>()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const html = computed(() => md.render(props.body))
</script>

<template>
  <article class="markdown-article" v-html="html" />
</template>

<style scoped>
.markdown-article {
  color: #1a1815;
  font-size: 15px;
  line-height: 1.8;
}

.markdown-article :deep(h1),
.markdown-article :deep(h2),
.markdown-article :deep(h3) {
  font-family: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  line-height: 1.2;
}

.markdown-article :deep(h1) {
  margin: 0 0 28px;
  font-size: clamp(2.4rem, 5vw, 4rem);
}

.markdown-article :deep(h2) {
  margin-top: 34px;
  font-size: 24px;
}

.markdown-article :deep(pre) {
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.035);
  padding: 18px;
}

.markdown-article :deep(code) {
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  font-size: 13px;
}

.markdown-article :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 18px 0;
  font-size: 13px;
}

.markdown-article :deep(th),
.markdown-article :deep(td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  padding: 10px 12px;
  text-align: left;
}

.markdown-article :deep(a) {
  color: #2563eb;
  text-decoration: none;
}
</style>
