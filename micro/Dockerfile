FROM golang:1.13-alpine as builder
WORKDIR /root
COPY ./ ./
RUN export GO111MODULE=on && CGO_ENABLED=0 GOOS=linux go build -o build/exec ./main.go

FROM alpine:latest
WORKDIR /root

RUN apk --no-cache add ca-certificates \
    && apk update
COPY --from=builder /root/build/* ./
ENV MICRO_REGISTRY=${MICRO_REGISTRY} \
    MICRO_REGISTRY_ADDRESS=${MICRO_REGISTRY_ADDRESS}

EXPOSE 8080
ENTRYPOINT ["/root/exec","--cors-allowed-headers=Content-Type,X-Token --cors-allowed-origins=* --cors-allowed-methods=OPTIONS,DELETE,GET,POST api --handler=http"]
