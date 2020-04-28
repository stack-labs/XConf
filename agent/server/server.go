package server

import (
	"errors"
	"fmt"
	"path"
	stdSync "sync"

	"github.com/Allenxuxu/toolkit/sync"
	"github.com/Allenxuxu/toolkit/sync/atomic"
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

	Checksum string
	running  atomic.Bool
	mu       stdSync.RWMutex
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
	namespaces, raw, err := getNamespaces(s.hostURL, s.appName, s.clusterName)
	if err != nil {
		return err
	}
	if len(namespaces) == 0 {
		return errors.New("empty namespace")
	}
	s.Checksum = sum(raw)

	configFiles := make([]*config.Config, 0, len(namespaces))
	for _, v := range namespaces {
		c := config.New(s.filePath(v.NamespaceName, v.Format), s.hostURL, s.appName, s.clusterName, v.NamespaceName, v.Format)
		if err := c.Init(); err != nil {
			return err
		}
		configFiles = append(configFiles, c)
	}

	s.mu.Lock()
	s.configFiles = configFiles
	s.mu.Unlock()

	return nil
}

func (s *Server) Run() {
	s.mu.RLock()
	for _, v := range s.configFiles {
		cf := v
		s.sw.AddAndRun(func() {
			if err := cf.Sync(); err != nil {
				log.Error(err)
			}
		})
	}
	s.mu.RUnlock()

	s.running.Set(true)
	s.sw.Wait()
}

func (s *Server) Stop() {
	s.mu.RLock()
	for _, v := range s.configFiles {
		v.Stop()
	}
	s.mu.RUnlock()

	s.running.Set(false)
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

func (s *Server) haveNamespace(name string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, v := range s.configFiles {
		if v.Name() == name {
			return true
		}
	}
	return false
}

func (s *Server) Reload() error {
	if !s.running.Get() {
		return errors.New("server stopped")
	}

	namespaces, raw, err := getNamespaces(s.hostURL, s.appName, s.clusterName)
	if err != nil {
		return err
	}
	if len(namespaces) == 0 {
		return errors.New("empty namespace")
	}
	checksum := sum(raw)
	// 没有变化
	if checksum == s.Checksum {
		return nil
	}

	configFiles := make([]*config.Config, 0, len(namespaces)-len(s.configFiles))
	for _, v := range namespaces {
		if !s.haveNamespace(v.NamespaceName) {
			c := config.New(s.filePath(v.NamespaceName, v.Format), s.hostURL, s.appName, s.clusterName, v.NamespaceName, v.Format)
			if err := c.Init(); err != nil {
				return err
			}
			configFiles = append(configFiles, c)
		}
	}

	for _, v := range configFiles {
		cf := v
		s.sw.AddAndRun(func() {
			if err := cf.Sync(); err != nil {
				log.Error(err)
			}
		})
	}

	s.mu.Lock()
	s.configFiles = append(s.configFiles, configFiles...)
	s.mu.Unlock()

	s.Checksum = checksum
	return nil
}
