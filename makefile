build:
	docker compose -f ./app/docker-compose.dev.yml build
.PHONY: build

run:
	docker compose -f ./app/docker-compose.dev.yml up
.PHONY: run

down:
	docker compose -f ./app/docker-compose.dev.yml down
.PHONY: down