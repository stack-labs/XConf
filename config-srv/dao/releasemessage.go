package dao

import (
	"github.com/jinzhu/gorm"
	"github.com/micro-in-cn/XConf/config-srv/model"
)

func (d *Dao) CreateReleaseMessage(appName, clusterName, namespaceName, format, value string) error {
	return d.client.Table("release_message").Create(&model.ReleaseMessage{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Format:        format,
		Value:         value,
	}).Error
}

func (d *Dao) GetNewestMessageID() (int, error) {
	var msg model.ReleaseMessage
	err := d.client.Table("release_message").Select("id").Order("id desc").Limit(1).First(&msg).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return 0, nil
		}

		return 0, err
	}

	return int(msg.ID), nil
}

func (d *Dao) GetReleaseMessage(id int) (msgs []model.ReleaseMessage, err error) {
	err = d.client.Table("release_message").Where("id > ?", id).Find(&msgs).Error
	return
}
