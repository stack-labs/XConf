package dao

import (
	"github.com/jinzhu/gorm"
	"github.com/micro-in-cn/XConf/config-srv/conf"
	"github.com/micro-in-cn/XConf/config-srv/model"
)

// Dao def
type Dao struct {
	client *gorm.DB
}

var defaultDao *Dao

// GetDao 返回 Dao 实例
func GetDao() *Dao {
	return defaultDao
}

// Init 初始化数据库连接
func Init(c *conf.Config) (err error) {
	defaultDao, err = newDao(c)
	return
}

// newDao 创建 Dao 实例
func newDao(c *conf.Config) (*Dao, error) {
	var (
		d   Dao
		err error
	)
	if d.client, err = gorm.Open(c.DB.DriverName, c.DB.URL); err != nil {
		return nil, err
	}
	d.client.SingularTable(true)       //表名采用单数形式
	d.client.DB().SetMaxOpenConns(100) //SetMaxOpenConns用于设置最大打开的连接数
	d.client.DB().SetMaxIdleConns(10)  //SetMaxIdleConns用于设置闲置的连接数
	//d.client.LogMode(true)

	if err = d.client.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(
		&model.App{},
		&model.Cluster{},
		&model.Namespace{},
		&model.Release{},
		&model.ReleaseMessage{},
	).Error; err != nil {
		_ = d.client.Close()
		return nil, err
	}

	return &d, nil
}

func (d *Dao) Ping() error {
	return d.client.DB().Ping()
}

func (d *Dao) Disconnect() error {
	return d.client.DB().Close()
}
