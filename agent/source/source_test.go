package source

import (
	"fmt"
	"testing"
	"time"
)

func TestHttpSource_Read(t *testing.T) {
	client := New("http://xconf.mogutou.xyz", "test", "dev", "test")
	b, err := client.Read()
	if err != nil && err.Error() != "{\"Error\":\"record not found\"}" {
		t.Fatal(err)
	}

	fmt.Println("read:", string(b))
}

func TestHttpSource_Watch(t *testing.T) {
	client := New("http://xconf.mogutou.xyz", "test", "dev", "test")
	w, err := client.Watch()
	if err != nil && err.Error() != "{\"Error\":\"record not found\"}" {
		t.Fatal(err)
	}

	go func() {
		time.Sleep(2 * time.Second)
		_ = w.Stop()
	}()
	b, err := w.Next()
	if err != nil && err != ErrWatcherStopped {
		t.Fatal(err)
	}

	fmt.Println("read:", string(b))
}
