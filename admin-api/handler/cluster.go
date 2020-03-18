package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/micro-in-cn/XConf/admin-api/config"
)

func CreateCluster(c *gin.Context) {
	var req = struct {
		AppName     string `json:"appName"        binding:"required"`
		ClusterName string `json:"clusterName"    binding:"required"`
		Description string `json:"description"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	cluster, err := config.CreateCluster(req.AppName, req.ClusterName, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, cluster)
}

func QueryCluster(c *gin.Context) {
	var req = struct {
		AppName     string `form:"appName"        binding:"required"`
		ClusterName string `form:"clusterName"    binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	cluster, err := config.QueryCluster(req.AppName, req.ClusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, cluster)
}

func DeleteCluster(c *gin.Context) {
	var req = struct {
		AppName     string `json:"appName"        binding:"required"`
		ClusterName string `json:"clusterName"    binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	err := config.DeleteCluster(req.AppName, req.ClusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, nil)
}

func ListClusters(c *gin.Context) {
	var req = struct {
		AppName string `form:"appName"        binding:"required"`
	}{}
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	clusters, err := config.ListClusters(req.AppName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	if clusters.Clusters == nil {
		c.JSON(http.StatusOK, []interface{}{})
	} else {
		c.JSON(http.StatusOK, clusters.Clusters)
	}
}
