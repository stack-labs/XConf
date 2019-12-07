package dao

import (
	"errors"
	"fmt"

	"github.com/Allenxuxu/XConf/config-srv/model"
)

func (d *Dao) NamespaceExist(appName, clusterName, namespaceName string) bool {
	return !d.client.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).First(&model.Namespace{}).RecordNotFound()
}

func (d *Dao) CreateNamespace(appName, clusterName, namespaceName, format, description string) (*model.Namespace, error) {
	if !d.ClusterExist(appName, clusterName) {
		return nil, errors.New("cluster not found")
	}

	namespace := &model.Namespace{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Format:        format,
		Description:   description,
	}
	err := d.client.Table("namespace").Create(namespace).Error

	return namespace, err
}

func (d *Dao) DeleteNamespace(appName, clusterName, namespaceName string) error {
	var err error
	tx := d.client.Begin()
	defer func() {
		if err != nil {
			err = errors.New(fmt.Sprintf("[DeleteNamespace] delete namespace:%s-%s-%s error: %s", appName, clusterName, namespaceName, err.Error()))
			tx.Rollback()
		}
	}()

	if err = tx.Table("namespace").Delete(model.Namespace{}, "app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Error; err != nil {
		return err
	}

	tx.Commit()
	return nil
}

func (d *Dao) ListNamespaces(appName, clusterName string) (namespaces []*model.Namespace, err error) {
	err = d.client.Table("namespace").Find(&namespaces, "app_name = ? and cluster_name = ?", appName, clusterName).Error
	return
}

func (d *Dao) UpdateConfig(appName, clusterName, namespaceName, value string) error {
	if !d.NamespaceExist(appName, clusterName, namespaceName) {
		return errors.New("namespace not found")
	}

	return d.client.Table("namespace").Where("app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Update("value", value).Error
}

func (d *Dao) ReadConfig(appName, clusterName, namespaceName string) (*model.Namespace, error) {
	var namespace model.Namespace
	err := d.client.Table("namespace").First(&namespace, "app_name = ? and cluster_name = ? and namespace_name = ?",
		appName, clusterName, namespaceName).Error
	return &namespace, err
}
