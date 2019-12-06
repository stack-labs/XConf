package handler

import (
	"net/http"
	"time"

	"github.com/Allenxuxu/XConf/agent-api/config"
	"github.com/gin-gonic/gin"
)

type Request struct {
	AppName       string `form:"appName"        binding:"required"`
	ClusterName   string `form:"clusterName"    binding:"required"`
	NamespaceName string `form:"namespaceName"  binding:"required"`
}

type ErrorResponse struct {
	Error string
}

func ReadConfig(c *gin.Context) {
	var req Request
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
	var req Request
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	// TODO 先读缓存，比较时间戳？？
	w := config.Watch()
	time.AfterFunc(time.Second*60, func() {
		w.Stop()
	})

	value, err := w.Next()
	if err != nil {
		c.JSON(http.StatusNotModified, nil)
		return
	}

	// TODO 幂等？
	c.JSON(http.StatusOK, value)
}
