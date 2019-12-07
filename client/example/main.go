package main

import (
	"github.com/Allenxuxu/XConf/client/source"
	"github.com/micro/go-micro/config"
	"github.com/micro/go-micro/util/log"
)

type Config struct {
	Hosts struct {
		Database struct {
			Address string
			Port    int
		}
	}
}

func main() {
	c := config.NewConfig(
		config.WithSource(
			source.NewSource("app", "dev", "test", source.WithURL("http://127.0.0.1:8080"))))

	var value Config
	if err := c.Get().Scan(&value); err != nil {
		panic(err)
	}
	log.Info("read:", value)

	// Watch 返回前 micro config 会调用 Read 读一次配置
	w, err := c.Watch()
	if err != nil {
		panic(err)
	}

	for {
		// 会比较 value，内容不变不会返回
		v, err := w.Next()
		if err != nil {
			panic(err)
		}

		if err = v.Scan(&value); err != nil {
			panic(err)
		}
		log.Info(value)
	}
}
