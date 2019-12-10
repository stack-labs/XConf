package dao

import (
	"github.com/jinzhu/gorm"
	"github.com/micro-in-cn/XConf/config-srv/broadcast"
	"github.com/micro-in-cn/XConf/config-srv/model"
	"github.com/micro-in-cn/XConf/proto/config"
)

func broadcastNewestConfig(tx *gorm.DB, appName, clusterName, namespaceName string) error {
	var releaseConfig model.Namespace
	err := tx.Table("namespace").First(&releaseConfig, "app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Error
	if err != nil {
		return err
	}

	return broadcast.GetBroadcast().Send(&config.ConfigResponse{
		Id:            int64(releaseConfig.ID),
		CreatedAt:     releaseConfig.CreatedAt.Unix(),
		UpdatedAt:     releaseConfig.UpdatedAt.Unix(),
		AppName:       releaseConfig.AppName,
		ClusterName:   releaseConfig.ClusterName,
		NamespaceName: releaseConfig.NamespaceName,
		Format:        releaseConfig.Format,
		Value:         releaseConfig.Value,
	})
}
