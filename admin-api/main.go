package main

import (
	"github.com/Allenxuxu/XConf/admin-api/config"
	"github.com/Allenxuxu/XConf/admin-api/handler"
	pconfig "github.com/Allenxuxu/XConf/proto/config"
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/web"
)

func main() {
	service := web.NewService(
		web.Name("go.micro.api.admin"),
	)

	if err := service.Init(); err != nil {
		panic(err)
	}

	client := pconfig.NewConfigService("go.micro.srv.config", service.Options().Service.Client())

	config.Init(client)
	router := Router()
	service.Handle("/", router)

	if err := service.Run(); err != nil {
		panic(err)
	}
}

func Router() *gin.Engine {
	router := gin.Default()
	r := router.Group("/admin/api/v1")
	r.GET("/apps", handler.ListApps)
	r.POST("/app", handler.CreateApp)
	r.DELETE("/app", handler.DeleteApp)

	r.GET("/clusters", handler.ListClusters)
	r.POST("/cluster", handler.CreateCluster)
	r.DELETE("/cluster", handler.DeleteCluster)

	r.GET("/namespaces", handler.ListNamespaces)
	r.POST("/namespace", handler.CreateNamespace)
	r.DELETE("/namespace", handler.DeleteNamespace)

	r.GET("/config", handler.ReadConfig)
	r.POST("/config", handler.UpdateConfig)
	r.POST("/release", handler.Release)

	return router
}
