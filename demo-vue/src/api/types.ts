import type {
  ApiKey,
  Channel,
  DashboardSummary,
  DocArticle,
  DocTreeSection,
  ManagedModel,
  ManagedUser,
  PageQuery,
  PageResult,
  PricingData,
  Profile,
  Provider,
  RankingItem,
  Skill,
  SkillQuery,
  SystemSetting,
  UsageLog,
  WalletSummary,
  WalletTransaction,
} from '../contracts'

export type DemoApi = {
  getProviders(): Promise<Provider[]>
  getPricing(): Promise<PricingData>
  getRankings(): Promise<RankingItem[]>
  getDocsTree(): Promise<DocTreeSection[]>
  getDocArticle(slug: string): Promise<DocArticle>
  getSkills(query?: SkillQuery): Promise<Skill[]>
  getSkill(slug: string): Promise<Skill>
  getDashboardSummary(): Promise<DashboardSummary>
  getApiKeys(query?: PageQuery): Promise<PageResult<ApiKey>>
  getUsageLogs(query?: PageQuery): Promise<PageResult<UsageLog>>
  getWalletSummary(): Promise<WalletSummary>
  getWalletTransactions(query?: PageQuery): Promise<PageResult<WalletTransaction>>
  getProfile(): Promise<Profile>
  getChannels(query?: PageQuery): Promise<PageResult<Channel>>
  getModels(query?: PageQuery): Promise<PageResult<ManagedModel>>
  getUsers(query?: PageQuery): Promise<PageResult<ManagedUser>>
  getSettings(): Promise<SystemSetting[]>
}
