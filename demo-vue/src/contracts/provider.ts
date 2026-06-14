export type ProviderId =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'deepseek'
  | 'xai'
  | 'mistral'
  | 'qwen'
  | 'zhipu'
  | 'doubao'
  | 'moonshot'

export type ProviderProtocol =
  | 'openai-compatible'
  | 'anthropic-messages'
  | 'gemini-generate-content'
  | 'embeddings'
  | 'images'

export type Provider = {
  id: ProviderId
  name: string
  displayName: string
  brandColor: string
  icon: string
  website: string
  docsUrl: string
  sourceUrl: string
  licenseNote: string
  protocols: ProviderProtocol[]
}
