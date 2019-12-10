package dao

import (
	"errors"

	"github.com/micro-in-cn/XConf/config-srv/model"
)

func (d *Dao) UpdateConfig(appName, clusterName, namespaceName, value string) error {
	if !d.NamespaceExist(appName, clusterName, namespaceName) {
		return errors.New("namespace not found")
	}

	return d.client.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Updates(map[string]interface{}{
		"edit_value": value,
		"released":   false,
	}).Error
}

func (d *Dao) ReadConfig(appName, clusterName, namespaceName string) (*model.Namespace, error) {
	var namespace model.Namespace
	err := d.client.Table("namespace").First(&namespace, "app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Error
	return &namespace, err
}
