package handler

import (
	"context"

	"github.com/Allenxuxu/XConf/config-srv/dao"
	"github.com/Allenxuxu/XConf/proto/config"
)

var _ config.ConfigHandler = &Config{}

type Config struct {
	dao *dao.Dao
}

func New(dao *dao.Dao) *Config {
	return &Config{
		dao: dao,
	}
}

func (c *Config) CreateApp(ctx context.Context, req *config.App, rsp *config.App) error {
	return nil
}

func (c *Config) DeleteApp(ctx context.Context, req *config.App, rsp *config.Response) error {
	return nil
}

func (c *Config) ListApps(ctx context.Context, req *config.Request, rsp *config.Apps) error {
	return nil
}

func (c *Config) CreateCluster(ctx context.Context, req *config.Cluster, rsp *config.Cluster) error {
	return nil
}

func (c *Config) DeleteCluster(ctx context.Context, req *config.Cluster, rsp *config.Response) error {
	return nil
}

func (c *Config) ListClusters(ctx context.Context, req *config.Request, rsp *config.Clusters) error {
	return nil
}

func (c *Config) CreateNamespace(ctx context.Context, req *config.Namespace, rsp *config.Namespace) error {
	return nil
}

func (c *Config) DeleteNamespace(ctx context.Context, req *config.Namespace, rsp *config.Response) error {
	return nil
}

func (c *Config) ListNamespaces(ctx context.Context, req *config.Request, rsp *config.Namespaces) error {
	return nil
}

func (c *Config) UpdateConfig(ctx context.Context, req *config.ConfigValue, rsp *config.Response) error {
	return nil
}
