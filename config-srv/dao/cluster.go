package dao

import (
	"errors"
	"fmt"

	"github.com/micro-in-cn/XConf/config-srv/model"
)

func (d *Dao) ClusterExist(appName, clusterName string) bool {
	return !d.client.Table("cluster").Where("app_name = ? and cluster_name = ?", appName, clusterName).First(&model.Cluster{}).RecordNotFound()
}

func (d *Dao) CreateCluster(appName, clusterName, description string) (*model.Cluster, error) {
	if !d.AppExist(appName) {
		return nil, errors.New("app not found")
	}

	cluster := &model.Cluster{
		AppName:     appName,
		ClusterName: clusterName,
		Description: description,
	}
	err := d.client.Table("cluster").Create(cluster).Error

	return cluster, err
}

func (d *Dao) QueryCluster(appName, clusterName string) (cluster model.Cluster, err error) {
	err = d.client.Table("cluster").First(&cluster, "app_name = ? and cluster_name = ?", appName, clusterName).Error
	return
}

func (d *Dao) DeleteCluster(appName, clusterName string) error {
	var err error
	tx := d.client.Begin()
	defer func() {
		if err != nil {
			err = fmt.Errorf("[DeleteCluster] delete cluster:%s-%s error: %s", appName, clusterName, err.Error())
			tx.Rollback()
		}
	}()

	if err = tx.Table("namespace").Unscoped().Delete(model.Namespace{}, "app_name = ? and cluster_name = ?",
		appName, clusterName).Error; err != nil {
		return err
	}
	if err = tx.Table("cluster").Unscoped().Delete(model.Cluster{}, "app_name = ? and cluster_name = ?",
		appName, clusterName).Error; err != nil {
		return err
	}

	tx.Commit()
	return nil
}

func (d *Dao) ListClusters(appName string) (clusters []model.Cluster, err error) {
	err = d.client.Table("cluster").Find(&clusters, "app_name = ?", appName).Error
	return
}
