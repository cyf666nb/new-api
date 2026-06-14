export type ApiSuccess<T> = {
  success: true
  data: T
  message?: string
  traceId?: string
}

export type ApiFailure = {
  success: false
  message: string
  code?: string
  traceId?: string
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure

export type PageResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type PageQuery = {
  page?: number
  pageSize?: number
  keyword?: string
}

export class ApiError extends Error {
  code?: string
  traceId?: string

  constructor(message: string, code?: string, traceId?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.traceId = traceId
  }
}

export function unwrapEnvelope<T>(envelope: ApiEnvelope<T>): T {
  if (envelope.success) return envelope.data
  throw new ApiError(envelope.message, envelope.code, envelope.traceId)
}
