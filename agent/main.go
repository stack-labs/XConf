package main

import (
	"errors"
	"fmt"
	"os"

	"github.com/micro-in-cn/XConf/agent/configfile"
	"github.com/micro-in-cn/XConf/agent/file"
	"github.com/micro-in-cn/XConf/agent/source"
	"github.com/micro/cli"
)

func main() {
	var (
		baseURL       string
		appName       string
		clusterName   string
		namespaceName string
		filePath      string
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
			Name:        "namespace, n",
			Value:       "",
			Usage:       "namespace name",
			EnvVar:      "XCONF_NAMESPACE_NAME",
			Destination: &namespaceName,
		},
		cli.StringFlag{
			Name:        "file, f",
			Value:       "./config.json",
			Usage:       "file path",
			EnvVar:      "XCONF_FILE",
			Destination: &filePath,
		},
	}

	app.Action = func(c *cli.Context) error {
		//fmt.Println(baseURL, appName, clusterName, namespaceName, filePath)
		if len(baseURL) <= 0 {
			return errors.New("base url cannot be empty")
		}
		if len(appName) <= 0 {
			return errors.New("app name cannot be empty")
		}
		if len(clusterName) <= 0 {
			return errors.New("cluster name cannot be empty")
		}
		if len(namespaceName) <= 0 {
			return errors.New("namespace name cannot be empty")
		}
		if len(filePath) <= 0 {
			return errors.New("file path cannot be empty")
		}
		return nil
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println(err)
		return
	}

	configFile := file.New(filePath)
	client := source.New(baseURL, appName, clusterName, namespaceName)
	s := configfile.New(configFile, client)
	if err := s.Init(); err != nil {
		panic(err)
	}
	if err := s.Sync(); err != nil {
		panic(err)
	}
}
