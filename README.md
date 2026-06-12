<div align="center">

# MIRAX-API

**AI API 网关 / 多模型管理平台**

</div>

## 简介

基于 Go + React 的 AI API 网关，聚合 40+ 上游 AI 服务商（OpenAI、Claude、Gemini、Azure、AWS Bedrock 等），提供统一 API 接口，支持用户管理、计费、限流和管理后台。

## 主要特性

- **多模型统一接入** — OpenAI / Claude / Gemini / Azure / AWS Bedrock 等 40+ 服务商
- **格式自动转换** — OpenAI ⇄ Claude Messages、OpenAI → Gemini 等
- **智能路由** — 渠道加权随机、失败自动重试、用户级模型限速
- **计费系统** — 组织级用量统计、缓存命中计费、灵活定价策略
- **权限管理** — Token 分组、模型限制、用户管理
- **多数据库** — SQLite / MySQL / PostgreSQL
- **多语言** — 中文 / 英文 / 法语 / 俄语 / 日语 / 越南语

## 快速开始

### Docker Compose（推荐）

```bash
git clone https://github.com/cyf666nb/new-api.git
cd new-api
docker-compose up -d
```

部署完成后访问 `http://localhost:3000`

### Docker 命令

```bash
# SQLite（默认）
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  calciumion/new-api:latest

# MySQL
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi" \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  calciumion/new-api:latest
```

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Go 1.22+, Gin, GORM v2 |
| 前端 | React 19, TypeScript, Rsbuild, Tailwind CSS |
| 数据库 | SQLite / MySQL / PostgreSQL |
| 缓存 | Redis + 内存缓存 |
| 认证 | JWT, WebAuthn, OAuth (GitHub, Discord, OIDC) |

## 项目结构

```
├── router/          # HTTP 路由
├── controller/      # 请求处理
├── service/         # 业务逻辑
├── model/           # 数据模型
├── relay/           # AI API 代理
│   └── channel/     # 各厂商适配器
├── middleware/       # 中间件
├── setting/         # 配置管理
├── common/          # 公共工具
├── web/default/     # 前端 (React)
└── i18n/            # 国际化
```

## License

MIT
