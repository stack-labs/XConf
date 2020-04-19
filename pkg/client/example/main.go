package main

import (
	"github.com/micro-in-cn/XConf/pkg/client/source"
	"github.com/micro/go-micro/v2/config"
	"github.com/micro/go-micro/v2/util/log"
)

func main() {
	c, err := config.NewConfig(
		config.WithSource(
			source.NewSource("app", "dev", "test", source.WithURL("http://xconf.mogutou.xyz"))))
	if err != nil {
		panic(err)
	}
	log.Info("read: ", string(c.Get().Bytes()))

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

		log.Info("watch: ", string(v.Bytes()))
	}
}
