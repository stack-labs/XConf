package cache

import "github.com/micro-in-cn/XConf/proto/config"

type Cache interface {
	Set(config *config.ConfigResponse) error
	Get(config *config.QueryConfigRequest) (v *config.ConfigResponse, ok bool)
	Clear()
}

func New(cacheSize int) Cache {
	return newFreeCache(cacheSize)
}
