package server

import "github.com/micro-in-cn/XConf/agent/config"

type Server struct {
	configFiles []*config.Config
}

func New() *Server {
	return &Server{}
}

func (s *Server) Init(configs ...*config.Config) error {
	for _, v := range configs {
		if err := v.Init(); err != nil {
			return err
		}
		s.configFiles = append(s.configFiles, v)
	}

	return nil
}

func (s *Server) Run() {
	for _, v := range s.configFiles {
		_ = v.Sync()
	}
}

func (s *Server) Stop() {
	for _, v := range s.configFiles {
		v.Stop()
	}
}
