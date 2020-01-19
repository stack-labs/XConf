package format

import "testing"

func TestCheckFormat(t *testing.T) {
	correctData := []struct {
		Key   string
		Value string
	}{
		{
			Key:   "json",
			Value: "{}",
		},
		{
			Key:   "json",
			Value: "[]",
		},
		{
			Key: "json",
			Value: `{
						"a":1,
						"b":"test"
					}`,
		},
		{
			Key: "json",
			Value: `[
						{
						"a":1,
						"b":"test"
						}
					]`,
		},
	}
	for _, v := range correctData {
		if err := CheckFormat(v.Key, v.Value); err != nil {
			t.Fatal(v.Key, v.Value, err)
		}
	}

	wrongData := []struct {
		Key   string
		Value string
	}{
		{
			Key:   "json",
			Value: "",
		},
		{
			Key:   "json",
			Value: "a",
		},
		{
			Key: "json",
			Value: `{
						"a":a
					}`,
		},
	}
	for _, v := range wrongData {
		if err := CheckFormat(v.Key, v.Value); err == nil {
			t.Fatal(v.Key, v.Value)
		}
	}
}

func TestSupportedFormat(t *testing.T) {
	s := SupportedFormat()
	for _, v := range s {
		if CheckFormat(v, "") == ErrUnsupportedFormat {
			t.Fatal()
		}
	}

	if CheckFormat("test", "") != ErrUnsupportedFormat {
		t.Fatal()
	}
}
