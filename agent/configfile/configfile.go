package configfile

import (
	"errors"

	"github.com/micro-in-cn/XConf/agent/file"
	"github.com/micro-in-cn/XConf/agent/source"
	"github.com/micro/go-micro/util/log"
)

var ErrStopped = errors.New("config file stopped")

type ConfigFile struct {
	file    file.ConfigFile
	source  source.Source
	watcher source.Watcher
	exit    chan interface{}
}

func New(file file.ConfigFile, source source.Source) *ConfigFile {
	return &ConfigFile{
		file:   file,
		source: source,
		exit:   make(chan interface{}),
	}
}

func (s *ConfigFile) Init() error {
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

func (s *ConfigFile) Sync() (err error) {
	if s.watcher == nil {
		return errors.New("Init function is not called ")
	}

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

func (s *ConfigFile) Stop() {
	select {
	case <-s.exit:
	default:
		_ = s.watcher.Stop()
		close(s.exit)
	}
}
