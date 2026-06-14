import { httpApi } from './http'
import { mockApi } from './mock'

export const dataSource = import.meta.env.VITE_DATA_SOURCE || 'mock'

export const demoApi = dataSource === 'api' ? httpApi : mockApi

export type { DemoApi } from './types'
