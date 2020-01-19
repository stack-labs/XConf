package format

import (
	"encoding/json"
	"errors"

	"github.com/BurntSushi/toml"
	"github.com/ghodss/yaml"
)

var supportedFormat = []string{"json", "yaml", "toml", "custom"}

var ErrUnsupportedFormat = errors.New("unsupported format")

func CheckFormat(format, content string) error {
	var tmp interface{}
	switch format {
	case "json":
		return json.Unmarshal([]byte(content), &tmp)
	case "yaml":
		return yaml.Unmarshal([]byte(content), &tmp)
	case "toml":
		return toml.Unmarshal([]byte(content), &tmp)
	case "custom":
		return nil
	default:
		return ErrUnsupportedFormat
	}
}

func SupportedFormat() []string {
	return supportedFormat
}
