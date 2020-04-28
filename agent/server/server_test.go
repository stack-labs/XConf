package server

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"gopkg.in/resty.v1"
)

func TestServer_Reload(t *testing.T) {
	client := resty.New()

	s := New("/tmp/xconf", "http://xconf.mogutou.xyz", "test", "dev")
	if err := s.Init(); err != nil {
		t.Fatal(err)
		return
	}

	go func() {
		for i := 0; i < 3; i++ {
			time.Sleep(time.Second * 1)

			if i == 2 {
				resp, err := client.R().SetBody(`{"appName":"test","clusterName":"dev","namespaceName":"xx","format":"json"}`).
					SetHeader("Content-Type", "application/json").
					Post("http://xconf.mogutou.xyz/admin/api/v1/namespace")
				if err != nil {
					t.Fatal(err)
				}
				if resp.StatusCode() != http.StatusOK {
					t.Fatal(resp.Status(), string(resp.Body()))
				}
			}

			if err := s.Reload(); err != nil {
				panic(err)
			}
			fmt.Println("reload")
		}

		s.Stop()
	}()

	s.Run()

	// delete tmp namespace
	resp, err := client.R().Delete("http://xconf.mogutou.xyz/admin/api/v1/namespace?appName=test&clusterName=dev&namespaceName=xx")
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode() != http.StatusOK {
		t.Fatal(resp.Status(), string(resp.Body()))
	}
}
