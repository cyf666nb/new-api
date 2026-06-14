<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)

const sections = [
  {
    label: 'Chat',
    items: [{ to: '/playground.html', label: 'Playground', color: '#6BAFDF' }],
  },
  {
    label: 'General',
    items: [
      { to: '/dashboard.html', label: '总览', color: '#6BAFDF' },
      { to: '/keys.html', label: 'API Keys', color: '#4DB899' },
      { to: '/logs.html', label: '用量日志', color: '#6BAFDF' },
    ],
  },
  {
    label: 'Personal',
    items: [
      { to: '/wallet.html', label: '钱包', color: '#4DB899' },
      { to: '/profile.html', label: '个人资料', color: '#C4B89A' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { to: '/channels.html', label: '渠道管理', color: '#E8702A' },
      { to: '/models-mgmt.html', label: '模型管理', color: '#6BAFDF' },
      { to: '/users-mgmt.html', label: '用户管理', color: '#4DB899' },
      { to: '/settings.html', label: '系统设置', color: '#C4B89A' },
    ],
  },
]
</script>

<template>
  <div class="console-shell">
    <aside class="console-sidebar" :class="{ collapsed }">
      <RouterLink class="console-brand" to="/index.html">幻 MIRAX API</RouterLink>
      <div v-for="section in sections" :key="section.label" class="sidebar-section">
        <div class="sidebar-label">{{ section.label }}</div>
        <RouterLink v-for="item in section.items" :key="item.to" class="sidebar-item" :to="item.to">
          <span class="sidebar-dot" :style="{ background: item.color }" />
          {{ item.label }}
        </RouterLink>
      </div>
    </aside>
    <main class="console-main">
      <header class="console-topbar">
        <button class="topbar-toggle" @click="collapsed = !collapsed">☰</button>
        <RouterLink class="topbar-brand brand-scan" to="/index.html">幻 MIRAX API</RouterLink>
        <RouterLink class="topbar-home" to="/index.html">← 首页</RouterLink>
        <div class="topbar-actions">
          <RouterLink class="quick-btn" to="/settings.html">设置</RouterLink>
          <RouterLink class="quick-btn" to="/profile.html">个人</RouterLink>
        </div>
      </header>
      <div class="console-page">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.console-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #fafaf9;
}

.console-sidebar {
  width: 240px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  transition: width 0.25s;
}

.console-sidebar.collapsed {
  width: 0;
  border-right: 0;
}

.console-brand {
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: #1a1815;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.sidebar-section {
  margin-bottom: 4px;
}

.sidebar-label {
  padding: 12px 20px 4px;
  color: rgba(0, 0, 0, 0.3);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.sidebar-item:hover,
.sidebar-item.router-link-active {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1815;
  font-weight: 600;
}

.sidebar-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.console-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.console-topbar {
  display: flex;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 20px;
}

.topbar-toggle {
  border: 0;
  background: transparent;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
}

.topbar-brand,
.topbar-home {
  color: inherit;
  text-decoration: none;
}

.topbar-brand {
  font-size: 13px;
  font-weight: 800;
}

.topbar-home {
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
}

.topbar-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.console-page {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}
</style>
