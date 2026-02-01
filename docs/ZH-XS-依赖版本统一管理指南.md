# 依赖版本统一管理指南

## 概述

本文档说明如何在 monorepo 中使用 pnpm workspace 统一管理各项目的依赖版本，避免版本冲突，确保依赖一致性。

## 管理方式

### 1. pnpm.overrides（推荐）

在根目录的 `package.json` 中使用 `pnpm.overrides` 来强制统一依赖版本。这是 pnpm 提供的统一管理依赖版本的最佳方式。

#### 配置位置

```json
{
  "pnpm": {
    "overrides": {
      "@grpc/grpc-js": "^1.7.3",
      "@nestjs/schematics": "^11.0.9",
      "@nestjs/testing": "^11.1.12",
      "@types/express": "^5.0.1",
      "jest": "^29.7.0",
      "typescript": "^5.8.0",
      "ts-node": "^10.9.2",
      "ts-jest": "^29.4.6",
      "cross-env": "^10.1.0",
      "dotenv": "^17.2.3",
      "yargs": "^17.5.0",
      "rimraf": "^3.0.2",
      "nodemon": "^3.1.0"
    }
  }
}
```

#### 工作原理

- `pnpm.overrides` 会强制所有 workspace 包使用指定的依赖版本
- 即使子项目的 `package.json` 中声明了不同的版本，也会被覆盖
- 这确保了整个 monorepo 中依赖版本的一致性

#### 当前统一管理的依赖

以下依赖版本已在根目录统一管理：

**生产依赖：**
- `@grpc/grpc-js`: `^1.7.3`
- `dotenv`: `^17.2.3`
- `yargs`: `^17.5.0`

**开发依赖：**
- `@nestjs/schematics`: `^11.0.9`
- `@nestjs/testing`: `^11.1.12`
- `@types/express`: `^5.0.1`
- `jest`: `^29.7.0`
- `typescript`: `^5.8.0`
- `ts-node`: `^10.9.2`
- `ts-jest`: `^29.4.6`
- `cross-env`: `^10.1.0`
- `rimraf`: `^3.0.2`
- `nodemon`: `^3.1.0`

### 2. 根目录共享依赖

根目录的 `package.json` 中的 `dependencies` 和 `devDependencies` 会被所有子项目共享。

#### 适用场景

- 构建工具（如 `turbo`、`typescript`）
- 开发工具（如 `prettier`、`eslint`）
- 所有项目都需要的基础依赖

#### 当前根目录依赖

根目录已包含以下共享依赖：

**生产依赖：**
- `@nestjs/common`: `^11.1.12`
- `@nestjs/core`: `^11.1.12`
- `dotenv`: `^17.2.3`
- `rxjs`: `^7.8.2`
- `reflect-metadata`: `^0.2.2`
- 等...

**开发依赖：**
- `typescript`: `^5.8.0`
- `jest`: `^29.7.0`
- `prettier`: `^2.8.4`
- `turbo`: `^2.0.0`
- 等...

### 3. workspace 协议

子项目引用内部包时，应使用 workspace 协议：

```json
{
  "dependencies": {
    "@gauzy/core": "workspace:*",
    "@gauzy/auth": "workspace:*"
  }
}
```

这确保了：
- 始终使用 workspace 内的包版本
- 避免发布时的问题
- 支持本地开发

## 如何添加新的统一依赖版本

### 步骤 1: 检测版本冲突

运行以下命令检测依赖版本冲突：

```bash
# 分析依赖版本冲突
python3 << 'EOF'
import json
import glob
from collections import defaultdict

deps_versions = defaultdict(set)

for pkg_file in glob.glob('**/package.json', recursive=True):
    if 'node_modules' in pkg_file or pkg_file == 'package.json':
        continue
    try:
        with open(pkg_file, 'r') as f:
            pkg = json.load(f)
            deps = {**pkg.get('dependencies', {}), **pkg.get('devDependencies', {})}
            for dep, version in deps.items():
                if not dep.startswith('@gauzy/'):
                    deps_versions[dep].add(version)
    except:
        pass

conflicts = {k: v for k, v in deps_versions.items() if len(v) > 1}
for dep, versions in sorted(conflicts.items()):
    print(f"{dep}: {sorted(versions)}")
EOF
```

### 步骤 2: 选择统一版本

对于有冲突的依赖，选择：
1. 最新稳定版本
2. 最常用的版本
3. 兼容所有使用场景的版本

