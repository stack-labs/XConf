package dao

import "github.com/Allenxuxu/XConf/config-srv/model"

func (d *Dao) ReleaseConfig(appName, clusterName, namespaceName, value, comment string) error {
	return d.client.Table("release").Create(&model.Release{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Value:         value,
		Comment:       comment,
	}).Error
}
