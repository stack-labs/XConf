FROM golang:1.13-alpine as builder
WORKDIR /root
ARG _app_name="agent-api"
COPY ${_app_name}  ${_app_name}
RUN export GO111MODULE=on && CGO_ENABLED=0 GOOS=linux go build -o build/exec ${_app_name}/main.go

FROM alpine:latest
WORKDIR /root

RUN apk --no-cache add ca-certificates \
    && apk update
COPY --from=builder /root/build/* ./

ENV MICRO_REGISTRY=${MICRO_REGISTRY} \
    MICRO_REGISTRY_ADDRESS=${MICRO_REGISTRY_ADDRESS}

ENTRYPOINT ["/exec"]
