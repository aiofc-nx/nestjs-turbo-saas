# Ever Gauzy 项目结构说明文档

## 概述

Ever Gauzy 是一个基于 Monorepo 架构的业务管理平台（ERP/CRM/HRM/ATS/PM），采用 Yarn Workspaces 和 Nx 进行项目管理。项目包含前端（Angular/Electron）和后端（NestJS）应用，以及共享的库和插件系统。

## 目录结构

```
ever-gauzy/
├── apps/              # 应用程序目录
├── packages/          # 共享库和包目录
├── tools/            # 工具脚本目录
├── docs/             # 文档目录
└── ...
```

---

## Apps 目录

`apps/` 目录包含所有可运行的应用程序，包括前端应用、后端服务和测试项目。

### 后端应用

#### 1. `api/` - 主 API 服务器
- **类型**: 后端
- **技术栈**: NestJS
- **描述**: 主要的后端 API 服务器，提供 RESTful API 和 GraphQL API，包含核心业务逻辑、数据库操作、认证授权等功能。
- **主要功能**:
  - 用户认证与授权
  - 业务数据管理（员工、项目、客户等）
  - 数据库迁移和种子数据
  - 插件系统集成

#### 2. `desktop-api/` - 桌面应用 API 服务器
- **类型**: 后端
- **技术栈**: NestJS
- **描述**: 专门为桌面应用（Electron）提供 API 服务的后端服务器，运行在本地环境中。
- **主要功能**:
  - 本地数据存储和管理
  - 桌面应用特定的 API 接口
  - 与主 API 服务器的同步功能

#### 3. `mcp/` - MCP 服务器
- **类型**: 后端
- **技术栈**: Node.js, Model Context Protocol
- **描述**: 独立的 Model Context Protocol (MCP) 服务器，用于 AI 模型上下文协议支持。

#### 4. `mcp-auth/` - MCP 认证服务器
- **类型**: 后端
- **技术栈**: Node.js, Model Context Protocol
- **描述**: MCP 服务器的认证服务，提供 MCP 相关的身份验证功能。

### 前端应用

#### 5. `gauzy/` - Web 前端应用
- **类型**: 前端
- **技术栈**: Angular
- **描述**: 主要的 Web 前端应用，提供完整的业务管理界面。
- **主要功能**:
  - 用户界面和交互
  - 数据可视化
  - 多语言支持
  - 主题切换（深色/浅色/企业等）

#### 6. `desktop/` - 桌面应用
- **类型**: 前端
- **技术栈**: Electron + Angular
- **描述**: 基于 Electron 的桌面应用程序，提供离线功能和本地数据存储能力。
- **主要功能**:
  - 时间跟踪和活动监控
  - 截图和屏幕录制
  - 本地数据存储
  - 自动更新

#### 7. `desktop-timer/` - 桌面计时器应用
- **类型**: 前端
- **技术栈**: Electron + Angular
- **描述**: 独立的桌面计时器应用，专注于时间跟踪功能。
- **主要功能**:
  - 时间跟踪界面
  - 活动监控
  - 简单的计时器功能

#### 8. `server/` - 服务器应用（Electron）
- **类型**: 前端
- **技术栈**: Electron + Angular
- **描述**: 基于 Electron 的本地服务器应用，可以在本地运行完整的 Gauzy 服务。

#### 9. `server-api/` - API 服务器应用（Electron）
- **类型**: 前端
- **技术栈**: Electron + Angular
- **描述**: 基于 Electron 的本地 API 服务器应用，提供本地 API 服务。

#### 10. `server-mcp/` - MCP 服务器应用（Electron）
- **类型**: 前端
- **技术栈**: Electron + Angular
- **描述**: 基于 Electron 的 MCP 服务器应用，提供本地 MCP 服务。

#### 11. `agent/` - 代理应用（Electron）
- **类型**: 前端
- **技术栈**: Electron + Angular
- **描述**: 基于 Electron 的代理应用，用于特定的代理功能。

### 测试项目

#### 12. `gauzy-e2e/` - E2E 测试
- **类型**: 测试
- **技术栈**: Cypress / Protractor
- **描述**: 端到端测试项目，用于测试 Web 应用的完整流程。

---

## Packages 目录

`packages/` 目录包含可重用的库和模块，这些包可以被多个应用引用。

### 后端库

#### 1. `core/` - 核心业务逻辑库
- **类型**: 后端
- **技术栈**: NestJS, TypeORM
- **描述**: 核心业务逻辑库，包含实体、服务、控制器等核心功能。
- **主要功能**:
  - 数据库实体定义
  - 业务逻辑服务
  - 数据访问层
  - 数据库迁移

#### 2. `auth/` - 认证模块
- **类型**: 后端
- **技术栈**: NestJS, Passport
- **描述**: 认证和授权模块，提供多种认证策略。
- **主要功能**:
  - JWT 认证
  - OAuth 集成
  - 权限管理
  - 用户会话管理

