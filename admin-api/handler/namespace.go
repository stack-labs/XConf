package handler

import (
	"net/http"

	"github.com/Allenxuxu/XConf/admin-api/config"
	"github.com/gin-gonic/gin"
)

func CreateNamespace(c *gin.Context) {
	var req = struct {
		AppName       string `json:"appName"        binding:"required"`
		ClusterName   string `json:"clusterName"    binding:"required"`
		NamespaceName string `json:"namespaceName"  binding:"required"`
		Description   string `json:"description"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	namespaces, err := config.CreateNamespace(req.AppName, req.ClusterName, req.NamespaceName, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, namespaces)
}

func DeleteNamespace(c *gin.Context) {
	var req = struct {
		AppName       string `json:"appName"        binding:"required"`
		ClusterName   string `json:"clusterName"    binding:"required"`
		NamespaceName string `json:"namespaceName"  binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	err := config.DeleteNamespace(req.AppName, req.ClusterName, req.NamespaceName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, nil)
}

func ListNamespaces(c *gin.Context) {
	var req = struct {
		AppName     string `form:"appName"        binding:"required"`
		ClusterName string `json:"clusterName"    binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	namespaces, err := config.ListNamespaces(req.AppName, req.ClusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, namespaces)
}
