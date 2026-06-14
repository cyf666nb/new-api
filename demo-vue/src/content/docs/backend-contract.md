---
title: 后端接口契约
slug: backend-contract
section: 交接
order: 1
updatedAt: 2026-06-12T08:00:00Z
---

# 后端接口契约

所有业务接口都返回统一 envelope。

```ts
type ApiEnvelope<T> =
  | { success: true; data: T; message?: string; traceId?: string }
  | { success: false; message: string; code?: string; traceId?: string }
```

## 分页结构

```ts
type PageResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
```

## 命名约定

| 类型 | 约定 |
| --- | --- |
| 对外目录 id | 使用 `slug` |
| 管理资源 id | 使用 string id |
| 时间字段 | ISO string |
| 金额和价格 | number |
| Provider | 前端只传 `providerId`，图标由 registry 映射 |

第一批端点在 OpenAPI 中已有定义：providers、models/pricing、skills、docs、dashboard、keys、logs、wallet、channels、models、users、settings。
