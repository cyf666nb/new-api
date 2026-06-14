export type ChatRole = 'system' | 'user' | 'assistant' | 'tool'

export type OpenAICompatibleMessage = {
  role: ChatRole
  content: string
}

export type OpenAICompatibleRequest = {
  model: string
  messages: OpenAICompatibleMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export type AnthropicMessage = {
  role: 'user' | 'assistant'
  content: string | Array<{ type: 'text'; text: string }>
}

export type AnthropicMessagesRequest = {
  model: string
  max_tokens: number
  messages: AnthropicMessage[]
  system?: string
  stream?: boolean
}

export type GeminiGenerateContentRequest = {
  contents: Array<{
    role?: 'user' | 'model'
    parts: Array<{ text: string }>
  }>
  generationConfig?: {
    temperature?: number
    maxOutputTokens?: number
  }
}

export type EmbeddingsRequest = {
  model: string
  input: string | string[]
  dimensions?: number
}

export type ImagesRequest = {
  model: string
  prompt: string
  size?: '1024x1024' | '1024x1536' | '1536x1024'
  n?: number
}
