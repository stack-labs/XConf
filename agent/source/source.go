package source

import (
	"container/list"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/micro/go-micro/util/log"
	"gopkg.in/resty.v1"
)

type Source interface {
	Read() ([]byte, error)
	Watch() (Watcher, error)
}

type httpSource struct {
	sync.RWMutex
	client   *resty.Client
	readURL  string
	watchURL string
	watchers list.List
}

func New(url, appName, clusterName, namespaceName string) Source {
	x := &httpSource{
		client:   resty.New(),
		readURL:  fmt.Sprintf("%s/agent/api/v1/config/raw?appName=%s&clusterName=%s&namespaceName=%s", url, appName, clusterName, namespaceName),
		watchURL: fmt.Sprintf("%s/agent/api/v1/watch/raw?appName=%s&clusterName=%s&namespaceName=%s&updatedAt=", url, appName, clusterName, namespaceName),
	}

	go x.watch()
	return x
}

func (s *httpSource) Read() ([]byte, error) {
	resp, err := s.client.R().Get(s.readURL)
	if err != nil {
		return nil, err
	}
	return resp.Body(), nil
}

func (s *httpSource) Watch() (Watcher, error) {
	w := &watcher{
		exit:    make(chan interface{}),
		updates: make(chan []byte, 1),
	}

	s.Lock()
	e := s.watchers.PushBack(w)
	s.Unlock()

	go func() {
		<-w.exit
		s.Lock()
		s.watchers.Remove(e)
		s.Unlock()
	}()

	return w, nil
}

func (s *httpSource) watch() {
	for {
		resp, err := s.client.SetTimeout(65 * time.Second).R().Get(s.watchURL)
		if err != nil {
			log.Error("agent watch :", err)
			time.Sleep(1 * time.Second)
			continue
		}

		if resp.StatusCode() == http.StatusNotModified {
			continue
		}
		if resp.StatusCode() != http.StatusOK {
			log.Error("agent watch :", resp.Status())
			time.Sleep(1 * time.Second)
			continue
		}

		watchers := make([]*watcher, 0, s.watchers.Len())
		s.RLock()
		for e := s.watchers.Front(); e != nil; e = e.Next() {
			watchers = append(watchers, e.Value.(*watcher))
		}
		s.RUnlock()

		newData := resp.Body()
		for _, w := range watchers {
			select {
			case w.updates <- newData:
			default:
			}
		}
	}
}
