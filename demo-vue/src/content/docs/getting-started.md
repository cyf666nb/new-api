---
title: 快速开始
slug: getting-started
section: 入门
order: 1
updatedAt: 2026-06-12T08:00:00Z
---

# 快速开始

幻 MIRAX API 前端第一版按 **OpenAI 兼容网关** 来组织。你可以先用 mock 数据完成前端流程，再让后端按 OpenAPI 契约接入真实数据。

## 环境变量

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | `mock` | `mock` 使用前端种子数据，`api` 请求真实后端 |
| `VITE_API_BASE_URL` | `/api/v1` | 真实后端接口前缀 |

## 前端命令

```bash
bun install
bun run dev
bun run build
```

后端同学可以直接阅读 `openapi/openapi.yaml`，其中包含页面所需的首版接口和响应形状。
