# Docker Compose 使用指南

## 📋 目录

- [Docker Compose 概述](#docker-compose-概述)
- [环境准备](#环境准备)
- [Docker Daemon 启动](#docker-daemon-启动)
- [Compose 文件说明](#compose-文件说明)
- [运行方式](#运行方式)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)
- [高级用法](#高级用法)

---

## 🎯 Docker Compose 概述

Ever Gauzy Platform 提供了多个 Docker Compose 配置文件，用于快速部署和管理整个平台。

### 可用的 Compose 文件

| 文件 | 用途 | 服务数量 | 适用场景 |
|------|------|---------|---------|
| `docker-compose.demo.yml` | Demo 模式 | 3 个（db, api, webapp） | 快速体验、功能测试 |
| `docker-compose.yml` | 生产模式 | 8+ 个 | 生产环境、完整部署 |
| `docker-compose.build.yml` | 从源码构建 | 8+ 个 | 本地开发、自定义构建 |
| `docker-compose.infra.yml` | 仅基础设施 | 5+ 个 | 单独运行基础设施服务 |

### 服务架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Docker Compose 网络拓扑                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Web App    │◄───│     API      │◄───│   Database   │  │
│  │  (port 4200) │    │  (port 3000) │    │  (port 5432) │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         ▲                   ▲                   ▲            │
│         │                   │                   │            │
│    http://localhost    http://localhost/api    internal      │
│         :4200              :3000            network       │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 环境准备

### 1. 安装 Docker

#### Windows (WSL2)

```powershell
# 下载 Docker Desktop for Windows
# https://www.docker.com/products/docker-desktop/

# 或使用 Chocolatey
choco install docker-desktop

# 或使用 Winget
winget install Docker.DockerDesktop
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# 或使用官方脚本
curl -fsSL https://get.docker.com | sh

# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录使组权限生效
```

#### macOS

```bash
# 下载 Docker Desktop for Mac
# https://www.docker.com/products/docker-desktop/

# 或使用 Homebrew
brew install --cask docker

# 启动 Docker Desktop
open /Applications/Docker.app
```

### 2. 检查安装

```bash
# 检查 Docker 版本
docker --version
# 应该输出类似：Docker version 24.x.x

# 检查 Docker Compose 版本
docker compose version
# 应该输出类似：Docker Compose version v2.x.x

# 检查 Docker daemon 是否运行
docker info
# 如果成功，会显示 Docker 系统信息
```

---

## 🚀 Docker Daemon 启动

### Windows (WSL2) - 最常见问题

**问题**：`Cannot connect to Docker daemon at unix:///var/run/docker.sock`

**解决方案 1：启动 Docker Desktop**

```powershell
# 方法 1：从开始菜单启动
# 点击 Windows 开始菜单 -> Docker Desktop

# 方法 2：使用 PowerShell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# 方法 3：使用 WSL2 命令
# 在 Windows PowerShell 中执行
wsl -d docker-desktop
```

**解决方案 2：检查 WSL2 集成**

```bash
# 在 WSL2 中检查 Docker 是否可用
docker info

# 如果失败，检查 Docker Desktop 设置
# 1. 打开 Docker Desktop
# 2. 进入 Settings -> Resources -> WSL Integration
# 3. 启用 "Enable integration with my default WSL distro"
# 4. 启用具体的 WSL 发行版（如 Ubuntu）
# 5. 点击 "Apply & Restart"
```

**解决方案 3：重启 Docker 服务**

```powershell
# 在 Windows PowerShell (管理员) 中执行
Stop-Service docker
Start-Service docker

# 或在 WSL2 中执行
sudo service docker start

# 检查 Docker 状态
sudo service docker status
```

**解决方案 4：使用 Docker Desktop 的 WSL2 引擎**

```bash
# 确保 Docker Desktop 使用 WSL2 后端
# 1. 打开 Docker Desktop
# 2. 进入 Settings -> General
# 3. 确保 "Use the WSL 2 based engine" 已勾选
# 4. 点击 "Apply & Restart"
```

### Linux

```bash
# 启动 Docker 服务
sudo systemctl start docker

# 设置开机自启动
sudo systemctl enable docker

# 检查状态
sudo systemctl status docker

# 如果失败，重启服务
sudo systemctl restart docker
```

### macOS

```bash
# 启动 Docker Desktop
open /Applications/Docker.app

# 检查 Docker 状态
docker info

# 在菜单栏中应该看到 Docker 图标为运行状态
```

### 验证 Docker Daemon 运行

```bash
# 测试 Docker 是否正常工作
docker run hello-world

# 应该看到如下输出：
# Hello from Docker!
# This message shows that your installation appears to be working correctly.

# 测试 Docker Compose
docker compose version
```

---

## 📄 Compose 文件说明

### docker-compose.demo.yml 详细分析

```yaml
services:
  # PostgreSQL 数据库服务
  db:
    image: postgres:17-alpine        # 使用 PostgreSQL 17 Alpine 版本
    container_name: db              # 容器名称
    restart: always                # 始终重启
    environment:
      POSTGRES_DB: gauzy        # 数据库名称
      POSTGRES_USER: postgres      # 数据库用户
      POSTGRES_PASSWORD: gauzy_password  # 数据库密码
    healthcheck:                  # 健康检查
      test: ['CMD-SHELL', 'pg_isready -U postgres -d gauzy || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data/  # 数据持久化
    ports:
      - '5432:5432'          # 映射端口到主机
    networks:
      - overlay

  # Gauzy API 服务
  api:
    container_name: api
    image: ghcr.io/ever-co/gauzy-api:latest  # 预构建的 API 镜像
    environment:
      API_HOST: api           # API 主机名
      API_PORT: 3000         # API 端口
      NODE_ENV: development    # Node 环境
      DB_HOST: db            # 数据库主机（指向 db 服务）
    env_file:
      - .env.demo.compose    # 从文件加载环境变量
    entrypoint: './entrypoint.compose.sh'
    command: ['node', 'main.js']
    restart: on-failure
    depends_on:
      db:
        condition: service_healthy  # 等待数据库健康
    ports:
      - '3000:3000'        # 映射端口到主机
    networks:
      - overlay

  # Gauzy Web 应用服务
  webapp:
    container_name: webapp
    image: ghcr.io/ever-co/gauzy-webapp:latest  # 预构建的 Web 镜像
    environment:
      WEB_HOST: webapp
      WEB_PORT: 4200
      NODE_ENV: development
      API_BASE_URL: http://localhost:3000  # API 地址
      CLIENT_BASE_URL: http://localhost:4200  # 客户端地址
      DEMO: 'true'          # Demo 模式标识
    entrypoint: './entrypoint.compose.sh'
    command: ['nginx', '-g', 'daemon off;']  # 使用 Nginx
    env_file:
      - .env.demo.compose
    restart: on-failure
    links:
      - db:db
      - api:api
    depends_on:
      db:
        condition: service_healthy
      api:
        condition: service_started
    ports:
      - '4200:4200'        # 映射端口到主机
    networks:
      - overlay

volumes:
  postgres_data: {}          # 持久化数据库数据

networks:
  overlay:
    driver: bridge           # 使用桥接网络
```

### 服务说明

| 服务 | 镜像 | 端口 | 依赖 | 说明 |
|------|------|------|------|------|
| **db** | postgres:17-alpine | 5432 | 无 | PostgreSQL 数据库 |
| **api** | ghcr.io/ever-co/gauzy-api:latest | 3000 | db | NestJS 后端 API |
| **webapp** | ghcr.io/ever-co/gauzy-webapp:latest | 4200 | db, api | Angular 前端应用 |

### 端口映射

| 服务 | 容器端口 | 主机端口 | 访问地址 |
|------|---------|---------|---------|
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| API | 3000 | 3000 | http://localhost:3000/api |
| Web App | 4200 | 4200 | http://localhost:4200 |

---

## 🚀 运行方式

### 方式 1：Demo 模式（推荐新手）

**适用场景**：首次使用、功能演示、快速体验

```bash
# 使用预构建镜像启动
docker compose -f docker-compose.demo.yml up -d
```

**命令详解**：
- `-f docker-compose.demo.yml`: 指定配置文件
- `up`: 创建并启动容器
- `-d`: 后台运行（detached mode）

**首次启动流程**：
1. Docker 拉取镜像（可能需要 5-10 分钟）
2. 启动数据库容器
3. 等待数据库健康检查通过
4. 启动 API 容器
5. 启动 Web App 容器
6. 访问 http://localhost:4200

**默认账号**：
- 管理员：`admin@ever.co` / `admin`
- 员工：`employee@ever.co` / `123456`

### 方式 2：生产模式

**适用场景**：生产环境、完整功能

```bash
# 编辑配置文件（可选）
vim .env.compose

# 启动完整环境
docker compose up -d

# 查看日志
docker compose logs -f
```

**包含的服务**：
- PostgreSQL（数据库）
- Pgweb（数据库管理界面）
- OpenSearch（搜索引擎）
- OpenSearch Dashboards（搜索仪表板）
- MinIO（对象存储）
- Redis（缓存）
- Jitsu（数据收集）
- Cube（数据分析）

### 方式 3：从源码构建

**适用场景**：本地开发、自定义修改

```bash
# 构建并启动（耗时较长）
docker compose -f docker-compose.build.yml up -d
```

**警告**：首次构建可能需要 30-60 分钟！

### 方式 4：仅运行基础设施

**适用场景**：单独运行数据库、缓存等服务

```bash
# 仅启动基础设施服务
docker compose -f docker-compose.infra.yml up -d

# 然后手动运行 API 和 UI
yarn start
```

### 方式 5：使用环境变量文件

```bash
# 使用自定义环境变量
docker compose --env-file .env.custom up -d
```

---

## ⚙️ 环境变量配置

### 查看环境变量文件

```bash
# 查看示例文件
cat .env.demo.compose

# 复制并修改
cp .env.demo.compose .env.custom
vim .env.custom
```

### 常用环境变量

#### 数据库配置

```env
DB_NAME=gauzy
DB_USER=postgres
DB_PASS=gauzy_password
DB_TYPE=postgres
```

#### API 配置

```env
API_HOST=api
API_PORT=3000
API_BASE_URL=http://localhost:3000
NODE_ENV=development
```

#### 前端配置

```env
WEB_HOST=webapp
WEB_PORT=4200
CLIENT_BASE_URL=http://localhost:4200
DEMO=true
```

#### 集成配置（可选）

```env
# GitHub 集成
GAUZY_GITHUB_CLIENT_ID=your_client_id
GAUZY_GITHUB_CLIENT_SECRET=your_client_secret

# Sentry 错误追踪
SENTRY_DSN=your_sentry_dsn

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key

# Cloudinary 图片存储
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
```

---

## 🔧 常用命令

### 容器管理

```bash
# 查看运行中的容器
docker compose ps

# 查看所有容器（包括停止的）
docker compose ps -a

# 查看容器日志
docker compose logs

# 查看特定服务的日志
docker compose logs api
docker compose logs webapp

# 实时查看日志
docker compose logs -f api

# 停止所有容器
docker compose stop

# 停止并删除容器
docker compose down

# 停止并删除容器、网络、匿名卷
docker compose down -v

# 强制删除所有相关资源
docker compose down -v --remove-orphans
```

### 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart api
docker compose restart webapp

# 重新构建并启动
docker compose up -d --build
```

### 进入容器

```bash
# 进入 API 容器
docker compose exec api bash

# 进入数据库容器
docker compose exec db psql -U postgres -d gauzy

# 在容器中执行命令
docker compose exec webapp cat /etc/os-release
```

### 更新镜像

```bash
# 拉取最新镜像
docker compose pull

# 重新创建容器
docker compose up -d

# 或者一键更新
docker compose pull && docker compose up -d
```

### 数据库操作

```bash
# 连接到数据库
docker compose exec db psql -U postgres -d gauzy

# 备份数据库
docker compose exec db pg_dump -U postgres gauzy > backup.sql

# 恢复数据库
docker compose exec -T db psql -U postgres gauzy < backup.sql

# 查看数据库大小
docker compose exec db psql -U postgres -d gauzy -c "SELECT pg_size_pretty(pg_database_size('gauzy'));"
```

### 清理资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune

# 清理未使用的网络
docker network prune

# 清理所有未使用的资源
docker system prune -a --volumes
```

---

## 🐛 常见问题

### 1. Docker Daemon 未运行

**错误信息**：
```
Cannot connect to Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

**解决方案**：

**Windows (WSL2)**：
```powershell
# 启动 Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# 等待几秒钟后验证
docker info

# 或在 WSL2 中启动 Docker
sudo service docker start
```

**Linux**：
```bash
# 启动 Docker 服务
sudo systemctl start docker

# 检查状态
sudo systemctl status docker
```

**macOS**：
```bash
# 启动 Docker Desktop
open /Applications/Docker.app

# 检查状态
docker info
```

### 2. 端口已被占用

**错误信息**：
```
Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use
```

**解决方案**：

**查找占用端口的进程**：
```bash
# Linux/Mac
lsof -i :3000
lsof -i :4200
lsof -i :5432

# Windows (PowerShell)
netstat -ano | findstr :3000
netstat -ano | findstr :4200
netstat -ano | findstr :5432
```

**终止进程**：
```bash
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**或修改端口映射**：
```bash
# 修改 docker-compose.yml 中的端口映射
ports:
  - '3001:3000'  # 将主机端口改为 3001
```

### 3. 镜像拉取失败

**错误信息**：
```
unable to get image 'ghcr.io/ever-co/gauzy-api:latest'
```

**解决方案**：

**检查网络连接**：
```bash
# 测试 GitHub Container Registry 连接
ping ghcr.io

# 或使用代理
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

**手动拉取镜像**：
```bash
# 单独拉取镜像
docker pull ghcr.io/ever-co/gauzy-api:latest
docker pull ghcr.io/ever-co/gauzy-webapp:latest
docker pull postgres:17-alpine
```

**使用国内镜像源**：
```bash
# 编辑 Docker Desktop 设置
# 1. 打开 Docker Desktop
# 2. 进入 Settings -> Docker Engine
# 3. 添加镜像加速器配置
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

### 4. 数据库连接失败

**错误信息**：
```
Connection refused: db:5432
```

**解决方案**：

**检查数据库容器状态**：
```bash
# 查看数据库容器日志
docker compose logs db

# 检查容器是否运行
docker compose ps db
```

**等待数据库就绪**：
```bash
# 手动检查数据库健康状态
docker compose exec db pg_isready -U postgres

# 应该返回：/var/run/postgresql:5432 - accepting connections
```

**检查网络连接**：
```bash
# 测试从 API 容器到数据库的连接
docker compose exec api ping -c 3 db

# 测试端口连接
docker compose exec api nc -zv db 5432
```

### 5. 权限错误

**错误信息**：
```
permission denied while trying to connect to the Docker daemon socket
```

**解决方案**：

**Linux**：
```bash
# 将当前用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新登录使组权限生效
newgrp docker

# 或注销并重新登录
```

**或使用 sudo**：
```bash
# 临时使用 sudo
sudo docker compose up -d
```

### 6. 内存不足

**错误信息**：
```
no space left on device
```

**解决方案**：

**清理 Docker 资源**：
```bash
# 清理未使用的资源
docker system prune -a --volumes

# 清理特定资源
docker image prune -a
docker container prune
docker volume prune
```

**增加 Docker 内存限制**：

**Docker Desktop (Windows/Mac)**：
1. 打开 Docker Desktop
2. 进入 Settings -> Resources
3. 增加 "Memory" 到 4GB 或更多
4. 点击 "Apply & Restart"

**Linux**：
```bash
# 检查 Docker 存储驱动
docker info | grep "Storage Driver"

# 清理磁盘空间
df -h
```

### 7. 容器启动失败

**错误信息**：
```
Container exited with code 1
```

**解决方案**：

**查看详细日志**：
```bash
# 查看容器日志
docker compose logs <service_name>

# 查看最后 100 行
docker compose logs --tail=100 <service_name>

# 实时查看日志
docker compose logs -f <service_name>
```

**进入容器调试**：
```bash
# 启动容器但不运行主进程
docker compose run --rm <service_name> bash

# 手动运行命令
docker compose run --rm <service_name> node main.js
```

**检查环境变量**：
```bash
# 查看容器的环境变量
docker compose exec <service_name> env

# 检查特定变量
docker compose exec <service_name> sh -c 'echo $API_HOST'
```

### 8. WSL2 特定问题

**问题**：Docker 在 WSL2 中无法连接

**解决方案**：

**方案 1：确保 Docker Desktop WSL2 集成已启用**
```
1. 打开 Docker Desktop
2. 进入 Settings -> Resources -> WSL Integration
3. 勾选 "Enable integration with my default WSL distro"
4. 勾选具体的 WSL 发行版
5. 点击 "Apply & Restart"
```

**方案 2：重启 WSL2**
```powershell
# 在 Windows PowerShell (管理员) 中执行
wsl --shutdown

# 重新打开 WSL2
wsl
```

**方案 3：更新 WSL2**
```powershell
# 在 Windows PowerShell (管理员) 中执行
wsl --update
wsl --shutdown
```

**方案 4：直接在 WSL2 中使用 Docker**
```bash
# 确保 Docker Desktop 已启动
# 在 WSL2 终端中
sudo service docker start
docker info
```

---

## 🎓 高级用法

### 1. 扩展服务配置

```yaml
# 添加自定义服务
services:
  # 新增监控服务
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - overlay
```

### 2. 使用多阶段构建

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production  # 使用 production 阶段
    args:
      NODE_ENV: production
```

### 3. 健康检查自定义

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 4. 资源限制

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 5. 日志配置

```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 6. 网络配置

```yaml
networks:
  overlay:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 📊 监控和调试

### 查看资源使用

```bash
# 查看容器资源使用情况
docker stats

# 查看特定容器
docker stats api webapp

# 持续监控
docker stats --no-stream
```

### 容器检查

```bash
# 查看容器详细信息
docker inspect api

# 查看容器端口映射
docker port api

# 查看容器进程
docker top api

# 查看容器文件系统变更
docker diff api
```

### 网络调试

```bash
# 查看网络列表
docker network ls

# 查看网络详情
docker network inspect overlay

# 测试容器间连接
docker compose exec api ping -c 3 webapp
```

---

## 🚨 故障排查流程

### 问题排查步骤

```bash
# 1. 检查 Docker 状态
docker info

# 2. 检查容器状态
docker compose ps

# 3. 查看日志
docker compose logs

# 4. 检查网络
docker network ls
docker network inspect overlay

# 5. 检查卷
docker volume ls
docker volume inspect postgres_data

# 6. 进入容器调试
docker compose exec api bash
```

### 完整重启流程

```bash
# 完全停止并清理
docker compose down -v --remove-orphans

# 清理未使用的资源
docker system prune -a --volumes

# 重新拉取镜像
docker compose pull

# 重新启动
docker compose up -d

# 查看启动日志
docker compose logs -f
```

---

## 📚 参考资源

### 官方文档
- [Docker 官方文档](https://docs.docker.com)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Docker Desktop 文档](https://docs.docker.com/desktop/)

### Gauzy 相关
- [Gauzy Docker 配置](https://github.com/ever-co/ever-gauzy)
- [Docker Compose 文件](https://github.com/ever-co/ever-gauzy/blob/develop/docker-compose.demo.yml)

### 社区支持
- [Docker Community](https://www.docker.com/community)
- [Stack Overflow - Docker](https://stackoverflow.com/questions/tagged/docker)
- [Gauzy 社区](https://join.slack.com/t/gauzy)

---

## ✅ 快速检查清单

运行前请确认：

- [ ] Docker Desktop 已启动
- [ ] Docker daemon 正在运行（`docker info` 成功）
- [ ] Docker Compose 版本 >= 2.20.x
- [ ] 端口 3000、4200、5432 未被占用
- [ ] 磁盘空间充足（建议 > 10GB）
- [ ] 网络连接正常
- [ ] 环境变量文件已配置（如需要）

---

## 🎯 常用命令速查表

| 操作 | 命令 |
|------|------|
| 启动 Demo | `docker compose -f docker-compose.demo.yml up -d` |
| 停止所有 | `docker compose stop` |
| 删除容器 | `docker compose down` |
| 查看日志 | `docker compose logs -f` |
| 重启服务 | `docker compose restart` |
| 更新镜像 | `docker compose pull && docker compose up -d` |
| 查看状态 | `docker compose ps` |
| 进入容器 | `docker compose exec api bash` |
| 清理资源 | `docker system prune -a --volumes` |

---

**祝您使用愉快！** 🎉

如有问题，请参考上述故障排查流程或联系社区支持。
