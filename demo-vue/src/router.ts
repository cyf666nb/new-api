import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { demoPages, type DemoPageId } from './generated/pages'
import ChannelsPage from './views/ChannelsPage.vue'
import DashboardPage from './views/DashboardPage.vue'
import DemoPage from './views/DemoPage.vue'
import DocsPage from './views/DocsPage.vue'
import LogsPage from './views/LogsPage.vue'
import ModelsPage from './views/ModelsPage.vue'
import PricingPage from './views/PricingPage.vue'
import SkillDetailPage from './views/SkillDetailPage.vue'
import SkillsPage from './views/SkillsPage.vue'
import WalletPage from './views/WalletPage.vue'

const pageIds = Object.keys(demoPages) as DemoPageId[]
const explicitPageIds = new Set<DemoPageId>(['channels', 'dashboard', 'logs', 'models-mgmt', 'pricing', 'wallet'])

const pageRoutes: RouteRecordRaw[] = pageIds
  .filter((pageId) => !explicitPageIds.has(pageId))
  .map((pageId) => {
    const page = demoPages[pageId]
    const cleanPath = pageId === 'index' ? '/home' : `/${pageId}`

    return {
      path: `/${page.file}`,
      alias: cleanPath,
      component: DemoPage,
      props: { pageId },
    }
  })

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/index.html' },
    { path: '/docs', component: DocsPage },
    { path: '/docs/:slug', component: DocsPage },
    { path: '/skills', component: SkillsPage },
    { path: '/skills/:slug', component: SkillDetailPage },
    { path: '/pricing.html', alias: '/pricing', component: PricingPage },
    { path: '/dashboard.html', alias: '/dashboard', component: DashboardPage },
    { path: '/channels.html', alias: '/channels', component: ChannelsPage },
    { path: '/models-mgmt.html', alias: '/models', component: ModelsPage },
    { path: '/logs.html', alias: '/logs', component: LogsPage },
    { path: '/wallet.html', alias: '/wallet', component: WalletPage },
    ...pageRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/index.html' },
  ],
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})
