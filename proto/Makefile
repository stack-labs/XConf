
proto:
	protoc --proto_path=. --go_out=. --micro_out=. config/config.proto
	ls config/*.pb.go | xargs -n1 -IX bash -c 'sed s/,omitempty// X > X.tmp && mv X{.tmp,}'
