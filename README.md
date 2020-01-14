# XConf 分布式配置中心

[![Github Actions](https://github.com/micro-in-cn/XConf/workflows/CI/badge.svg)](https://github.com/micro-in-cn/XConf/actions)
[![Go Report Card](https://goreportcard.com/badge/github.com/micro-in-cn/XConf)](https://goreportcard.com/report/github.com/micro-in-cn/XConf)
[![GoDoc](https://godoc.org/github.com/micro-in-cn/XConf?status.svg)](https://godoc.org/github.com/micro-in-cn/XConf)
[![LICENSE](https://img.shields.io/badge/LICENSE-MIT-blue)](https://github.com/micro-in-cn/XConf/blob/master/LICENSE)
[![Code Size](https://img.shields.io/github/languages/code-size/micro-in-cn/XConf.svg?style=flat)](https://img.shields.io/github/languages/code-size/micro-in-cn/XConf.svg?style=flat)

> 持续开发中

`XConf` 基于 go-micro 构建的分布式配置中心，提供配置的管理与发布、实时推送.

## 特点

- 修改实时推送
- 高效读取配置
- 支持界面管理
- 安装部署方便，简单

## 服务架构

![image](doc/design.png)

- App
  - Cluster 集群 （A区，B区，C区）
    - Namespace 空间（可理解为一个个配置文件：db.json，db.toml）
      - Value 配置内容

## 目录结构

```text
.
├── LICENSE
├── README.md
├── admin-api   // 配置管理 api 服务
├── agent-api   // 配置获取，推送服务
├── client      // micro config 客户端插件
├── config-srv  // 配置管理服务
├── dashboard   // 前端UI
├── doc
├── go.mod
├── go.sum
├── micro       // micro api 网关
└── proto
```

## 快速使用（开发版）

- 依赖： mysql (root:12345@(127.0.0.1:3306)/xconf?charset=utf8&parseTime=true&loc=Local)

### all in one docker
> 所有服务打包到一个容器中，仅仅作为快速预览使用，不可作为生产使用。

```bash
docker pull xuxu123/xconf-all:latest
```

```bash
docker run --name xconf -it --rm -p 8080:8080 -e BROADCAST=broker -e DATABASE_URL="root:12345@(IP地址:3306)/xconf?charset=utf8&parseTime=true&loc=Local" xuxu123/xconf-all
```

UI： http://127.0.0.1:8080/admin/ui
### Docker Compose 示例
复制配置文件模板到 .env 文件
```shell script
cp .env.example .env
```
根据自己情况配置 .env

.env file:
```shell script
### Registry Config ###
# Set registry provider
MICRO_REGISTRY=etcd
# Set registry address
MICRO_REGISTRY_ADDRESS=192.168.123.172:2379
#DATABASE_URL
DATABASE_URL=root:root@(192.168.123.172:3306)/xconf?charset=utf8&parseTime=true&loc=Local
```
> 若使用 consul 作为注册中心，自行在各个服务中引入 micro/go-plugins/registry/consul

启动全部服务
```shell script
docker-compose up 
```
访问 localhost:8080
### 本地启动服务


- micro api 网关

    ```bash
    cd micro
    make run
    ```

- config-srv 
    >  --database_url value  database url (default: "root:12345@(127.0.0.1:3306)/xconf?charset=utf8&parseTime=true&loc=Local") [$DATABASE_URL]

    ```bash
    cd config-srv
    make run
    # go run main.go --database_url="root:12345@(127.0.0.1:3306)/xconf?charset=utf8&parseTime=true&loc=Local"
    ```

- agent-api

    ```bash
    cd agent-api
    make run
    ```

- admin-api

    ```bash
    cd admin-api
    make run
    ```

- dashboard

    ```bash
    cd dashboard
    npm install
    npm run dev
    ```

- client 适配 micro config 的 source 插件
    > micro config 只有在发布内容更改的情况下 watcher.Next 才会返回

    ```bash
    cd client/example
    go run main.go
    ```

## 借鉴 Apollo

XConf 参考了 Apollo 在业界成熟的设计方案。
