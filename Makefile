.PHONY: all-in-one
all-in-one:
	docker build -f deployments/all-in-one/Dockerfile . -t xconf-all

.PHONY: admin-api
admin-api:
	docker build -f deployments/admin-api/Dockerfile . -t admin-api

.PHONY: agent-api
agent-api:
	docker build -f deployments/agent-api/Dockerfile . -t agent-api

.PHONY: config-srv
config-srv:
	docker build -f deployments/config-srv/Dockerfile . -t config-srv

.PHONY: micro
micro:
	docker build -f deployments/micro/Dockerfile . -t micro
