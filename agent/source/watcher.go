package source

import "errors"

type Watcher interface {
	Next() ([]byte, error)
	Stop() error
}

var ErrWatcherStopped = errors.New("watcher stopped")

type watcher struct {
	exit    chan interface{}
	updates chan []byte
}

func (w *watcher) Next() ([]byte, error) {
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
