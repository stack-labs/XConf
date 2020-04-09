package file

import (
	"bytes"
	"strings"
	"testing"
)

func TestConfigFile(t *testing.T) {
	file := New("/tmp/test.conf")

	content := []byte(strings.Repeat("hello xconf agent\n", 512))
	if err := file.Update(content); err != nil {
		t.Fatal(err)
	}

	b, err := file.Read()
	if err != nil {
		t.Fatal(err)
	}

	if !bytes.Equal(content, b) {
		t.Fatal()
	}
}
