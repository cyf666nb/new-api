export type DashboardMetric = {
  id: string
  label: string
  value: number
  displayValue: string
  helper: string
  trend?: string
  accent: 'sky' | 'mint' | 'orange' | 'beige'
  sparkline: number[]
}

export type DashboardSummary = {
  quickStart: {
    completed: number
    total: number
    steps: Array<{ id: string; label: string; done: boolean }>
  }
  metrics: DashboardMetric[]
  apiInfo: Array<{ endpoint: string; host: string; latencyMs: number }>
  announcements: Array<{
    id: string
    title: string
    description: string
    accent: 'sky' | 'mint' | 'orange' | 'beige'
  }>
  health: {
    successRate: number
    averageLatencyMs: number
    throughputTps: number
    models: Array<{ modelId: string; label: string; score: number }>
  }
}