#### 3. `plugin/` - 插件基础库
- **类型**: 后端
- **技术栈**: NestJS
- **描述**: 插件系统的基础库，提供插件注册、加载和管理功能。

### 前端库

#### 4. `ui-core/` - UI 核心组件库
- **类型**: 前端
- **技术栈**: Angular
- **描述**: 核心 UI 组件库，提供可重用的 Angular 组件和指令。
- **主要功能**:
  - 通用 UI 组件
  - 布局组件
  - 表单组件
  - 数据展示组件

#### 5. `ui-auth/` - UI 认证组件库
- **类型**: 前端
- **技术栈**: Angular
- **描述**: 认证相关的 UI 组件库，包含登录、注册、密码重置等界面组件。

#### 6. `ui-config/` - UI 配置库
- **类型**: 前端
- **技术栈**: Angular
- **描述**: UI 配置管理库，提供应用配置、主题配置等功能。

#### 7. `desktop-core/` - 桌面应用核心库
- **类型**: 前端
- **技术栈**: Electron, Angular
- **描述**: 桌面应用的核心功能库，提供 Electron 相关的功能封装。

#### 8. `desktop-window/` - 桌面窗口管理库
- **类型**: 前端
- **技术栈**: Electron, Angular
- **描述**: 桌面应用的窗口管理库，提供窗口创建、管理等功能。

#### 9. `desktop-lib/` - 桌面应用库
- **类型**: 前端
- **技术栈**: Electron, Angular
- **描述**: 桌面应用的通用功能库。

#### 10. `desktop-ui-lib/` - 桌面 UI 组件库
- **类型**: 前端
- **技术栈**: Electron, Angular
- **描述**: 桌面应用专用的 UI 组件库。

#### 11. `desktop-activity/` - 桌面活动监控库
- **类型**: 前端
- **技术栈**: Electron, Angular
- **描述**: 桌面应用的活动监控功能库，用于跟踪用户活动。

### 共享库

#### 12. `common/` - 通用工具库
- **类型**: 共享（前后端）
- **技术栈**: TypeScript
- **描述**: 前后端共享的通用工具函数和辅助类。

#### 13. `config/` - 配置库
- **类型**: 共享（前后端）
- **技术栈**: TypeScript
- **描述**: 配置管理库，提供应用配置、环境变量管理等功能。

#### 14. `constants/` - 常量库
- **类型**: 共享（前后端）
- **技术栈**: TypeScript
- **描述**: 常量定义库，包含应用中的各种常量值。

#### 15. `contracts/` - 接口定义库
- **类型**: 共享（前后端）
- **技术栈**: TypeScript
- **描述**: 接口和类型定义库，定义前后端之间的数据契约。

#### 16. `utils/` - 工具函数库
- **类型**: 共享（前后端）
- **技术栈**: TypeScript
- **描述**: 工具函数库，提供各种实用的工具函数。

#### 17. `mcp-server/` - MCP 服务器库
- **类型**: 后端
- **技术栈**: Node.js, Model Context Protocol
- **描述**: MCP 服务器的核心功能库。

### 插件目录 (`packages/plugins/`)

`packages/plugins/` 目录包含各种功能插件，分为后端插件和前端 UI 插件。

#### 后端插件

- `changelog/` - 变更日志插件
- `integration-activepieces/` - Activepieces 集成插件
- `integration-ai/` - AI 集成插件
- `integration-github/` - GitHub 集成插件
- `integration-hubstaff/` - HubStaff 集成插件
- `integration-jira/` - Jira 集成插件
- `integration-make-com/` - Make.com 集成插件
- `integration-upwork/` - Upwork 集成插件
- `integration-wakatime/` - WakaTime 集成插件
- `integration-zapier/` - Zapier 集成插件
- `job-proposal/` - 工作提案插件
- `job-search/` - 工作搜索插件
- `knowledge-base/` - 知识库插件
- `product-reviews/` - 产品评价插件
- `posthog/` - PostHog 分析插件
- `sentry-tracing/` - Sentry 追踪插件
- `videos/` - 视频插件
- `camshot/` - 摄像头截图插件
- `soundshot/` - 音频录制插件
- `registry/` - 插件注册表

#### 前端 UI 插件

- `integration-activepieces-ui/` - Activepieces 集成 UI 插件
- `integration-ai-ui/` - AI 集成 UI 插件
- `integration-github-ui/` - GitHub 集成 UI 插件
- `integration-hubstaff-ui/` - HubStaff 集成 UI 插件
- `integration-make-com-ui/` - Make.com 集成 UI 插件
- `integration-upwork-ui/` - Upwork 集成 UI 插件
- `integration-zapier-ui/` - Zapier 集成 UI 插件
- `job-employee-ui/` - 员工管理 UI 插件
- `job-matching-ui/` - 工作匹配 UI 插件
- `job-proposal-ui/` - 工作提案 UI 插件
- `job-search-ui/` - 工作搜索 UI 插件
- `legal-ui/` - 法律相关 UI 插件
- `maintenance-ui/` - 维护模式 UI 插件
- `onboarding-ui/` - 入职引导 UI 插件
- `public-layout-ui/` - 公共布局 UI 插件
- `posthog-ui/` - PostHog UI 插件
- `videos-ui/` - 视频 UI 插件