### 步骤 3: 添加到 pnpm.overrides

在根目录 `package.json` 的 `pnpm.overrides` 中添加：

```json
{
  "pnpm": {
    "overrides": {
      "依赖名": "统一版本"
    }
  }
}
```

### 步骤 4: 更新子项目（可选）

虽然 `pnpm.overrides` 会自动覆盖，但为了代码清晰，建议更新子项目的 `package.json` 以反映统一版本。

### 步骤 5: 重新安装依赖

```bash
pnpm install
```

## 常用依赖版本管理

### NestJS 相关

所有 NestJS 相关依赖应保持版本一致：

```json
{
  "pnpm": {
    "overrides": {
      "@nestjs/common": "^11.1.12",
      "@nestjs/core": "^11.1.12",
      "@nestjs/testing": "^11.1.12",
      "@nestjs/schematics": "^11.0.9"
    }
  }
}
```

### TypeScript 相关

TypeScript 工具链应统一版本：

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "^5.8.0",
      "ts-node": "^10.9.2",
      "ts-jest": "^29.4.6"
    }
  }
}
```

### 测试工具

测试相关依赖应统一：

```json
{
  "pnpm": {
    "overrides": {
      "jest": "^29.7.0",
      "@types/jest": "^29.5.14"
    }
  }
}
```

## 最佳实践

### 1. 定期检查版本冲突

建议在以下情况检查依赖版本：
- 添加新依赖时
- 更新依赖时
- 定期（如每月一次）

### 2. 优先使用 pnpm.overrides

对于需要在所有项目中统一的依赖，优先使用 `pnpm.overrides` 而不是在每个项目中单独声明。

### 3. 保持根目录依赖精简

根目录的 `dependencies` 和 `devDependencies` 应只包含：
- 构建和开发工具
- 所有项目共享的基础依赖
- 不在子项目中重复声明的依赖

### 4. 使用 workspace 协议

所有内部包引用必须使用 `workspace:*` 协议：

```json
{
  "dependencies": {
    "@gauzy/core": "workspace:*"
  }
}
```

### 5. 文档化版本选择

对于重要的依赖版本选择，应在文档中说明原因，特别是：
- 为什么选择特定版本
- 版本兼容性考虑
- 升级计划

## 验证依赖版本

### 检查当前统一版本

```bash
# 查看 pnpm.overrides 配置
cat package.json | grep -A 20 '"pnpm"'
```

### 验证安装的版本

```bash
# 检查特定依赖的安装版本
pnpm list <依赖名> --depth=0
```

### 检查版本冲突

```bash
# 使用 pnpm 检查
pnpm why <依赖名>
```

## 故障排除

### 问题：子项目仍使用不同版本

**原因：** `pnpm.overrides` 配置不正确或未生效

**解决：**
1. 检查 `package.json` 中 `pnpm.overrides` 的格式
2. 删除 `node_modules` 和 `pnpm-lock.yaml`
3. 重新运行 `pnpm install`

### 问题：依赖版本冲突导致构建失败

**原因：** 不同版本的依赖不兼容

**解决：**
1. 识别冲突的依赖
2. 在 `pnpm.overrides` 中统一版本
3. 测试所有受影响的项目

### 问题：workspace 包版本不匹配

**原因：** 内部包未使用 `workspace:*` 协议

**解决：**
1. 检查所有内部包引用
2. 将版本号改为 `workspace:*`
3. 重新安装依赖

## 相关配置

### pnpm-workspace.yaml

定义了 workspace 的结构：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/plugins/*'
  - 'tools'
```

### .npmrc

pnpm 的配置文件，包含 workspace 相关设置：

```
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
prefer-workspace-packages=true
```

## 总结

通过 `pnpm.overrides` 统一管理依赖版本，可以：

1. ✅ **避免版本冲突** - 确保所有项目使用相同的依赖版本
2. ✅ **简化维护** - 在一个地方管理所有依赖版本
3. ✅ **提高稳定性** - 减少因版本不一致导致的问题
4. ✅ **便于升级** - 统一升级依赖版本

## 相关文档

- [pnpm Workspace 文档](https://pnpm.io/workspaces)
- [pnpm Overrides 文档](https://pnpm.io/package_json#pnpmoverrides)
- [Turbo + pnpm 迁移指南](./ZH-XS-Turbo-pnpm迁移指南.md)

---

**最后更新**: 2024-XX-XX
**文档版本**: 1.0.0
