package handler

import (
	"context"
	"errors"
	"time"

	"github.com/Allenxuxu/XConf/config-srv/dao"
	"github.com/Allenxuxu/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

var _ config.ConfigHandler = &Config{}

type Config struct{}

func (c *Config) CreateApp(ctx context.Context, req *config.App, rsp *config.App) error {
	app, err := dao.GetDao().CreateApp(req.GetAppName(), req.GetDescription())
	if err != nil {
		log.Error("[CreateApp]", err)
		return err
	}

	rsp.Id = int64(app.ID)
	rsp.CreatedAt = app.CreatedAt.Unix()
	rsp.UpdatedAt = app.UpdatedAt.Unix()
	rsp.AppName = app.AppName
	rsp.Description = app.Description
	return nil
}

func (c *Config) DeleteApp(ctx context.Context, req *config.App, rsp *config.Response) (err error) {
	err = dao.GetDao().DeleteApp(req.GetAppName())
	if err != nil {
		log.Error("[CreateApp]", err)
	}
	return
}

func (c *Config) ListApps(ctx context.Context, req *config.Request, rsp *config.Apps) error {
	apps, err := dao.GetDao().ListApps()
	if err != nil {
		log.Error("[ListApps]", err)
		return err
	}

	for _, v := range apps {
		rsp.Apps = append(rsp.Apps, &config.App{
			Id:          int64(v.ID),
			CreatedAt:   v.CreatedAt.Unix(),
			UpdatedAt:   v.UpdatedAt.Unix(),
			AppName:     v.AppName,
			Description: v.Description,
		})
	}
	return nil
}

func (c *Config) CreateCluster(ctx context.Context, req *config.Cluster, rsp *config.Cluster) error {
	cluster, err := dao.GetDao().CreateCluster(req.GetAppName(), req.GetClusterName(), req.GetDescription())
	if err != nil {
		log.Error("[CreateCluster]", err)
		return err
	}

	rsp.Id = int64(cluster.ID)
	rsp.CreatedAt = cluster.CreatedAt.Unix()
	rsp.UpdatedAt = cluster.UpdatedAt.Unix()
	rsp.AppName = cluster.AppName
	rsp.ClusterName = cluster.ClusterName
	return nil
}

func (c *Config) DeleteCluster(ctx context.Context, req *config.Cluster, rsp *config.Response) (err error) {
	err = dao.GetDao().DeleteCluster(req.GetAppName(), req.GetClusterName())
	if err != nil {
		log.Error("[CreateApp]", err)
	}
	return
}

func (c *Config) ListClusters(ctx context.Context, req *config.App, rsp *config.Clusters) error {
	clusters, err := dao.GetDao().ListClusters(req.GetAppName())
	if err != nil {
		log.Error("[ListClusters]", err)
		return err
	}

	for _, v := range clusters {
		rsp.Clusters = append(rsp.Clusters, &config.Cluster{
			Id:          int64(v.ID),
			CreatedAt:   v.CreatedAt.Unix(),
			UpdatedAt:   v.UpdatedAt.Unix(),
			AppName:     v.AppName,
			ClusterName: v.ClusterName,
			Description: v.Description,
		})
	}
	return nil
}

func (c *Config) CreateNamespace(ctx context.Context, req *config.Namespace, rsp *config.Namespace) error {
	namespace, err := dao.GetDao().CreateNamespace(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName(), req.GetDescription())
	if err != nil {
		log.Error("[CreateNamespace]", err)
		return err
	}

	rsp.Id = int64(namespace.ID)
	rsp.CreatedAt = namespace.CreatedAt.Unix()
	rsp.UpdatedAt = namespace.UpdatedAt.Unix()
	rsp.AppName = namespace.AppName
	rsp.ClusterName = namespace.ClusterName
	rsp.NamespaceName = namespace.NamespaceName
	return nil
}

func (c *Config) DeleteNamespace(ctx context.Context, req *config.Namespace, rsp *config.Response) (err error) {
	err = dao.GetDao().DeleteNamespace(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName())
	if err != nil {
		log.Error("[CreateApp]", err)
	}
	return
}

func (c *Config) ListNamespaces(ctx context.Context, req *config.Cluster, rsp *config.Namespaces) error {
	namespaces, err := dao.GetDao().ListNamespaces(req.GetAppName(), req.GetClusterName())
	if err != nil {
		log.Error("[ListNamespaces]", err)
		return err
	}

	for _, v := range namespaces {
		rsp.Namespaces = append(rsp.Namespaces, &config.Namespace{
			Id:            int64(v.ID),
			CreatedAt:     v.CreatedAt.Unix(),
			UpdatedAt:     v.UpdatedAt.Unix(),
			AppName:       v.AppName,
			ClusterName:   v.ClusterName,
			NamespaceName: v.NamespaceName,
			Description:   v.Description,
		})
	}
	return nil
}

func (c *Config) UpdateConfig(ctx context.Context, req *config.Namespace, rsp *config.Response) error {
	return dao.GetDao().UpdateConfig(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName(), req.GetValue())
}

func (c *Config) Read(ctx context.Context, req *config.Namespaces, rsp *config.Namespaces) error {
	namespaces := req.GetNamespaces()
	if len(namespaces) == 0 {
		return errors.New("[Read] namespaces len is 0")
	}

	for _, v := range namespaces {
		value, err := dao.GetDao().ReadConfig(v.AppName, v.ClusterName, v.NamespaceName)
		if err != nil {
			return err
		}

		rsp.Namespaces = append(rsp.Namespaces, &config.Namespace{
			Id:            int64(value.ID),
			CreatedAt:     value.CreatedAt.Unix(),
			UpdatedAt:     value.UpdatedAt.Unix(),
			AppName:       value.AppName,
			ClusterName:   value.ClusterName,
			NamespaceName: value.NamespaceName,
			Value:         value.Value,
			Description:   value.Description,
		})
	}
	return nil
}

func (c *Config) Watch(ctx context.Context, req *config.Request, stream config.Config_WatchStream) error {

	for i := 0; i < 5; i++ {
		time.Sleep(time.Second * 5)
		var namespaces config.Namespaces
		namespaces.Namespaces = append(namespaces.Namespaces, &config.Namespace{
			Id: 1,
		})
		err := stream.Send(&namespaces)
		if err != nil {
			return err
		}
	}

	return errors.New("hhhh")
}
