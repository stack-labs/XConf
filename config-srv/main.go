package main

import (
	"errors"

	_ "github.com/go-sql-driver/mysql"
	"github.com/micro-in-cn/XConf/config-srv/broadcast"
	"github.com/micro-in-cn/XConf/config-srv/broadcast/broker"
	"github.com/micro-in-cn/XConf/config-srv/broadcast/database"
	"github.com/micro-in-cn/XConf/config-srv/conf"
	"github.com/micro-in-cn/XConf/config-srv/dao"
	"github.com/micro-in-cn/XConf/config-srv/handler"
	protoConfig "github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/cli"
	"github.com/micro/go-micro"
	"github.com/micro/go-micro/util/log"
)

var config conf.Config

func main() {
	log.Name("XConf")

	service := micro.NewService(
		micro.Name("go.micro.srv.config"),
		micro.Flags(
			cli.StringFlag{
				Name:   "database_driver",
				Usage:  "database driver",
				EnvVar: "DATABASE_DRIVER",
				Value:  "mysql",
			},
			cli.StringFlag{
				Name:   "database_url",
				Usage:  "database url",
				EnvVar: "DATABASE_URL",
				Value:  "root:12345@(127.0.0.1:3306)/xconf?charset=utf8&parseTime=true&loc=Local",
			},
			cli.StringFlag{
				Name:   "broadcast",
				Usage:  "broadcast (db/broker)",
				EnvVar: "BROADCAST",
				Value:  "db",
			}),
	)
	service.Init(
		micro.Action(func(c *cli.Context) {
			config.DB.DriverName = c.String("database_driver")
			config.DB.URL = c.String("database_url")
			config.BroadcastType = c.String("broadcast")
			log.Infof("database_driver: %s , database_url: %s\n", config.DB.DriverName, config.DB.URL)
		}),
		micro.BeforeStart(func() (err error) {
			if err = dao.Init(&config); err != nil {
				return
			}
			if err = dao.GetDao().Ping(); err != nil {
				return
			}

			var bc broadcast.Broadcast
			switch config.BroadcastType {
			case "db":
				bc, err = database.New()
				if err != nil {
					return err
				}
			case "broker":
				bc, err = broker.New(service)
				if err != nil {
					return err
				}
			default:
				return errors.New("broadcast： Invalid option")
			}
			broadcast.Init(bc)
			return
		}),
		micro.BeforeStop(func() error {
			return dao.GetDao().Disconnect()
		}),
	)

	if err := protoConfig.RegisterConfigHandler(service.Server(), new(handler.Config)); err != nil {
		panic(err)
	}

	if err := service.Run(); err != nil {
		panic(err)
	}
}
