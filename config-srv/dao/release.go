package dao

import (
	"errors"

	"github.com/Allenxuxu/XConf/config-srv/model"
)

func (d *Dao) ReleaseConfig(appName, clusterName, namespaceName, value, comment string, broadcast func() error) error {
	if !d.NamespaceExist(appName, clusterName, namespaceName) {
		return errors.New("namespace not found")
	}

	tx := d.client.Begin()

	if err := tx.Table("release").Create(&model.Release{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Value:         value,
		Comment:       comment,
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
