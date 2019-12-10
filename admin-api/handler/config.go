package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/micro-in-cn/XConf/admin-api/config"
)

type ErrorResponse struct {
	Error string
}

func UpdateConfig(c *gin.Context) {
	var req = struct {
		AppName       string `json:"appName"        binding:"required"`
		ClusterName   string `json:"clusterName"    binding:"required"`
		NamespaceName string `json:"namespaceName"  binding:"required"`
		Value         string `json:"value"          binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	err := config.UpdateConfig(req.AppName, req.ClusterName, req.NamespaceName, req.Value)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, nil)
}
