package cache

import "github.com/Allenxuxu/XConf/proto/config"

type Cache interface {
	Set(config *config.Namespace) error
	Get(config *config.Namespace) (v *config.Namespace, ok bool)
	Clear()
}

func New(cacheSize int) Cache {
	return newFreeCache(cacheSize)
}
