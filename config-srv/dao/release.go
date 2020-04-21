package dao

import (
	"errors"
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/micro-in-cn/XConf/config-srv/model"
)

const (
	_Release  = "release"
	_Rollback = "rollback"
)

func (d *Dao) ReleaseConfig(appName, clusterName, namespaceName, tag, comment string) error {
	releaseConfig, err := d.ReadConfig(appName, clusterName, namespaceName)
	if err != nil {
		return err
	}

	return d.client.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("release").Create(&model.Release{
			AppName:       releaseConfig.AppName,
			ClusterName:   releaseConfig.ClusterName,
			NamespaceName: releaseConfig.NamespaceName,
			Tag:           tag,
			Value:         releaseConfig.EditValue,
			Comment:       comment,
			Type:          _Release,
		}).Error; err != nil {
			return err
		}

		if err := tx.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
			appName, clusterName, namespaceName).Updates(map[string]interface{}{
			"released": true,
			"value":    releaseConfig.EditValue,
		}).Error; err != nil {
			return err
		}

		if err := broadcastNewestConfig(tx, appName, clusterName, namespaceName); err != nil {
			return err
		}

		return nil
	})
}

func (d *Dao) Rollback(appName, clusterName, namespaceName, tag string) error {
	var release model.Release
	err := d.client.Table("release").First(&release, "app_name = ? and cluster_name = ? and namespace_name = ? and tag = ?",
		appName, clusterName, namespaceName, tag).Error
	if err != nil {
		return err
	}
	if release.Type == _Rollback {
		return errors.New("unable to rollback this tag: " + release.Tag)
	}

	return d.client.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
			appName, clusterName, namespaceName).Updates(map[string]interface{}{
			"value":      release.Value,
			"released":   true,
			"edit_value": release.Value,
		}).Error; err != nil {
			return err
		}

		if err := tx.Table("release").Create(&model.Release{
			AppName:       release.AppName,
			ClusterName:   release.ClusterName,
			NamespaceName: release.NamespaceName,
			Tag:           fmt.Sprintf("%s-rollback-%s", tag, time.Now().Format("2006/01/02/15:04:05")),
			Value:         release.Value,
			Comment:       "",
			Type:          _Rollback,
		}).Error; err != nil {
			return err
		}

		if err = broadcastNewestConfig(tx, appName, clusterName, namespaceName); err != nil {
			return err
		}

		return nil
	})
}

func (d *Dao) ListReleaseHistory(appName, clusterName, namespaceName string) (releaseHistory []*model.Release, err error) {
	err = d.client.Table("release").Find(&releaseHistory, "app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Error
	return
}
