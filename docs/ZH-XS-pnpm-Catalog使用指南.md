# pnpm Catalog 使用指南

## 为什么使用 Catalog 而不是 overrides？

### Catalog 的优势

**pnpm Catalog** 是 pnpm 推荐的依赖版本管理方式，相比直接使用 `pnpm.overrides` 有以下优势：

1. **更清晰的版本定义**
   - Catalog 将版本定义集中在一个地方，易于查看和维护
   - 支持多个版本集合（如 `prod`、`dev`、`all`），可以根据不同场景使用

2. **更好的可维护性**
   - 版本更新只需修改 Catalog 定义
   - 所有引用该 Catalog 的依赖会自动更新

3. **更灵活的版本策略**
   - 可以为不同场景定义不同的版本集合
   - 支持版本分组管理

4. **更符合 pnpm 最佳实践**
   - Catalog 是 pnpm 官方推荐的方式
   - 与 pnpm 的 workspace 功能完美集成

## 当前配置

### Catalog 定义

根据 [pnpm 官方文档](https://pnpm.io/zh/catalogs)，Catalog 应在 `pnpm-workspace.yaml` 文件中定义：

```yaml
# pnpm-workspace.yaml

packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/plugins/*'
  - 'tools'

# 默认 catalog（使用 catalog: 或 catalog:default 引用）
catalog:
  '@grpc/grpc-js': '^1.7.3'
  '@nestjs/schematics': '^11.0.9'
  '@nestjs/testing': '^11.1.12'
  '@types/express': '^5.0.1'
  'jest': '^29.7.0'
  'typescript': '^5.8.0'
  'ts-node': '^10.9.2'
  'ts-jest': '^29.4.6'
  'cross-env': '^10.1.0'
  'dotenv': '^17.2.3'
  'yargs': '^17.5.0'
  'rimraf': '^3.0.2'
  'nodemon': '^3.1.0'

# 具名 catalogs（可选）
catalogs:
  prod:
    '@grpc/grpc-js': '^1.7.3'
    'dotenv': '^17.2.3'
    'yargs': '^17.5.0'
  dev:
    '@nestjs/schematics': '^11.0.9'
    '@nestjs/testing': '^11.1.12'
    '@types/express': '^5.0.1'
    'jest': '^29.7.0'
    'typescript': '^5.8.0'
    'ts-node': '^10.9.2'
    'ts-jest': '^29.4.6'
    'cross-env': '^10.1.0'
    'rimraf': '^3.0.2'
    'nodemon': '^3.1.0'
```

### Catalog 集合说明

- **`default`** (通过 `catalog:` 引用): 默认目录，包含所有统一管理的依赖（13个依赖，推荐使用）
- **`prod`** (通过 `catalog:prod` 引用): 生产依赖版本目录（3个依赖）
- **`dev`** (通过 `catalog:dev` 引用): 开发依赖版本目录（10个依赖）

### 使用 Catalog

#### 方式 1: 在 overrides 中引用（当前方式）

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "catalog:",
      "jest": "catalog:"
    }
  }
}
```

这种方式会强制所有 workspace 包使用默认 Catalog 中定义的版本。`catalog:` 是 `catalog:default` 的简写。

#### 方式 2: 在子项目的 package.json 中直接引用

```json
{
  "dependencies": {
    "typescript": "catalog:",
    "dotenv": "catalog:prod"
  },
  "devDependencies": {
    "jest": "catalog:dev",
    "typescript": "catalog:"
  }
}
```

这种方式允许子项目明确声明使用哪个 Catalog 的版本：
- `catalog:` 或 `catalog:default` - 使用默认目录
- `catalog:prod` - 使用 prod 目录
- `catalog:dev` - 使用 dev 目录

## 如何添加新的 Catalog 版本

### 步骤 1: 在 Catalog 中添加版本定义

在 `pnpm-workspace.yaml` 的 `catalog` 或 `catalogs` 中添加：

```yaml
# pnpm-workspace.yaml
catalog:
  新依赖名: '^版本号'
```

或添加到具名 catalog：

```yaml
catalogs:
  prod:
    新依赖名: '^版本号'
