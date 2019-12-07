package source

import (
	"container/list"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/micro/go-micro/config/source"
	"github.com/micro/go-micro/util/log"
)

type xConf struct {
	sync.RWMutex
	readURL  string
	watchURL string
	watchers list.List

	opts source.Options
}

var (
	ErrNotModified               = errors.New("StatusNotModified")
	DefaultURL                   = "http://localhost:8080"
	_              source.Source = &xConf{}
)

type namespace struct {
	ID            int    `json:"id"`
	CreatedAt     int    `json:"createdAt"`
	UpdatedAt     int    `json:"updatedAt"`
	AppName       string `json:"appName"`
	ClusterName   string `json:"clusterName"`
	NamespaceName string `json:"namespaceName"`
	Format        string `json:"format"`
	Value         string `json:"value"`
	Description   string `json:"description"`
}

func (x *xConf) Read() (*source.ChangeSet, error) {
	rsp, err := http.Get(x.readURL)
	if err != nil {
		return nil, err
	}
	defer rsp.Body.Close()

	b, err := ioutil.ReadAll(rsp.Body)
	if err != nil {
		return nil, err
	}

	var n namespace
	if err := json.Unmarshal(b, &n); err != nil {
		return nil, err
	}

	cs := &source.ChangeSet{
		Data:      []byte(n.Value),
		Format:    n.Format,
		Timestamp: time.Now(),
		Source:    x.String(),
	}
	cs.Checksum = cs.Sum()

	return cs, nil
}

func (x *xConf) Watch() (source.Watcher, error) {
	w := &watcher{
		exit:    make(chan interface{}),
		updates: make(chan *source.ChangeSet, 1),
	}

	x.Lock()
	e := x.watchers.PushBack(w)
	x.Unlock()

	go func() {
		<-w.exit
		x.Lock()
		x.watchers.Remove(e)
		x.Unlock()
	}()

	return w, nil
}

func (x *xConf) String() string {
	return "XConf"
}

func (x *xConf) watch() {
	for {
		cs, err := x.watchXConf(0)
		if err != nil {
			if err != ErrNotModified {
				log.Errorf("[XConf] source watch error : %s (will sleep 1 second)", err.Error())
				time.Sleep(time.Second)
			}
			continue
		}

		watchers := make([]*watcher, 0, x.watchers.Len())
		x.RLock()
		for e := x.watchers.Front(); e != nil; e = e.Next() {
			watchers = append(watchers, e.Value.(*watcher))
		}
		x.RUnlock()

		for _, w := range watchers {
			select {
			case w.updates <- cs:
			default:
			}
		}
	}
}

func (x *xConf) watchXConf(updateAt int64) (*source.ChangeSet, error) {
	rsp, err := http.Get(x.watchURL)
	if err != nil {
		return nil, err
	}
	if rsp.StatusCode == http.StatusNotModified {
		return nil, ErrNotModified
	}

	defer rsp.Body.Close()

	b, err := ioutil.ReadAll(rsp.Body)
	if err != nil {
		return nil, err
	}

	var n namespace
	if err := json.Unmarshal(b, &n); err != nil {
		return nil, err
	}

	cs := &source.ChangeSet{
		Data:      []byte(n.Value),
		Format:    n.Format,
		Timestamp: time.Now(),
		Source:    x.String(),
	}
	cs.Checksum = cs.Sum()

	return cs, nil
}

func NewSource(appName, clusterName, namespaceName string, opts ...source.Option) source.Source {
	options := source.NewOptions(opts...)

	url, ok := options.Context.Value(baseURL{}).(string)
	if !ok {
		url = DefaultURL
	}

	x := &xConf{
		readURL:  fmt.Sprintf("%s/agent/api/v1/config?appName=%s&clusterName=%s&namespaceName=%s", url, appName, clusterName, namespaceName),
		watchURL: fmt.Sprintf("%s/agent/api/v1/watch?appName=%s&clusterName=%s&namespaceName=%s&updatedAt=", url, appName, clusterName, namespaceName),
		opts:     options,
	}

	go x.watch()

	return x
}
