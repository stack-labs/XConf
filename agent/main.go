package main

import (
	"errors"
	"fmt"
	"os"

	"github.com/micro-in-cn/XConf/agent/server"
	"github.com/micro/cli"
)

func main() {
	var (
		baseURL     string
		appName     string
		clusterName string
		dir         string
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
		fmt.Println(err)
		return
	}

	s := server.New(dir, baseURL, appName, clusterName)
	if err := s.Init(); err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(s.Dir(), s.HostURL(), s.AppName(), s.ClusterName())
	s.Run()
}
