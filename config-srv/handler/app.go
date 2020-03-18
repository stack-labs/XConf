package handler

import (
	"context"

	"github.com/micro-in-cn/XConf/config-srv/dao"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

func (c *Config) CreateApp(ctx context.Context, req *config.AppRequest, rsp *config.AppResponse) error {
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

func (c *Config) QueryApp(ctx context.Context, req *config.AppRequest, rsp *config.AppResponse) error {
	app, err := dao.GetDao().QueryApp(req.GetAppName())
	if err != nil {
		log.Error("[QueryApp]", err)
		return err
	}

	rsp.Id = int64(app.ID)
	rsp.AppName = app.AppName
	rsp.Description = app.Description
	rsp.CreatedAt = app.CreatedAt.Unix()
	rsp.UpdatedAt = app.UpdatedAt.Unix()
	return nil
}

func (c *Config) DeleteApp(ctx context.Context, req *config.AppRequest, rsp *config.Response) (err error) {
	err = dao.GetDao().DeleteApp(req.GetAppName())
	if err != nil {
		log.Error("[CreateApp]", err)
	}
	return
}

func (c *Config) ListApps(ctx context.Context, req *config.Request, rsp *config.AppsResponse) error {
	apps, err := dao.GetDao().ListApps()
	if err != nil {
		log.Error("[ListApps]", err)
		return err
	}

	for _, v := range apps {
		rsp.Apps = append(rsp.Apps, &config.AppResponse{
			Id:          int64(v.ID),
			CreatedAt:   v.CreatedAt.Unix(),
			UpdatedAt:   v.UpdatedAt.Unix(),
			AppName:     v.AppName,
			Description: v.Description,
		})
	}
	return nil
}
