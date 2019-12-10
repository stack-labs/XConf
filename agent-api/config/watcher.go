package config

import (
	"errors"

	"github.com/micro-in-cn/XConf/proto/config"
)

var ErrWatcherStopped = errors.New("watcher stopped")

type Watcher struct {
	exit    chan interface{}
	updates chan *config.ConfigResponse
}

func (w *Watcher) Next() (*config.ConfigResponse, error) {
	select {
	case <-w.exit:
		return nil, ErrWatcherStopped
	case v := <-w.updates:
		return v, nil
	}
}

func (w *Watcher) Stop() error {
	select {
	case <-w.exit:
	default:
		close(w.exit)
	}
	return nil
}
