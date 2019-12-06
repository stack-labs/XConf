package config

import (
	"container/list"
	"context"
	"sync"

	"github.com/Allenxuxu/XConf/agent-api/config/cache"
	"github.com/Allenxuxu/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

type Config struct {
	sync.RWMutex
	configServiceClient config.ConfigService
	cache               cache.Cache
	watchers            *list.List
}

var defaultConfig *Config

func Init(client config.ConfigService, cacheSize int) {
	defaultConfig = newConfig(client, cacheSize)
	go defaultConfig.run()
}

func ReadConfig(appName, clusterName, namespaceName string) (*config.Namespace, error) {
	return defaultConfig.ReadConfig(appName, clusterName, namespaceName)
}

func Watch() *Watcher {
	return defaultConfig.Watch()
}

func newConfig(client config.ConfigService, cacheSize int) *Config {
	return &Config{
		configServiceClient: client,
		cache:               cache.New(cacheSize),
		watchers:            list.New(),
	}
}

func (c *Config) run() {
	for {
		c.cache.Clear()

		stream, err := c.configServiceClient.Watch(context.Background(), &config.Request{})
		if err != nil {
			log.Info("stream watch error :", err)
			continue
		}
		log.Info("config watcher reconnected")

		for {
			value, err := stream.Recv()
			if err != nil {
				log.Info("stream recv error :", err)
				break
			}

			log.Info("get release config :", value)
			c.notify(value)
			if err := c.cache.Set(value); err != nil {
				log.Error("update cache error:", err)
			}
		}

		log.Info("config watcher reconnecting")
	}
}

func (c *Config) notify(value *config.Namespace) {
	watchers := make([]*Watcher, 0, c.watchers.Len())
	c.RLock()
	for e := c.watchers.Front(); e != nil; e = e.Next() {
		watchers = append(watchers, e.Value.(*Watcher))
	}
	c.RUnlock()

	for _, w := range watchers {
		select {
		case w.updates <- value:
		default:
		}
	}
}

func (c *Config) Watch() *Watcher {
	w := &Watcher{
		exit:    make(chan interface{}),
		updates: make(chan *config.Namespace, 1),
	}

	c.Lock()
	e := c.watchers.PushBack(w)
	c.Unlock()

	go func() {
		<-w.exit
		c.Lock()
		c.watchers.Remove(e)
		c.Unlock()
	}()

	return w
}

func (c *Config) ReadConfig(appName, clusterName, namespaceName string) (*config.Namespace, error) {
	conf := &config.Namespace{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
	}

	value, ok := c.cache.Get(conf)
	if ok { // 命中缓存
		log.Info("命中缓存")
		return value, nil
	} else {
		log.Info("未能命中缓存")

		namespaces, err := c.configServiceClient.Read(context.Background(), &config.Namespaces{
			Namespaces: []*config.Namespace{conf},
		})
		if err != nil {
			return nil, err
		}

		// 更新缓存
		if err := c.cache.Set(namespaces.Namespaces[0]); err != nil {
			log.Error("update cache error:", err)
			return nil, err
		}
		return namespaces.Namespaces[0], nil
	}
}
