package server

import (
	"crypto/md5"
	"errors"
	"fmt"
	"net/http"

	"gopkg.in/resty.v1"
)

type Namespace struct {
	ID            int    `json:"id"`
	CreatedAt     int    `json:"createdAt"`
	UpdatedAt     int    `json:"updatedAt"`
	AppName       string `json:"appName"`
	ClusterName   string `json:"clusterName"`
	NamespaceName string `json:"namespaceName"`
	Format        string `json:"format"`
	Value         string `json:"value"`
	Released      bool   `json:"released"`
	EditValue     string `json:"editValue"`
	Description   string `json:"description"`
}

func getNamespaces(host, appName, clusterName string) ([]Namespace, []byte, error) {
	var ret []Namespace
	client := resty.New()
	resp, err := client.R().
		SetResult(&ret).
		Get(fmt.Sprintf("%s/admin/api/v1/namespaces?appName=%s&clusterName=%s", host, appName, clusterName))
	if err != nil {
		return nil, nil, err
	}
	if resp.StatusCode() != http.StatusOK {
		return nil, nil, errors.New(resp.String())
	}

	return ret, resp.Body(), nil
}

func sum(data []byte) string {
	h := md5.New()
	_, _ = h.Write(data)
	return fmt.Sprintf("%x", h.Sum(nil))
}
