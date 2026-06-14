<script setup lang="ts" generic="T extends { id?: string | number }">
defineProps<{
  columns: Array<{
    key: string
    label: string
    align?: 'left' | 'right' | 'center'
  }>
  rows: T[]
}>()

function rowKey(row: { id?: string | number }, rowIndex: number) {
  return String(row.id ?? rowIndex)
}

function cellValue(row: unknown, key: string) {
  return (row as Record<string, unknown>)[key]
}
</script>

<template>
  <div class="data-table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :style="{ textAlign: column.align ?? 'left' }">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowKey(row, rowIndex)">
          <td
            v-for="column in columns"
            :key="column.key"
            :style="{ textAlign: column.align ?? 'left' }"
          >
            <slot :name="column.key" :row="row">
              {{ cellValue(row, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.data-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.015);
}

.data-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 12px;
}

th {
  padding: 11px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.35);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: 0;
}
</style>
