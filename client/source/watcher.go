package source

import (
	"errors"

	"github.com/micro/go-micro/config/source"
)

var (
	ErrWatcherStopped                = errors.New("watcher stopped")
	_                 source.Watcher = &watcher{}
)

type watcher struct {
	updates chan *source.ChangeSet
	exit    chan interface{}
}

func (w *watcher) Next() (*source.ChangeSet, error) {
	select {
	case <-w.exit:
		return nil, ErrWatcherStopped
	case v := <-w.updates:
		return v, nil
	}
}

func (w *watcher) Stop() error {
	select {
	case <-w.exit:
	default:
		close(w.exit)
	}
	return nil
}
