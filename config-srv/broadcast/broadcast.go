package broadcast

import (
	"github.com/micro-in-cn/XConf/proto/config"
)

type Broadcast interface {
	Send(namespace *config.Namespace) error
	Watch() Watcher
}

type Watcher interface {
	Next() (*config.Namespace, error)
	Stop() error
}

var broadcast Broadcast

func Init(b Broadcast) {
	broadcast = b
}

func GetBroadcast() Broadcast {
	return broadcast
}
