FROM golang:1.13-alpine as builder
WORKDIR /root
COPY ./  ./
RUN export GO111MODULE=on && CGO_ENABLED=0 GOOS=linux go build -o build/micro micro/main.go


FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root
COPY --from=builder /root/build/micro ./
ENV CORS_ALLOWED_HEADERS="Content-Type,X-Token"
ENV CORS_ALLOWED_ORIGINS="*"
ENV CORS_ALLOWED_METHODS="OPTIONS,DELETE,GET,POST"

EXPOSE 8080
ENTRYPOINT ["/root/micro", "api", "--handler=http"]
