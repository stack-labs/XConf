package file

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/micro/go-micro/util/log"
)

type ConfigFile interface {
	Update(content []byte) error
	Read() ([]byte, error)
}

type configFile struct {
	filePath string
}

func New(filePatch string) ConfigFile {
	return &configFile{filePath: filePatch}
}

func (c *configFile) Update(content []byte) error {
	// create backup file
	exist, err := ExistFile(c.filePath)
	if err != nil {
		return err
	}
	if exist {
		if err := CopyFile(c.filePath, fmt.Sprintf("%s_backup", c.filePath)); err != nil {
			return err
		}
	}

	tmpFile := fmt.Sprintf("%s_tmp", c.filePath)
	if err := ioutil.WriteFile(tmpFile, content, 0755); err != nil {
		log.Error("write file error:", err)
		return err
	}

	if err := os.Rename(tmpFile, c.filePath); err != nil {
		log.Error("rename file error:", err)
		return err
	}

	return nil
}

func (c *configFile) Read() ([]byte, error) {
	return ioutil.ReadFile(c.filePath)
}
