.PHONY: help up down restart logs clean build test-api test-health install

up: ## Start all services
	docker-compose up -d
	@echo "Services started:"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:8080/api"
	@echo "MySQL: localhost:3306"

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs for all services
	docker-compose logs -f

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-backend: ## Show backend logs
	docker-compose logs -f backend php-fpm

logs-mysql: ## Show MySQL logs
	docker-compose logs -f mysql

clean: ## Stop and remove all containers and volumes
	docker-compose down -v
	@echo "All containers and volumes removed"