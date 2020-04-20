# XConf Helm Chart

- Helm `v3.x`

## 配置 [values](/deployments/kubernetes/helm/xconf/values.yaml)

Field | Description | Required
----|----|----
**config-srv.env.DATABASE_URL** | MySQL连接<br/>*`env`配置支持`value`或`valueFrom.secretKeyRef`* | Y
global.env.MICRO_REGISTRY | 默认: `etcd` , go-micro 注册中心 provider | N
**global.env.MICRO_REGISTRY_ADDRESS** | 注册中心地址 | Y
global.appVersion | XConf 版本，是默认的镜像`tag` ，可以使用`image.tag`覆盖 | N
global.serviceAccount.rbac.k8sRegistry | 使用 kubernetes 做注册中心时添加 RBAC | N
micro-api.service<br/>micro-api.ingress | **服务暴露方案**：<br/>1.`ClusterIP` + `Ingress`<br/>2.`LoadBalancer`<br/>3.`NodePort` | N

## Generate yaml

预览 [xconf.yaml](/deployments/kubernetes/helm/xconf.yaml)

```bash
$ helm template xconf ./xconf --namespace xconf > xconf.yaml
```

## Deploy
```bash
$ helm template xconf ./xconf --namespace xconf | kubectl apply -f -
```
