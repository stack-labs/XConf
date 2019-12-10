package handler

import (
	"context"
	"fmt"

	"github.com/micro-in-cn/XConf/config-srv/broadcast"
	"github.com/micro-in-cn/XConf/config-srv/dao"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

var _ config.ConfigHandler = &Config{}

type Config struct{}

func (c *Config) UpdateConfig(ctx context.Context, req *config.UpdateConfigRequest, rsp *config.Response) error {
	return dao.GetDao().UpdateConfig(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName(), req.GetValue())
}

func (c *Config) Read(ctx context.Context, req *config.QueryConfigRequest, rsp *config.ConfigResponse) error {
	value, err := dao.GetDao().ReadConfig(req.GetAppName(), req.GetClusterName(), req.GetNamespaceName())
	if err != nil {
		return err
	}

	rsp.Id = int64(value.ID)
	rsp.CreatedAt = value.CreatedAt.Unix()
	rsp.UpdatedAt = value.UpdatedAt.Unix()
	rsp.AppName = value.AppName
	rsp.ClusterName = value.ClusterName
	rsp.NamespaceName = value.NamespaceName
	rsp.Format = value.Format
	rsp.Value = value.Value
	return nil
}

func (c *Config) Watch(ctx context.Context, req *config.Request, stream config.Config_WatchStream) error {
	watcher := broadcast.GetBroadcast().Watch()
	defer func() {
		_ = watcher.Stop()
	}()

	for {
		namespace, err := watcher.Next()
		if err != nil {
			err = fmt.Errorf("[Watch] watcher next error : %s", err.Error())
			log.Error(err)
			return err
		}

		err = stream.Send(namespace)
		if err != nil {
			err = fmt.Errorf("[Watch] stream send error : %s", err.Error())
			log.Error(err)
			return err
		}
	}
}
