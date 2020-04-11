package server

import (
	"errors"
	"fmt"
	"path"

	"github.com/Allenxuxu/toolkit/sync"
	"github.com/micro-in-cn/XConf/agent/config"
	"github.com/micro/go-micro/util/log"
)

type Server struct {
	hostURL     string
	appName     string
	clusterName string
	basePath    string
	configFiles []*config.Config
	sw          sync.WaitGroupWrapper
}

func New(basePath string, hostURL, appName, clusterName string) *Server {
	return &Server{
		basePath:    path.Clean(basePath),
		hostURL:     hostURL,
		appName:     appName,
		clusterName: clusterName,
	}
}

func (s *Server) Init() error {
	// TODO reload 新增 namespace
	namespaces, err := getNamespaces(s.hostURL, s.appName, s.clusterName)
	if err != nil {
		return err
	}
	if len(namespaces) == 0 {
		return errors.New("empty namespace")
	}

	for _, v := range namespaces {
		c := config.New(s.filePath(v.NamespaceName, v.Format), s.hostURL, s.appName, s.clusterName, v.NamespaceName, v.Format)
		if err := c.Init(); err != nil {
			return err
		}
		s.configFiles = append(s.configFiles, c)
	}

	return nil
}

func (s *Server) Run() {
	for _, v := range s.configFiles {
		cf := v
		s.sw.AddAndRun(func() {
			if err := cf.Sync(); err != nil {
				log.Error(err)
			}
		})
	}

	s.sw.Wait()
}

func (s *Server) Stop() {
	for _, v := range s.configFiles {
		v.Stop()
	}
}

func (s *Server) HostURL() string {
	return s.hostURL
}

func (s *Server) ClusterName() string {
	return s.clusterName
}

func (s *Server) AppName() string {
	return s.appName
}

func (s *Server) Dir() string {
	return s.basePath
}

func (s *Server) filePath(namespaceName, format string) string {
	return fmt.Sprintf("%s/%s/%s/%s.%s", s.basePath, s.appName, s.clusterName, namespaceName, format)
}
