package cache_test

import (
	"testing"

	"github.com/micro-in-cn/XConf/agent-api/config/cache"
	"github.com/micro-in-cn/XConf/proto/config"
)

func TestFreeCache(t *testing.T) {
	c := cache.New(1024 * 1024)

	err := c.Set(&config.ConfigResponse{
		Id:            1,
		CreatedAt:     2,
		UpdatedAt:     3,
		AppName:       "app",
		ClusterName:   "cluster",
		NamespaceName: "namespace",
		Value:         "value",
	})
	if err != nil {
		t.Fatal(err)
	}

	value, ok := c.Get(&config.QueryConfigRequest{
		AppName:       "app",
		ClusterName:   "cluster",
		NamespaceName: "namespace",
	})
	if !ok {
		t.Fatal()
	}

	if value.Id != 1 ||
		value.CreatedAt != 2 ||
		value.UpdatedAt != 3 ||
		value.AppName != "app" ||
		value.ClusterName != "cluster" ||
		value.NamespaceName != "namespace" ||
		value.Value != "value" {
		t.Fatal()
	}

	c.Clear()

	_, ok = c.Get(&config.QueryConfigRequest{
		AppName:       "app",
		ClusterName:   "cluster",
		NamespaceName: "namespace",
	})
	if ok {
		t.Fatal()
	}
}
