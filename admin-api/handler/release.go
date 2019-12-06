package handler

import (
	"net/http"

	"github.com/Allenxuxu/XConf/admin-api/config"
	"github.com/gin-gonic/gin"
)

func Release(c *gin.Context) {
	var req = struct {
		AppName       string `json:"appName"        binding:"required"`
		ClusterName   string `json:"clusterName"    binding:"required"`
		NamespaceName string `json:"namespaceName"  binding:"required"`
		Comment       string `json:"comment"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	err := config.ReleaseConfig(req.AppName, req.ClusterName, req.NamespaceName, req.Comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, nil)
}
