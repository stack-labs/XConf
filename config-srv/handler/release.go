package handler

import (
	"context"

	"github.com/micro-in-cn/XConf/config-srv/dao"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

func (c *Config) ReleaseConfig(ctx context.Context, req *config.ReleaseRequest, rsp *config.Response) (err error) {
	err = dao.GetDao().ReleaseConfig(
		req.GetAppName(),
		req.GetClusterName(),
		req.GetNamespaceName(),
		req.GetTag(),
		req.GetComment())
	if err != nil {
		log.Error("[ReleaseConfig]", err)
	}

	return
}

func (c *Config) Rollback(ctx context.Context, req *config.ReleaseRequest, rsp *config.Response) (err error) {
	err = dao.GetDao().Rollback(
		req.GetAppName(),
		req.GetClusterName(),
		req.GetNamespaceName(),
		req.GetTag())
	if err != nil {
		log.Error("[Rollback]", err)
	}

	return
}

func (c *Config) ListReleaseHistory(ctx context.Context, req *config.NamespaceRequest, rsp *config.ReleaseHistoryResponse) error {
	history, err := dao.GetDao().ListReleaseHistory(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName())
	if err != nil {
		log.Error("[ListReleaseHistory]", err)
		return err
	}

	for _, release := range history {
		rsp.ReleaseHistory = append(rsp.ReleaseHistory, &config.ReleaseResponse{
			Id:            int64(release.ID),
			CreatedAt:     release.CreatedAt.Unix(),
			UpdatedAt:     release.UpdatedAt.Unix(),
			AppName:       release.AppName,
			ClusterName:   release.ClusterName,
			NamespaceName: release.NamespaceName,
			Tag:           release.Tag,
			Value:         release.Value,
			Comment:       release.Comment,
			Type:          release.Type,
		})
	}
	return nil
}
