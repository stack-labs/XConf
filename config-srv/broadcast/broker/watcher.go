package broker

import (
	"errors"

	"github.com/micro-in-cn/XConf/config-srv/broadcast"
	"github.com/micro-in-cn/XConf/proto/config"
)

var ErrWatcherStopped = errors.New("watcher stopped")
var _ broadcast.Watcher = &Watcher{}

type Watcher struct {
	exit    chan interface{}
	updates chan *config.Namespace
}

func (w *Watcher) Next() (*config.Namespace, error) {
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
