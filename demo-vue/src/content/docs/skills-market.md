---
title: Skills 市场
slug: skills-market
section: 功能
order: 1
providerId: anthropic
updatedAt: 2026-06-12T08:00:00Z
---

# Skills 市场

第一版市场只做浏览、筛选、详情和安装说明，不做真实安装和审核流。

## 数据结构

每个 skill 至少包含：

| 字段 | 说明 |
| --- | --- |
| `slug` | URL 和目录 id |
| `providerId` | 来源厂商 |
| `sourceUrl` | 官方或可信来源 |
| `sourceType` | `official`、`vendor`、`community` |
| `trustLevel` | `official`、`verified`、`curated` |
| `installInstructions` | 安装或使用说明 |

## Claude Skills 形态

Claude 官方技能强调技能目录和 `SKILL.md` 描述文件。前端市场会把这些信息展示成卡片和详情页，后续后端可以补充安装状态和审核流。
