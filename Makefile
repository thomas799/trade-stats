.PHONY: help up down restart logs clean build test-api test-health install

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

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

build: ## Rebuild all images
	docker-compose build --no-cache

rebuild: clean build up ## Complete rebuild

status: ## Show service status
	docker-compose ps

shell-frontend: ## Open a shell in the frontend container
	docker-compose exec frontend sh

shell-php: ## Open a shell in the PHP-FPM container
	docker-compose exec php-fpm sh

shell-mysql: ## Open the MySQL client
	docker-compose exec mysql mysql -u trade_stats_user -ptrade_stats_password trade_stats_db

test-api: ## Test API endpoints
	@echo "Testing GET endpoint..."
	@curl -s http://localhost:8080/api | jq .
	@echo "\nTesting POST endpoint..."
	@curl -s -X POST http://localhost:8080/api \
		-H "Content-Type: application/json" \
		-d '{"mean":100.5,"std_dev":15.2,"mode":98.0,"min_value":50.0,"max_value":150.0,"lost_quotes":5,"calc_time":0.125}' | jq .

test-health: ## Check the health of all services
	@echo "Frontend (5173):"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:5173 || echo "Not accessible"
	@echo "\nBackend health (8080):"
	@curl -s http://localhost:8080/health
	@echo "\nBackend API (8080):"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8080/api
	@echo "\nMySQL:"
	@docker-compose exec mysql mysqladmin ping -h localhost -u root -proot_password

db-init: ## Reinitialize the database
	docker-compose exec mysql mysql -u root -proot_password -e "DROP DATABASE IF EXISTS trade_stats_db; CREATE DATABASE trade_stats_db;"
	docker-compose exec mysql mysql -u root -proot_password trade_stats_db < apps/stats-backend/schema.sql
	@echo "Database reinitialized"

db-dump: ## Create a database dump
	docker-compose exec mysql mysqldump -u root -proot_password trade_stats_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Dump created"

install: ## Initial installation and startup
	@echo "Creating necessary directories..."
	@mkdir -p docker/nginx docker/php
	@echo "Starting services..."
	@make up
	@echo "\nWaiting for MySQL to be ready..."
	@sleep 10
	@echo "\nChecking status..."
	@make status
	@echo "\nDone! Access to application:"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:8080/api"
