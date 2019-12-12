package dao

import (
	"github.com/micro-in-cn/XConf/config-srv/model"
)

func (d *Dao) ReleaseConfig(appName, clusterName, namespaceName, tag, comment string) error {
	releaseConfig, err := d.ReadConfig(appName, clusterName, namespaceName)
	if err != nil {
		return err
	}

	tx := d.client.Begin()

	if err := tx.Table("release").Create(&model.Release{
		AppName:       releaseConfig.AppName,
		ClusterName:   releaseConfig.ClusterName,
		NamespaceName: releaseConfig.NamespaceName,
		Tag:           tag,
		Value:         releaseConfig.EditValue,
		Comment:       comment,
		Type:          "release",
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Updates(map[string]interface{}{
		"released": true,
		"value":    releaseConfig.EditValue,
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := broadcastNewestConfig(tx, appName, clusterName, namespaceName); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func (d *Dao) Rollback(appName, clusterName, namespaceName, tag string) error {
	var release model.Release
	err := d.client.Table("release").First(&release, "app_name = ? and cluster_name = ? and namespace_name = ? and tag = ?",
		appName, clusterName, namespaceName, tag).Error
	if err != nil {
		return err
	}

	tx := d.client.Begin()

	if err := tx.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Updates(map[string]interface{}{
		"value":      release.Value,
		"released":   true,
		"edit_value": release.Value,
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Table("release").Create(&model.Release{
		AppName:       release.AppName,
		ClusterName:   release.ClusterName,
		NamespaceName: release.NamespaceName,
		Tag:           tag + "-rollback",
		Value:         release.Value,
		Comment:       "",
		Type:          "rollback",
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err = broadcastNewestConfig(tx, appName, clusterName, namespaceName); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func (d *Dao) ListReleaseHistory(appName, clusterName, namespaceName string) (releaseHistory []*model.Release, err error) {
	err = d.client.Table("release").Find(&releaseHistory, "app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Error
	return
}
