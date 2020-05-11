package main

import (
	"errors"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/micro-in-cn/XConf/agent/server"
	"github.com/micro/cli"
	"github.com/micro/go-micro/util/log"
)

func main() {
	var (
		baseURL     string
		appName     string
		clusterName string
		dir         string
		interval    int
	)

	app := cli.NewApp()
	app.Name = "agent"
	app.Usage = "XConf agent client"
	app.Version = "0.0.1"

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:        "url, u",
			Value:       "127.0.0.1:8080",
			Usage:       "base url",
			EnvVar:      "XCONF_BASE_URL",
			Destination: &baseURL,
		},
		cli.StringFlag{
			Name:        "app, a",
			Value:       "",
			Usage:       "app name",
			EnvVar:      "XCONF_APP_NAME",
			Destination: &appName,
		},
		cli.StringFlag{
			Name:        "cluster, c",
			Value:       "",
			Usage:       "cluster name",
			EnvVar:      "XCONF_CLUSTER_NAME",
			Destination: &clusterName,
		},
		cli.StringFlag{
			Name:        "dir, d",
			Value:       "/tmp",
			Usage:       "directory",
			EnvVar:      "XCONF_DIR",
			Destination: &dir,
		},
		cli.IntFlag{
			Name:        "interval, i",
			Usage:       "auto reload time interval",
			EnvVar:      "XCONF_INTERVAL",
			Value:       5,
			Destination: &interval,
		},
	}

	app.Action = func(c *cli.Context) error {
		if len(baseURL) <= 0 {
			return errors.New("base url cannot be empty")
		}
		if len(appName) <= 0 {
			return errors.New("app name cannot be empty")
		}
		if len(clusterName) <= 0 {
			return errors.New("cluster name cannot be empty")
		}
		if len(dir) <= 0 {
			return errors.New("dir path cannot be empty")
		}
		return nil
	}

	if err := app.Run(os.Args); err != nil {
		log.Error(err)
		return
	}

	s := server.New(dir, baseURL, appName, clusterName)
	if err := s.Init(); err != nil {
		log.Error(err)
		return
	}

	//fmt.Println(s.Dir(), s.HostURL(), s.AppName(), s.ClusterName())

	// 监听退出信号
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGTERM, syscall.SIGINT, syscall.SIGQUIT)

	go func() {
		if interval <= 0 {
			interval = 5
		}
		log.Infof("auto reload (interval time: %ds)\n", interval)
		for {
			select {
			case <-shutdown:
				log.Info("reload exit")
				s.Stop()
				return
			default:
				time.Sleep(time.Second * time.Duration(interval))
				if err := s.Reload(); err != nil {
					log.Infof("reload err : %s", err)
				}
			}
		}
	}()

	s.Run()
	log.Info("agent exit")
}
