---
title: 厂商协议示例
slug: provider-protocols
section: 交接
order: 2
providerId: openai
updatedAt: 2026-06-12T08:00:00Z
---

# 厂商协议示例

前端只展示协议形状和示例，不直接实现 relay。真实上游转发由后端完成。

## OpenAI Compatible

```json
{
  "model": "gpt-5.5",
  "messages": [{ "role": "user", "content": "Hello" }],
  "stream": true
}
```

## Anthropic Messages

```json
{
  "model": "claude-opus-4-7",
  "max_tokens": 1024,
  "messages": [{ "role": "user", "content": "Hello" }]
}
```

## Gemini Generate Content

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "Hello" }] }
  ]
}
```

## Embeddings / Images

Embeddings 和 Images 作为独立 protocol 类型暴露给前端文档和 Playground，方便后端按网关能力逐步实现。
