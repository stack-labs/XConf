FROM golang:1.13-alpine as builder
WORKDIR /root
COPY ./ ./
RUN export GO111MODULE=on && CGO_ENABLED=0 GOOS=linux go build -o build/exec ./main.go

FROM alpine:latest
WORKDIR /root

RUN apk --no-cache add ca-certificates \
    && apk update
COPY --from=builder /root/build/* ./

ENTRYPOINT ["/root/exec"]
