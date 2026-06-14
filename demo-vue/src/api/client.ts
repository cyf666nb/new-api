import { unwrapEnvelope, type ApiEnvelope } from '../contracts'

const defaultBaseUrl = '/api/v1'

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl

export async function requestJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const body = await response.text()
  let payload: ApiEnvelope<T> | undefined

  if (body) {
    try {
      payload = JSON.parse(body) as ApiEnvelope<T>
    } catch {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText || path}`)
      }
      throw new Error('Invalid JSON response')
    }
  }

  if (!payload) {
    throw new Error(`HTTP ${response.status} ${response.statusText || path}`)
  }

  if (!response.ok && payload.success !== false) {
    throw new Error(`HTTP ${response.status} ${response.statusText || path}`)
  }

  return unwrapEnvelope(payload)
}