```

### 步骤 2: 在 overrides 中引用（可选）

如果需要强制所有包使用该版本：

```json
{
  "pnpm": {
    "overrides": {
      "新依赖名": "catalog:"
    }
  }
}
```

### 步骤 3: 在子项目中使用（可选）

子项目可以直接引用：

```json
{
  "dependencies": {
    "新依赖名": "catalog:"
  }
}
```

## 最佳实践

### 1. 使用默认 Catalog

对于大多数依赖，建议使用 `catalog:`（默认目录），这样可以：
- 统一管理所有依赖版本
- 简化配置（无需指定名称）
- 避免版本冲突

### 2. 按场景分组（可选）

如果需要为不同场景使用不同版本，可以创建多个 Catalog：
- `prod`: 生产环境依赖
- `dev`: 开发环境依赖
- `legacy`: 旧版本兼容
- `experimental`: 实验性版本

### 3. 定期更新 Catalog

建议定期检查和更新 Catalog 中的版本：
- 每月检查一次依赖更新
- 及时修复安全漏洞
- 保持依赖版本的一致性

### 4. 文档化版本选择

对于重要的版本选择，应在文档中说明：
- 为什么选择特定版本
- 版本兼容性考虑
- 升级计划

## Catalog vs Overrides

### 使用 Catalog 的场景

✅ **推荐使用 Catalog**：
- 需要统一管理多个依赖版本
- 需要为不同场景使用不同版本
- 希望版本定义更清晰、易维护
- 符合 pnpm 最佳实践

### 使用 Overrides 的场景

✅ **可以使用 Overrides**：
- 只需要覆盖少数几个依赖版本
- 处理依赖版本冲突
- 临时修复版本问题

### 混合使用

可以同时使用 Catalog 和 Overrides：

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "catalog:",
      "特殊依赖": "^特殊版本"
    }
  }
}
```

对应的 `pnpm-workspace.yaml`：

```yaml
catalog:
  typescript: '^5.8.0'
  jest: '^29.7.0'
```

## 验证 Catalog 配置

### 检查 Catalog 定义

```bash
# 查看 pnpm-workspace.yaml 中的 Catalog 定义
cat pnpm-workspace.yaml
```

### 验证依赖版本

```bash
# 检查特定依赖的安装版本
pnpm list <依赖名> --depth=0

# 查看所有依赖版本
pnpm list
```

### 测试 Catalog 引用

在子项目的 `package.json` 中使用 `catalog:` 引用，然后运行：

```bash
pnpm install
```

检查是否正确使用了 Catalog 中定义的版本。

## 迁移指南

### 从 overrides 迁移到 Catalog

1. **在 pnpm-workspace.yaml 中定义 Catalog**
   ```yaml
   catalog:
     typescript: '^5.8.0'
   ```

2. **更新 package.json 中的 overrides 引用**
   ```json
   {
     "pnpm": {
       "overrides": {
         "typescript": "catalog:"
       }
     }
   }
   ```

3. **（可选）更新子项目**
   子项目可以直接使用 `catalog:` 引用。

## 故障排除

### 问题：Catalog 版本未生效

**原因：** Catalog 定义不正确或未正确引用

**解决：**
1. 检查 `pnpm-workspace.yaml` 中 `catalog` 或 `catalogs` 的格式是否正确
2. 确认 overrides 中使用了 `catalog:` 或 `catalog:name` 引用
3. 删除 `node_modules` 和 `pnpm-lock.yaml`
4. 重新运行 `pnpm install`

### 问题：子项目无法使用 catalog: 引用

**原因：** pnpm 版本不支持或配置不正确

**解决：**
1. 确认 pnpm 版本 >= 8.0.0（Catalog 功能要求）
2. 检查 workspace 配置是否正确
3. 确认 Catalog 定义在 `pnpm-workspace.yaml` 中

## 相关文档

- [pnpm Workspace 文档](https://pnpm.io/workspaces)
- [pnpm Catalog 官方文档](https://pnpm.io/zh/catalogs)
- [依赖版本统一管理指南](./ZH-XS-依赖版本统一管理指南.md)

---

**最后更新**: 2024-XX-XX
**文档版本**: 1.0.0