---

## 其他目录

### `tools/` - 工具脚本目录
- **类型**: 工具
- **描述**: 包含各种构建、部署、配置等工具脚本。

### `docs/` - 文档目录
- **类型**: 文档
- **描述**: 项目文档、设计文档、使用教程等。

### `export/` - 导出目录
- **类型**: 导出
- **描述**: 导出文件目录。

---

## 技术栈总结

### 前端技术栈
- **框架**: Angular 20.x
- **UI 库**: Angular Material, Nebular
- **桌面应用**: Electron
- **状态管理**: Akita
- **构建工具**: Nx, Webpack

### 后端技术栈
- **框架**: NestJS 11.x
- **ORM**: TypeORM
- **数据库**: PostgreSQL, SQLite
- **认证**: JWT, Passport
- **API**: RESTful API, GraphQL

### 开发工具
- **包管理**: Yarn Workspaces
- **Monorepo 管理**: Nx
- **代码质量**: ESLint, Prettier
- **测试**: Jest, Cypress
- **CI/CD**: GitHub Actions

---

## 项目分类汇总

### 后端项目（12 个）
1. `apps/api` - 主 API 服务器
2. `apps/desktop-api` - 桌面应用 API 服务器
3. `apps/mcp` - MCP 服务器
4. `apps/mcp-auth` - MCP 认证服务器
5. `packages/core` - 核心业务逻辑库
6. `packages/auth` - 认证模块
7. `packages/plugin` - 插件基础库
8. `packages/mcp-server` - MCP 服务器库
9. `packages/plugins/changelog` - 变更日志插件
10. `packages/plugins/integration-*` - 各种集成插件（后端部分）
11. `packages/plugins/job-*` - 工作相关插件（后端部分）
12. `packages/plugins/*` - 其他后端插件

### 前端项目（20+ 个）
1. `apps/gauzy` - Web 前端应用
2. `apps/desktop` - 桌面应用
3. `apps/desktop-timer` - 桌面计时器应用
4. `apps/server` - 服务器应用（Electron）
5. `apps/server-api` - API 服务器应用（Electron）
6. `apps/server-mcp` - MCP 服务器应用（Electron）
7. `apps/agent` - 代理应用（Electron）
8. `packages/ui-core` - UI 核心组件库
9. `packages/ui-auth` - UI 认证组件库
10. `packages/ui-config` - UI 配置库
11. `packages/desktop-core` - 桌面应用核心库
12. `packages/desktop-window` - 桌面窗口管理库
13. `packages/desktop-lib` - 桌面应用库
14. `packages/desktop-ui-lib` - 桌面 UI 组件库
15. `packages/desktop-activity` - 桌面活动监控库
16. `packages/plugins/*-ui` - 各种前端 UI 插件

### 共享项目（5 个）
1. `packages/common` - 通用工具库
2. `packages/config` - 配置库
3. `packages/constants` - 常量库
4. `packages/contracts` - 接口定义库
5. `packages/utils` - 工具函数库

### 测试项目（1 个）
1. `apps/gauzy-e2e` - E2E 测试

---

## 构建和运行

### 开发环境启动
```bash
# 安装依赖
yarn install

# 启动前端和后端
yarn start

# 或分别启动
yarn start:gauzy  # 启动前端
yarn start:api     # 启动后端
```

### 生产环境构建
```bash
# 构建所有项目
yarn build:prod

# 构建前端
yarn build:gauzy:prod

# 构建后端
yarn build:api:prod
```

### 桌面应用构建
```bash
# 构建桌面应用（Linux）
yarn build:desktop:linux

# 构建桌面应用（Windows）
yarn build:desktop:windows

# 构建桌面应用（macOS）
yarn build:desktop:mac
```

---

## 注意事项

1. **依赖管理**: 项目使用 Yarn Workspaces 管理依赖，所有依赖安装在根目录的 `node_modules` 中。
2. **构建顺序**: 某些包有依赖关系，需要按照正确的顺序构建（如先构建 `core`，再构建依赖它的应用）。
3. **环境配置**: 不同环境需要不同的配置文件，使用 `yarn config:dev` 或 `yarn config:prod` 进行配置。
4. **数据库迁移**: 使用 `yarn migration:run` 运行数据库迁移。
5. **插件系统**: 插件采用动态加载机制，可以在运行时启用或禁用。

---

## 更新日志

- 2024-XX-XX: 创建项目结构说明文档

---

**文档版本**: 1.0.0
**最后更新**: 2024-XX-XX
