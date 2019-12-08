package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/micro-in-cn/XConf/agent-api/config"
	"github.com/micro/go-micro/util/log"
)

type ErrorResponse struct {
	Error string
}

func ReadConfig(c *gin.Context) {
	var req = struct {
		AppName       string `form:"appName"        binding:"required"`
		ClusterName   string `form:"clusterName"    binding:"required"`
		NamespaceName string `form:"namespaceName"  binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	value, err := config.ReadConfig(req.AppName, req.ClusterName, req.NamespaceName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, value)
}

func WatchUpdate(c *gin.Context) {
	var req = struct {
		AppName       string `form:"appName"        binding:"required"`
		ClusterName   string `form:"clusterName"    binding:"required"`
		NamespaceName string `form:"namespaceName"  binding:"required"`
		UpdatedAt     int64  `form:"updatedAt"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	w := config.Watch(req.AppName, req.ClusterName, req.NamespaceName)
	time.AfterFunc(time.Second*60, func() {
		_ = w.Stop()
	})
	if req.UpdatedAt > 0 {
		value, err := config.ReadConfig(req.AppName, req.ClusterName, req.NamespaceName)
		if err != nil {
			log.Errorf(err.Error())
		} else {
			if value.UpdatedAt > req.UpdatedAt {
				c.JSON(http.StatusOK, value)
				return
			}
		}
	}

	value, err := w.Next()
	if err != nil {
		c.JSON(http.StatusNotModified, nil)
		return
	}

	// TODO 幂等？
	c.JSON(http.StatusOK, value)
}
