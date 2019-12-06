package cache_test

import (
	"testing"

	"github.com/Allenxuxu/XConf/agent-api/config/cache"
	"github.com/Allenxuxu/XConf/proto/config"
)

func TestFreeCache(t *testing.T) {
	c := cache.New(1024 * 1024)

	err := c.Set(&config.Namespace{
		Id:            1,
		CreatedAt:     2,
		UpdatedAt:     3,
		AppName:       "app",
		ClusterName:   "cluster",
		NamespaceName: "namespace",
		Value:         "value",
		Description:   "desc",
	})
	if err != nil {
		t.Fatal(err)
	}

	value, ok := c.Get(&config.Namespace{
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
		value.Value != "value" ||
		value.Description != "desc" {
		t.Fatal()
	}

	c.Clear()

	_, ok = c.Get(&config.Namespace{
		AppName:       "app",
		ClusterName:   "cluster",
		NamespaceName: "namespace",
	})
	if ok {
		t.Fatal()
	}
}
