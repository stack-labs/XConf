package config

import (
	"errors"
	"fmt"

	"github.com/micro-in-cn/XConf/agent/file"
	"github.com/micro-in-cn/XConf/agent/source"
	"github.com/micro/go-micro/util/log"
)

var ErrStopped = errors.New("config file stopped")

type Config struct {
	file    file.ConfigFile
	source  source.Source
	watcher source.Watcher
	exit    chan interface{}
	name    string
}

func New(filePatch string, url, appName, clusterName, namespaceName, format string) *Config {
	return &Config{
		file:   file.New(filePatch),
		source: source.New(url, appName, clusterName, namespaceName),
		exit:   make(chan interface{}),
		name:   fmt.Sprintf("host:%s app:%s cluster:%s namespace:%s.%s", url, appName, clusterName, namespaceName, format),
	}
}

func (s *Config) Init() error {
	b, err := s.source.Read()
	if err != nil {
		return err
	}

	if err := s.file.Update(b); err != nil {
		return err
	}

	s.watcher, err = s.source.Watch()
	if err != nil {
		return err
	}

	return nil
}

func (s *Config) Sync() (err error) {
	if s.watcher == nil {
		return errors.New("Init function is not called ")
	}

	log.Info("Start watch ", s.name)
	for {
		select {
		case <-s.exit:
			return ErrStopped
		default:
			nb, err := s.watcher.Next()
			if err != nil {
				if err == source.ErrWatcherStopped {
					return ErrStopped
				}

				log.Error("watch:", err)
				continue
			}

			//log.Info("watch:\n", string(nb))
			if err := s.file.Update(nb); err != nil {
				log.Error("update:", err)
				continue
			}
		}
	}
}

func (s *Config) Stop() {
	select {
	case <-s.exit:
	default:
		_ = s.watcher.Stop()
		close(s.exit)
	}
}
