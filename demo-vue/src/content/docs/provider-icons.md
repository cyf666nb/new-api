---
title: 厂商图标
slug: provider-icons
section: 功能
order: 2
updatedAt: 2026-06-12T08:00:00Z
---

# 厂商图标

前端不再使用 `cdn.simpleicons.org/...` 这种运行时外链。所有图标都放在本地 `src/assets/provider-icons`，通过 `ProviderIcon` 组件渲染。

## 规则

| 规则 | 说明 |
| --- | --- |
| 页面只传 `providerId` | 不直接写 SVG 路径 |
| 默认黑色 | SVG 使用 `currentColor` |
| 来源可追溯 | `providers.ts` 记录 `sourceUrl` 和 `licenseNote` |
| 缺官方资产时 | 用本地 wordmark fallback，并标注后续替换 |

生产发布前，建议再由设计或法务确认每个品牌图标的使用许可。
