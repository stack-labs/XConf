package dao

import (
	"github.com/micro-in-cn/XConf/config-srv/model"
)

func (d *Dao) ReleaseConfig(appName, clusterName, namespaceName, value, tag, comment string, broadcast func() error) error {
	tx := d.client.Begin()

	if err := tx.Table("release").Create(&model.Release{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Tag:           tag,
		Value:         value,
		Comment:       comment,
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Updates(map[string]interface{}{
		"released": true,
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := broadcast(); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}
