package handler

import (
	"context"

	"github.com/micro-in-cn/XConf/config-srv/dao"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

func (c *Config) CreateCluster(ctx context.Context, req *config.ClusterRequest, rsp *config.ClusterResponse) error {
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
	rsp.Description = cluster.Description
	return nil
}

func (c *Config) QueryCluster(ctx context.Context, req *config.ClusterRequest, rsp *config.ClusterResponse) error {
	cluster, err := dao.GetDao().QueryCluster(req.GetAppName(), req.GetClusterName())
	if err != nil {
		log.Error("[QueryCluster]", err)
		return err
	}

	rsp.Id = int64(cluster.ID)
	rsp.AppName = cluster.AppName
	rsp.ClusterName = cluster.ClusterName
	rsp.Description = cluster.Description
	rsp.CreatedAt = cluster.CreatedAt.Unix()
	rsp.UpdatedAt = cluster.UpdatedAt.Unix()
	return nil
}

func (c *Config) DeleteCluster(ctx context.Context, req *config.ClusterRequest, rsp *config.Response) (err error) {
	err = dao.GetDao().DeleteCluster(req.GetAppName(), req.GetClusterName())
	if err != nil {
		log.Error("[DeleteCluster] delete cluster:%s-%s error: %s", req.GetAppName(), req.GetClusterName(), err.Error())
	}
	return
}

func (c *Config) ListClusters(ctx context.Context, req *config.AppRequest, rsp *config.ClustersResponse) error {
	clusters, err := dao.GetDao().ListClusters(req.GetAppName())
	if err != nil {
		log.Error("[ListClusters]", err)
		return err
	}

	for _, v := range clusters {
		rsp.Clusters = append(rsp.Clusters, &config.ClusterResponse{
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
