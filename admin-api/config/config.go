package config

import (
	"context"

	"github.com/micro-in-cn/XConf/proto/config"
)

var configServiceClient config.ConfigService

func Init(client config.ConfigService) {
	configServiceClient = client
}

func CreateApp(appName, description string) (*config.App, error) {
	return configServiceClient.CreateApp(context.Background(), &config.App{
		AppName:     appName,
		Description: description,
	})
}

func DeleteApp(appName string) error {
	_, err := configServiceClient.DeleteApp(context.Background(), &config.App{
		AppName: appName,
	})

	return err
}

func ListApps() (*config.Apps, error) {
	return configServiceClient.ListApps(context.Background(), &config.Request{})
}

func CreateCluster(appName, clusterName, description string) (*config.Cluster, error) {
	return configServiceClient.CreateCluster(context.Background(), &config.Cluster{
		AppName:     appName,
		ClusterName: clusterName,
		Description: description,
	})
}

func DeleteCluster(appName, clusterName string) error {
	_, err := configServiceClient.DeleteCluster(context.Background(), &config.Cluster{
		AppName:     appName,
		ClusterName: clusterName,
	})
	return err
}

func ListClusters(appName string) (*config.Clusters, error) {
	return configServiceClient.ListClusters(context.Background(), &config.App{
		AppName: appName,
	})
}

func CreateNamespace(appName, clusterName, namespaceName, format, description string) (*config.Namespace, error) {
	return configServiceClient.CreateNamespace(context.Background(), &config.Namespace{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Format:        format,
		Description:   description,
	})
}

func DeleteNamespace(appName, clusterName, namespaceName string) error {
	_, err := configServiceClient.DeleteNamespace(context.Background(), &config.Namespace{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
	})
	return err
}

func ListNamespaces(appName, clusterName string) (*config.Namespaces, error) {
	return configServiceClient.ListNamespaces(context.Background(), &config.Cluster{
		AppName:     appName,
		ClusterName: clusterName,
	})
}

func UpdateConfig(appName, clusterName, namespaceName, value string) error {
	_, err := configServiceClient.UpdateConfig(context.Background(), &config.Namespace{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Value:         value,
	})
	return err
}

func ReleaseConfig(appName, clusterName, namespaceName, tag, comment string) error {
	_, err := configServiceClient.ReleaseConfig(context.Background(), &config.Release{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
		Tag:           tag,
		Comment:       comment,
	})

	return err
}

func ReadConfig(appName, clusterName, namespaceName string) (*config.Namespace, error) {
	toRead := &config.Namespace{
		AppName:       appName,
		ClusterName:   clusterName,
		NamespaceName: namespaceName,
	}

	namespaces, err := configServiceClient.Read(context.Background(), &config.Namespaces{
		Namespaces: []*config.Namespace{toRead},
	})
	if err != nil {
		return nil, err
	}

	return namespaces.Namespaces[0], nil
}
