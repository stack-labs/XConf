.PHONY: all-in-one
all-in-one:
	docker build -f deployments/docker/all-in-one/Dockerfile . -t xconf-all

.PHONY: admin-api
admin-api:
	docker build -f deployments/docker/admin-api/Dockerfile . -t admin-api

.PHONY: agent-api
agent-api:
	docker build -f deployments/docker/agent-api/Dockerfile . -t agent-api

.PHONY: config-srv
config-srv:
	docker build -f deployments/docker/config-srv/Dockerfile . -t config-srv

.PHONY: micro
micro:
	docker build -f deployments/docker/micro/Dockerfile . -t micro
