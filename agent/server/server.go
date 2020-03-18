package server

import (
	"github.com/micro-in-cn/XConf/agent/file"
	"github.com/micro-in-cn/XConf/agent/source"
	"github.com/micro/go-micro/util/log"
)

type Server struct {
	file   file.ConfigFile
	source source.Source
}

func New(file file.ConfigFile, source source.Source) *Server {
	return &Server{
		file:   file,
		source: source,
	}
}

func (s *Server) Run() error {
	b, err := s.source.Read()
	if err != nil {
		return err
	}

	log.Info("read:\n", string(b))
	if err := s.file.Update(b); err != nil {
		return err
	}

	w, err := s.source.Watch()
	if err != nil {
		return err
	}

	for {
		nb, err := w.Next()
		if err != nil {
			return err
		}

		log.Info("watch:\n", string(nb))
		if err := s.file.Update(nb); err != nil {
			return err
		}
	}
}
