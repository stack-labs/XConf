# Docker Compose Usage

## 配置

从模板创建配置文件 .env

```shell script
cp .env.example .env
```
根据自己实际情况配置

```shell script
### Registry Config ###
# Set registry provider
#MICRO_REGISTRY=etcd
# Set registry address
#MICRO_REGISTRY_ADDRESS=MICRO_REGISTRY_ADDRESS:2379

#DATABASE_URL
DATABASE_URL=root:root@(DATABASE_ADDRESS:3306)/xconf?charset=utf8&parseTime=true&loc=Local
```

> 如需使用 consul ,请在各个服务中引入 github.com/micro/go-plugins/registry/consul

## 使用

启动全部服务

```shell script
docker-compose up 
```

WEB UI： http://127.0.0.1:8080/admin/ui