package dao

import (
	"github.com/jinzhu/gorm"

	"github.com/micro-in-cn/XConf/config-srv/model"
)

func (d *Dao) AppExist(appName string) bool {
	return !d.client.Table("app").Where("app_name = ?", appName).First(&model.App{}).RecordNotFound()
}

func (d *Dao) CreateApp(appName, description string) (*model.App, error) {
	app := &model.App{
		AppName:     appName,
		Description: description,
	}
	err := d.client.Table("app").Create(app).Error

	return app, err
}

func (d *Dao) QueryApp(appName string) (app model.App, err error) {
	err = d.client.Table("app").First(&app, "app_name = ?", appName).Error
	return
}

func (d *Dao) DeleteApp(appName string) error {
	return d.client.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("namespace").Unscoped().Delete(model.Namespace{}, "app_name = ?", appName).Error; err != nil {
			return err
		}
		if err := tx.Table("cluster").Unscoped().Delete(model.Cluster{}, "app_name = ?", appName).Error; err != nil {
			return err
		}
		if err := tx.Table("app").Unscoped().Delete(model.App{}, "app_name = ?", appName).Error; err != nil {
			return err
		}

		return nil
	})
}

func (d *Dao) ListApps() (apps []model.App, err error) {
	err = d.client.Table("app").Find(&apps).Error
	return
}
