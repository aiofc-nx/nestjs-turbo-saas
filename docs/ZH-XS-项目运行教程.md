# Ever Gauzy Platform 项目运行教程

## 📋 目录

- [项目概述](#项目概述)
- [环境要求](#环境要求)
- [安装步骤](#安装步骤)
- [运行方式](#运行方式)
- [开发模式](#开发模式)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

---

## 🎯 项目概述

**Ever Gauzy Platform** 是一个开源的企业级业务管理平台，集成了 ERP、CRM、HRM、ATS、PM 等多种功能。

### 项目结构

```
ever-gauzy/
├── apps/                    # 应用程序
│   ├── gauzy/             # Web 前端应用
│   ├── api/               # NestJS 后端 API
│   ├── desktop/           # 桌面应用
│   ├── desktop-timer/      # 桌面计时器应用
│   ├── server/            # Gauzy 服务器应用
│   └── ...               # 其他应用
├── packages/              # 共享包
│   ├── core/             # 核心业务逻辑
│   ├── common/           # 通用工具
│   ├── ui-core/          # UI 组件库
│   └── plugins/          # 插件系统
└── ...                  # 其他配置和工具
```

---

## 💻 环境要求

### 必需环境

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 22.x | 推荐使用 LTS 版本 (22.x 或 24.x) |
| Yarn | >= 1.22.x | 必须使用 Yarn，不支持 npm |
| Git | 最新版本 | 用于代码克隆和版本控制 |

### 可选环境（推荐生产环境使用）

| 工具 | 版本 | 用途 |
|------|------|------|
| PostgreSQL | >= 14.x | 生产数据库（推荐 16.x） |
| Redis | 最新版本 | 缓存和会话管理 |
| OpenSearch | 最新版本 | 搜索引擎 |
| Docker | >= 20.x | 容器化部署 |
| Docker Compose | >= 2.20.x | 多容器编排 |

### 检查环境

```bash
# 检查 Node.js 版本
node --version

# 检查 Yarn 版本
yarn --version

# 检查 Docker 版本（可选）
docker --version
docker-compose --version
```

---

## 📦 安装步骤

### 方式一：克隆项目

```bash
# 克隆仓库
git clone https://github.com/ever-co/ever-gauzy.git

# 进入项目目录
cd ever-gauzy
```

### 方式二：安装依赖

```bash
# 安装所有依赖并引导项目
yarn bootstrap

# 如果需要提交代码，安装 Git hooks
yarn prepare:husky
```

**说明**：
- `yarn bootstrap` 命令会安装所有 node_modules 并执行必要的初始化操作
- 首次安装可能需要 5-10 分钟，取决于网络速度

### 配置环境变量

项目提供了环境变量模板，需要根据实际情况配置：

```bash
# 复制环境变量模板（开发环境）
cp .env.local.example .env.local

# 或者复制基础模板
cp .env.sample .env
```

**常用环境变量配置**：

```env
# 数据库配置
DB_TYPE=postgres          # 或 mysql, sqlite
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=gauzy

# API 配置
API_PORT=3000
API_HOST=0.0.0.0

# 前端配置
PORT=4200
```

---

## 🚀 运行方式

### 方式一：快速启动（推荐新手）

**适用场景**：首次运行、快速体验功能

```bash
# 一键启动 API 和 Web UI
yarn start
```

**说明**：
- 此命令会先构建所有必要的包
- 然后同时启动 API（端口 3000）和 Web UI（端口 4200）
- 浏览器会自动打开 http://localhost:4200

**默认账号**：
- 管理员：`admin@ever.co` / `admin`
- 员工：`employee@ever.co` / `123456`

### 方式二：分别启动（推荐开发）

**适用场景**：开发调试、需要分别控制前后端

```bash
# 终端 1：启动后端 API
yarn start:api

# 终端 2：启动前端 Web UI
yarn start:gauzy
```

**说明**：
- API 运行在：http://localhost:3000/api
- Web UI 运行在：http://localhost:4200

### 方式三：生产模式启动

**适用场景**：生产环境部署、性能测试

```bash
# 构建所有包
yarn build:package:all

# 生产模式启动
yarn start:prod
```

### 方式四：Docker Compose 启动（推荐部署）

#### 4.1 Demo 模式（快速体验）

```bash
# 使用预构建镜像快速启动
docker-compose -f docker-compose.demo.yml up

# 访问 http://localhost:4200
```

**说明**：
- 包含最小配置：API + Web UI + 数据库
- 使用预构建的 Docker 镜像
- 适合快速演示和功能测试

#### 4.2 生产模式

```bash
# 编辑配置（可选）
vim .env.compose

# 启动完整环境
docker-compose up -d

# 查看日志
docker-compose logs -f
```

**包含的服务**：
- PostgreSQL（主数据库）
- Pgweb（数据库管理界面）
- OpenSearch（搜索引擎）
- OpenSearch Dashboards
- MinIO（对象存储）
- Redis（缓存）
- Jitsu（数据收集）
- Cube（数据分析）

#### 4.3 从源码构建

```bash
# 本地构建镜像（耗时较长）
docker-compose -f docker-compose.build.yml up -d
```

**警告**：首次构建可能需要 30-60 分钟！

---

## 🛠️ 开发模式

### 增量构建（加快启动速度）

```bash
# 只构建必要的包
yarn build:package:gauzy  # 只构建 Web UI 相关包
yarn build:package:api     # 只构建 API 相关包
```

### 热重载开发

```bash
# 开发模式启动（支持热重载）
yarn start:api     # API 热重载
yarn start:gauzy   # UI 热重载
```

### 只启动后端核心

```bash
# 只启动 NestJS 核心，不启动 Angular UI
yarn start:api:core
```

### 数据库迁移

```bash
# 运行数据库迁移
yarn db:migration migration:run

# 回滚迁移
yarn db:migration migration:revert

# 生成新迁移
yarn db:migration migration:generate

# 创建迁移文件
yarn db:migration migration:create
```

### 数据库初始化

```bash
# 基础数据初始化
yarn seed

# 完整数据初始化（包含大量测试数据）
yarn seed:all

# 按模块初始化
yarn seed:module --name organization
```

**注意**：
- 首次启动会自动运行基础数据初始化
- `seed:all` 会生成大量测试数据，需要约 10 分钟

---

## 🐛 常见问题

### 1. 安装依赖失败

**问题**：`yarn bootstrap` 报错

**解决方案**：
```bash
# 清理缓存
yarn cache clean

# 删除 node_modules
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# 重新安装
yarn bootstrap
```

### 2. 端口被占用

**问题**：启动失败，提示端口 3000 或 4200 被占用

**解决方案**：
```bash
# 查找占用端口的进程
# Linux/Mac
lsof -i :3000
lsof -i :4200

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# 杀死进程
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

或修改 `.env.local` 中的端口配置。

### 3. 数据库连接失败

**问题**：无法连接到数据库

**解决方案**：

**SQLite（默认）**：
```bash
# 确保没有其他进程锁定数据库
# 检查文件权限
ls -la apps/api/
```

**PostgreSQL/MySQL**：
```bash
# 检查数据库是否运行
# Linux
sudo systemctl status postgresql

# Mac
brew services list

# 测试连接
psql -h localhost -U postgres -d gauzy

# 检查 .env.local 配置
cat .env.local | grep DB_
```

### 4. 构建时间过长

**问题**：构建非常慢

**解决方案**：

```bash
# 清理缓存
yarn clean:all

# 使用增量构建
yarn build:package:gauzy  # 只构建需要的包

# 增加 Node.js 内存
export NODE_OPTIONS=--max-old-space-size=8192
```

### 5. TypeScript 类型错误

**问题**：类型检查失败

**解决方案**：

```bash
# 清理构建产物
yarn clean:cache

# 重新构建
yarn build:package:all

# 如果仍有问题，检查 tsconfig
cat tsconfig.base.json
```

### 6. 桌面应用无法启动

**问题**：Electron 应用崩溃

**解决方案**：

```bash
# 重新安装 Electron 依赖
cd apps/desktop
rm -rf node_modules
yarn install

# 重新构建
yarn prepare:desktop
```

### 7. Docker 启动失败

**问题**：`docker-compose up` 报错

**解决方案**：

```bash
# 停止所有容器
docker-compose down

# 清理未使用的镜像
docker system prune -a

# 重新拉取镜像
docker-compose pull

# 启动
docker-compose up -d
```

---

## 🎓 最佳实践

### 1. 开发工作流

```bash
# 1. 拉取最新代码
git pull origin develop

# 2. 更新依赖
yarn bootstrap

# 3. 迁行数据库迁移
yarn db:migration migration:run

# 4. 启动开发服务器
yarn start
```

### 2. 提交代码前检查

```bash
# 运行代码检查
yarn lint

# 运行测试
yarn test

# 运行 E2E 测试
yarn e2e
```

### 3. 性能优化

```bash
# 使用增量构建
# 只修改了前端时，只构建前端
yarn build:package:gauzy

# 只修改了后端时，只构建后端
yarn build:package:api

# 启用 Nx 缓存（需要修改 nx.json）
# 将 "cache": false 改为 "cache": true
```

### 4. 内存管理

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS=--max-old-space-size=12288

# Docker 构建时增加内存
export NODE_OPTIONS=--max-old-space-size=30000
```

### 5. 数据库管理

```bash
# 定期备份数据库（PostgreSQL）
pg_dump -U postgres gauzy > backup.sql

# 恢复数据库
psql -U postgres gauzy < backup.sql

# SQLite 备份
cp apps/api/gauzy.sqlite3 backup.sqlite3
```

### 6. 日志管理

```bash
# 查看实时日志
yarn start:api 2>&1 | tee api.log

# Docker 日志
docker-compose logs -f api
docker-compose logs -f gauzy

# 清理旧日志
find . -name "*.log" -mtime +7 -delete
```

---

## 📚 进阶主题

### 1. 多应用同时运行

```bash
# 启动多个应用
yarn concurrently \
  "yarn start:api" \
  "yarn start:gauzy" \
  "yarn start:desktop"
```

### 2. 调试模式

```bash
# 调试后端
node --inspect-brk=0.0.0.0:9229 dist/apps/api/main.js

# 调试前端（Chrome）
# 1. 打开 Chrome DevTools
# 2. 访问 chrome://inspect
# 3. 连接到 Node.js 实例
```

### 3. 自定义插件开发

```bash
# 创建新插件
cd packages/plugins
mkdir my-plugin
cd my-plugin

# 添加到 nx.json
# 在 plugins 数组中添加新插件配置
```

### 4. 生产部署

**Kubernetes 部署**：
```bash
# 使用 Helm Charts
helm install gauzy ever-charts/gauzy

# 或使用 Terraform
cd ever-gauzy-terraform
pulumi up
```

**DigitalOcean 部署**：
```bash
# 使用 App Platform
# 参考 .do 目录下的配置文件
```

---

## 🔗 参考资源

### 官方文档
- [Gauzy 官方网站](https://gauzy.co)
- [API 文档](https://api.gauzy.co/docs)
- [平台文档](https://docs.gauzy.co)
- [GitHub Wiki](https://github.com/ever-co/ever-gauzy/wiki)

### 相关链接
- [Demo 环境](https://demo.gauzy.co)
- [SaaS 环境](https://app.gauzy.co)
- [下载页面](https://gauzy.co/downloads)

### 社区支持
- [Slack 社区](https://join.slack.com/t/gauzy)
- [Discord 聊天](https://discord.gg/hKQfn4j)
- [Gitter 聊天](https://gitter.im/ever-co/ever-gauzy)
- [问题反馈](https://github.com/ever-co/ever-gauzy/issues)

---

## 📝 附录

### 快速参考

| 命令 | 用途 |
|------|------|
| `yarn start` | 一键启动 API + UI |
| `yarn start:api` | 只启动后端 API |
| `yarn start:gauzy` | 只启动前端 UI |
| `yarn bootstrap` | 安装依赖并初始化 |
| `yarn build` | 构建所有应用 |
| `yarn lint` | 代码检查 |
| `yarn test` | 运行单元测试 |
| `yarn db:migration` | 数据库迁移 |
| `yarn seed` | 初始化数据库 |

### 端口说明

| 服务 | 默认端口 | 访问地址 |
|------|---------|---------|
| Web UI | 4200 | http://localhost:4200 |
| API | 3000 | http://localhost:3000/api |
| Pgweb | 8081 | http://localhost:8081 |
| OpenSearch Dashboards | 5601 | http://localhost:5601 |
| MinIO Console | 9000 | http://localhost:9000 |

### 默认账号

| 角色 | 邮箱 | 密码 | 说明 |
|------|------|------|------|
| 超级管理员 | admin@ever.co | admin | 系统管理员，不可追踪时间 |
| 员工 | employee@ever.co | 123456 | 普通员工，可追踪时间 |

---

## ✅ 检查清单

运行项目前，请确认：

- [ ] Node.js 版本 >= 22.x
- [ ] Yarn 版本 >= 1.22.x
- [ ] 已运行 `yarn bootstrap`
- [ ] 已配置 `.env.local` 或使用默认配置
- [ ] 数据库服务已启动（如使用非 SQLite）
- [ ] 端口 3000 和 4200 未被占用
- [ ] 有足够的磁盘空间（建议 > 5GB）
- [ ] 网络连接正常（用于下载依赖）

---

**祝您使用愉快！** 🎉

如有问题，请参考上述常见问题或联系社区支持。
