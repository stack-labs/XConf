FROM golang:1.13-alpine as builder
WORKDIR /root
COPY ./  ./
RUN export GO111MODULE=on && CGO_ENABLED=0 GOOS=linux go build -o build/admin-api admin-api/main.go


FROM node:12-alpine as node-builder
WORKDIR /root
COPY dashboard .
RUN npm rebuild node-sass && npm install && npm run build


FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root
COPY --from=builder /root/build/admin-api ./
COPY --from=node-builder /root/build dist

ENTRYPOINT ["/root/admin-api"]
