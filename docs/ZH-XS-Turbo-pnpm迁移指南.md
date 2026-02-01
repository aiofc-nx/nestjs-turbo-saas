# Turbo + pnpm 迁移指南

## 迁移概述

本项目已从 **Nx + Yarn** 迁移到 **Turbo + pnpm** 构建系统。

## 已完成的工作

### ✅ 1. 创建 pnpm-workspace.yaml

已创建 pnpm workspace 配置文件，定义了 monorepo 的工作区结构。

### ✅ 2. 创建 turbo.json

已创建 Turbo 配置文件，定义了构建管道和任务依赖关系。

### ✅ 3. 更新根目录 package.json

- ✅ 添加 `turbo` 到 devDependencies
- ✅ 更新 `packageManager` 为 `pnpm@9.0.0`
- ✅ 更新所有 scripts，将 `yarn` 改为 `pnpm`，`nx` 改为 `turbo`
- ✅ 添加新的 Turbo 命令（`turbo:build`, `turbo:test`, `turbo:lint` 等）

### ✅ 4. 更新所有项目的 package.json

已为所有项目（apps 和 packages）添加了标准的构建脚本：
- `build` - 开发构建
- `build:prod` - 生产构建
- `dev` - 开发模式（watch）
- `test` - 运行测试
- `lint` - 代码检查
- `typecheck` - TypeScript 类型检查
- `clean` - 清理构建产物

### ✅ 5. 更新构建脚本

- ✅ API 项目：使用 `pnpm nest build` 替代 `pnpm nx build`
- ✅ 库项目：使用 `tsc` 直接编译
- ✅ 所有项目：scripts 中的 `yarn` 已替换为 `pnpm`

## 新的命令使用方式

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 安装特定包的依赖
pnpm install --filter @gauzy/api
```

### 构建项目

```bash
# 构建所有项目
pnpm turbo run build

# 构建特定项目
pnpm turbo run build --filter @gauzy/api

# 构建生产版本
pnpm turbo run build:prod

# 构建所有包
pnpm turbo run build --filter ./packages/*
```

### 开发模式

```bash
# 启动所有项目的开发模式
pnpm turbo run dev

# 启动特定项目
pnpm turbo run dev --filter @gauzy/api

# 或使用简写
pnpm dev --filter @gauzy/api
```

### 运行测试

```bash
# 运行所有测试
pnpm turbo run test

# 运行特定项目的测试
pnpm turbo run test --filter @gauzy/core
```

### 代码检查

```bash
# 检查所有项目
pnpm turbo run lint

# 检查特定项目
pnpm turbo run lint --filter @gauzy/api
```

### 类型检查

```bash
# 检查所有项目
pnpm turbo run typecheck

# 检查特定项目
pnpm turbo run typecheck --filter @gauzy/core
```

## 常用命令对照表

| 旧命令 (Nx + Yarn) | 新命令 (Turbo + pnpm) |
|-------------------|----------------------|
| `yarn nx build api` | `pnpm turbo run build --filter @gauzy/api` |
| `yarn nx build core` | `pnpm turbo run build --filter @gauzy/core` |
| `yarn nx test` | `pnpm turbo run test` |
| `yarn nx lint` | `pnpm turbo run lint` |
| `yarn nx affected:build` | `pnpm turbo run build` |
| `yarn build:api` | `pnpm turbo run build --filter @gauzy/api` |
| `yarn build:package:api` | `pnpm turbo run build --filter ./packages/*` |
| `yarn start:api` | `pnpm turbo run dev --filter @gauzy/api` |

## 项目结构

### 应用项目 (Apps)

- `apps/api` - 主 API 服务器
- `apps/desktop-api` - 桌面应用 API
- `apps/mcp` - MCP 服务器
- `apps/mcp-auth` - MCP 认证服务器

### 库项目 (Packages)

- `packages/core` - 核心业务逻辑
- `packages/auth` - 认证模块
- `packages/plugin` - 插件基础库
- `packages/mcp-server` - MCP 服务器库
- `packages/common` - 通用工具库
- `packages/config` - 配置库
- `packages/constants` - 常量库
- `packages/contracts` - 接口定义库
- `packages/utils` - 工具函数库

### 插件项目 (Packages/Plugins)

所有 `packages/plugins/*` 下的后端插件。

## Turbo 配置说明

### turbo.json 中的 Pipeline

- **build**: 构建任务，依赖上游项目的构建
- **build:prod**: 生产构建任务
- **test**: 测试任务，依赖构建
- **lint**: 代码检查任务
- **typecheck**: 类型检查任务
- **dev**: 开发模式，持久运行
- **start**: 启动任务，持久运行

### 缓存策略

Turbo 会自动缓存构建结果，只有以下情况会重新构建：
- 源代码文件发生变化
- 依赖项目发生变化
- 环境变量发生变化（如 NODE_ENV）

## 迁移后的优势

1. **更快的构建速度**：Turbo 的增量构建和缓存机制
2. **更好的并行化**：Turbo 自动并行执行独立任务
3. **更小的依赖体积**：pnpm 的硬链接机制节省磁盘空间
4. **更清晰的依赖关系**：Turbo 自动处理任务依赖
5. **更好的开发体验**：更简单的命令和更快的反馈

## 注意事项

### 1. 首次安装

首次使用 pnpm 需要安装：

```bash
npm install -g pnpm
# 或
corepack enable
corepack prepare pnpm@9.0.0 --activate
```

### 2. 清理旧文件

建议删除以下文件/目录：
- `node_modules`（如果存在）
- `yarn.lock`
- `.yarn` 目录（如果存在）
- `dist` 目录（可选，重新构建会生成）

### 3. Nx 配置保留

`project.json` 和 `nx.json` 文件暂时保留，但 Turbo 不会使用它们。如果确认不再需要 Nx，可以删除这些文件。

### 4. 构建输出

Turbo 会使用各项目 `package.json` 中定义的构建脚本，确保输出目录与之前一致：
- API: `dist/apps/api`
- 库: `dist/packages/{package-name}`

### 5. 环境变量

某些构建脚本依赖环境变量，确保正确设置：
```bash
NODE_ENV=production pnpm turbo run build:prod
```

## 故障排除

### 问题：找不到 turbo 命令

**解决**：
```bash
pnpm install
```

### 问题：构建失败，提示找不到依赖

**解决**：
```bash
# 重新安装依赖
pnpm install

# 构建依赖项目
pnpm turbo run build --filter ./packages/*
```

### 问题：缓存问题

**解决**：
```bash
# 清理 Turbo 缓存
pnpm turbo clean

# 或强制重新构建
pnpm turbo run build --force
```

### 问题：TypeScript 路径解析错误

**解决**：确保 `tsconfig.json` 中的路径映射正确，Turbo 不会自动处理路径映射，需要确保构建脚本正确配置。

## 后续优化建议

1. **移除 Nx 依赖**：如果确认不再需要，可以移除所有 `@nx/*` 依赖
2. **优化构建脚本**：根据实际需求调整各项目的构建脚本
3. **配置 CI/CD**：更新 CI/CD 流程以使用 Turbo
4. **性能监控**：使用 `pnpm turbo run build --dry-run` 查看构建计划

## 参考资源

- [Turbo 官方文档](https://turbo.build/repo/docs)
- [pnpm 官方文档](https://pnpm.io/)
- [Turbo + pnpm 最佳实践](https://turbo.build/repo/docs/handbook/pnpm)

---

**文档版本**: 1.0.0
**创建日期**: 2024-XX-XX
**最后更新**: 2024-XX-XX
