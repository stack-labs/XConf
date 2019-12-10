package handler

import (
	"context"

	"github.com/micro-in-cn/XConf/config-srv/dao"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

func (c *Config) CreateNamespace(ctx context.Context, req *config.NamespaceRequest, rsp *config.NamespaceResponse) error {
	namespace, err := dao.GetDao().CreateNamespace(
		req.GetAppName(),
		req.GetClusterName(),
		req.GetNamespaceName(),
		req.GetFormat(),
		req.GetDescription())
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
	rsp.Format = namespace.Format
	rsp.Value = namespace.Value
	rsp.Released = namespace.Released
	rsp.EditValue = namespace.EditValue
	rsp.Description = namespace.Description
	return nil
}

func (c *Config) DeleteNamespace(ctx context.Context, req *config.NamespaceRequest, rsp *config.Response) (err error) {
	err = dao.GetDao().DeleteNamespace(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName())
	if err != nil {
		log.Error("[CreateApp]", err)
	}
	return
}

func (c *Config) ListNamespaces(ctx context.Context, req *config.ClusterRequest, rsp *config.NamespacesResponse) error {
	namespaces, err := dao.GetDao().ListNamespaces(req.GetAppName(), req.GetClusterName())
	if err != nil {
		log.Error("[ListNamespaces]", err)
		return err
	}

	for _, v := range namespaces {
		rsp.Namespaces = append(rsp.Namespaces, &config.NamespaceResponse{
			Id:            int64(v.ID),
			CreatedAt:     v.CreatedAt.Unix(),
			UpdatedAt:     v.UpdatedAt.Unix(),
			AppName:       v.AppName,
			ClusterName:   v.ClusterName,
			NamespaceName: v.NamespaceName,
			Format:        v.Format,
			Value:         v.Value,
			Released:      v.Released,
			EditValue:     v.EditValue,
			Description:   v.Description,
		})
	}
	return nil
}
