# Kubernets User Guide
- [Kubernets User Guide](#Kubernets-User-Guide)
  - [0. Prerequest](#0-Prerequest)
  - [1. Deployment](#1-Deployment)
    - [Create a namespace](#Create-a-namespace)
    - [Edit config files](#Edit-config-files)
    - [Create Kubernets resources](#Create-Kubernets-resources)
    - [Access Admin UI](#Access-Admin-UI)
  - [3. Remove](#3-Remove)
## 0. Prerequest
- A running Kubernets cluster.
- `kubectl` toolset which is connected to the cluster.
- Change current directory to `deployments/kubernetes`
## 1. Deployment
Deploy the Xconf to your Kubernets cluster from zero.

### Create a namespace
Create a namespace in the cluster to manage all the resources of Xconf. Edit `namespace.yaml` if you need.

```kubectl create namespace.yaml```

### Edit config files
- [ALL Files] Replace `$MICRO_REGISTRY_ADDRESS` to your cluser etcd address or your own etcd service address.
- [ALL Files] Check the version of image, change if you want.
- [config-srv.yaml] Replace `$DATABASE_URL` to your own MySQL database url.
- Change other fields if you know what you are doing.

### Create Kubernets resources
```
kubectl create -f micro.yaml
kubectl create -f config-srv.yaml
kubectl create -f agent-api.yaml
kubectl create -f admin-api.yaml
```
### Access Admin UI
By default the micro-api will be exposed by LoadBalancer, check service `micro` under namespace `xconf` for detail.

`kubectl describe --namespace xconf service micro`

You will find the Ingress address and the port.

Use url `http://addr:port/admin/ui/` to access the admin UI.

## 2. Update
Update the Kubernets configuration if resources have already existed.

Modify the config file corresponding to you needs.

Apply the update: 

```kubectl apply -f FILENAME```

## 3. Remove
You can remove all the deployments by deleting the whole namespace.

```kubectl delete namespace xconf```
