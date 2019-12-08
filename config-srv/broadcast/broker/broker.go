package broker

import (
	"container/list"
	"context"
	"sync"

	"github.com/micro-in-cn/XConf/config-srv/broadcast"
	"github.com/micro-in-cn/XConf/proto/config"
	"github.com/micro/go-micro"
	"github.com/micro/go-micro/metadata"
	"github.com/micro/go-micro/util/log"
)

var _ broadcast.Broadcast = &Broker{}

const broadcastUpdateTopic = "go.micro.XConf.broadcast.update"

type Broker struct {
	sync.RWMutex
	service   micro.Service
	publisher micro.Publisher

	watchers list.List
}

func New(service micro.Service) (broadcast.Broadcast, error) {
	broker := &Broker{
		service: service,
	}

	if err := micro.RegisterSubscriber(broadcastUpdateTopic, service.Server(), broker.subEvent); err != nil {
		return nil, err
	}
	broker.publisher = micro.NewPublisher(broadcastUpdateTopic, service.Client())

	return broker, nil
}

func (b *Broker) Send(namespace *config.Namespace) error {
	return b.publisher.Publish(context.Background(), namespace)
}

func (b *Broker) Watch() broadcast.Watcher {
	w := &Watcher{
		exit:    make(chan interface{}),
		updates: make(chan *config.Namespace, 2), // TODO 1 ?? 2 ?? or config
	}

	b.Lock()
	e := b.watchers.PushBack(w)
	b.Unlock()

	go func() {
		<-w.exit
		b.Lock()
		b.watchers.Remove(e)
		b.Unlock()
	}()

	return w
}

func (b *Broker) subEvent(ctx context.Context, event *config.Namespace) error {
	md, _ := metadata.FromContext(ctx)
	log.Infof("[pubsub.2] Received event %+v with metadata %+v\n", event, md)

	watchers := make([]*Watcher, 0, b.watchers.Len())
	b.RLock()
	for e := b.watchers.Front(); e != nil; e = e.Next() {
		watchers = append(watchers, e.Value.(*Watcher))
	}
	b.RUnlock()

	for _, w := range watchers {
		select {
		case w.updates <- event:
		default:
		}
	}

	return nil
}
