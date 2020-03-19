package config

import (
	"context"

	"github.com/micro-in-cn/XConf/proto/config"
)

var configServiceClient config.ConfigService

func Init(client config.ConfigService) {
	configServiceClient = client
}

func CreateApp(appName, description string) (*config.AppResponse, error) {
	return configServiceClient.CreateApp(context.Background(), &config.AppRequest{
		AppName:     appName,
		Description: description,
	})
}

func QueryApp(appName string) (*config.AppResponse, error) {
	return configServiceClient.QueryApp(context.Background(), &config.AppRequest{
		AppName: appName,
	})
}

func DeleteApp(appName string) error {
	_, err := configServiceClient.DeleteApp(context.Background(), &config.AppRequest{
		AppName: appName,
	})

	return err
}

func ListApps() (*config.AppsResponse, error) {
	return configServiceClient.ListApps(context.Background(), &config.Request{})
}

func CreateCluster(appName, clusterName, description string) (*config.ClusterResponse, error) {
	return configServiceClient.CreateCluster(context.Background(), &config.ClusterRequest{
		AppName:     appName,
		ClusterName: clusterName,
		Description: description,
	})
}

func QueryCluster(appName, clusterName string) (*config.ClusterResponse, error) {
	return configServiceClient.QueryCluster(context.Background(), &config.ClusterRequest{
		AppName:     appName,
		ClusterName: clusterName,
	})
}

func DeleteCluster(appName, clusterName string) error {
	_, err := configServiceClient.DeleteCluster(context.Background(), &config.ClusterRequest{
		AppName:     appName,
		ClusterName: clusterName,
	})
	return err
}

func ListClusters(appName string) (*config.ClustersResponse, error) {
	return configServiceClient.ListClusters(context.Background(), &config.AppRequest{
		AppName: appName,
	})
}

func CreateNamespace(appName, clusterName, namespaceName, format, description string) (*config.NamespaceResponse, error) {
	return configServiceClient.CreateNamespace(context.Background(), &config.NamespaceRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Format:        format,
		Description:   description,
	})
}

func QueryNamespace(appName, clusterName, namespaceName string) (*config.NamespaceResponse, error) {
	return configServiceClient.QueryNamespace(context.Background(), &config.NamespaceRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
	})
}

func DeleteNamespace(appName, clusterName, namespaceName string) error {
	_, err := configServiceClient.DeleteNamespace(context.Background(), &config.NamespaceRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
	})
	return err
}

func ListNamespaces(appName, clusterName string) (*config.NamespacesResponse, error) {
	return configServiceClient.ListNamespaces(context.Background(), &config.ClusterRequest{
		AppName:     appName,
		ClusterName: clusterName,
	})
}

func UpdateConfig(appName, clusterName, namespaceName, value string) error {
	_, err := configServiceClient.UpdateConfig(context.Background(), &config.UpdateConfigRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Value:         value,
	})
	return err
}

func ReleaseConfig(appName, clusterName, namespaceName, tag, comment string) error {
	_, err := configServiceClient.ReleaseConfig(context.Background(), &config.ReleaseRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Tag:           tag,
		Comment:       comment,
	})

	return err
}

func ListReleaseHistory(appName, clusterName, namespaceName string) (*config.ReleaseHistoryResponse, error) {
	return configServiceClient.ListReleaseHistory(context.Background(), &config.NamespaceRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
	})
}

func Rollback(appName, clusterName, namespaceName, tag string) (err error) {
	_, err = configServiceClient.Rollback(context.Background(), &config.ReleaseRequest{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Tag:           tag,
	})
	return err
}
