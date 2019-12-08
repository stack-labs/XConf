package cache

import (
	"encoding/json"
	"fmt"
	"runtime/debug"

	"github.com/Allenxuxu/toolkit/convert"
	"github.com/coocood/freecache"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro/util/log"
)

var _ Cache = &freeCache{}

type freeCache struct {
	cache *freecache.Cache
}

func newFreeCache(size int) *freeCache {
	c := &freeCache{
		cache: freecache.NewCache(size),
	}
	debug.SetGCPercent(10)

	return c
}

func (f *freeCache) Set(c *config.Namespace) error {
	value, err := json.Marshal(c)
	if err != nil {
		return err
	}
	return f.cache.Set(getKey(c), value, -1)
}

func (f *freeCache) Get(c *config.Namespace) (*config.Namespace, bool) {
	v, err := f.cache.Get(getKey(c))
	if err != nil {
		return nil, false
	}

	var value config.Namespace
	err = json.Unmarshal(v, &value)
	if err != nil {
		log.Error("json unmarshal err")
		return nil, false
	}
	return &value, true
}
func (f *freeCache) Clear() {
	f.cache.Clear()
}

func getKey(config *config.Namespace) []byte {
	return convert.StringToBytes(fmt.Sprintf("%s/%s/%s", config.AppName, config.ClusterName, config.NamespaceName))
}
