import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'

import './assets/demo/css/common.css'
import './styles.css'

createApp(App).use(router).mount('#app')
