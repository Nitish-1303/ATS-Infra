.PHONY: help install dev build test clean docker-build docker-up docker-down deploy

help:
	@echo "ATSInfra - Infrastructure-grade ATS Resume Debugger"
	@echo ""
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev          - Start development environment"
	@echo "  make build        - Build all services"
	@echo "  make test         - Run all tests"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make docker-build - Build Docker images"
	@echo "  make docker-up    - Start Docker services"
	@echo "  make docker-down  - Stop Docker services"
	@echo "  make deploy       - Deploy to Kubernetes"

install:
	@echo "Installing dependencies..."
	cd frontend && npm install
	cd api-gateway && npm install
	cd cli && npm install
	cd sdks/javascript && npm install
	cd services/parser && pip install -r requirements.txt
	cd sdks/python && pip install -e .

dev:
	@echo "Starting development environment..."
	docker-compose up -d postgres redis kafka minio
	@echo "Services started. Run the following in separate terminals:"
	@echo "  cd frontend && npm run dev"
	@echo "  cd api-gateway && npm run dev"
	@echo "  cd services/parser && uvicorn main:app --reload"

build:
	@echo "Building all services..."
	cd frontend && npm run build
	cd api-gateway && npm run build
	cd cli && npm run build
	cd sdks/javascript && npm run build

test:
	@echo "Running tests..."
	cd frontend && npm test
	cd api-gateway && npm test
	cd cli && npm test
	cd services/parser && pytest

clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/.next frontend/dist
	rm -rf api-gateway/dist
	rm -rf cli/dist
	rm -rf sdks/javascript/dist
	find . -type d -name node_modules -prune -exec rm -rf {} \;
	find . -type d -name __pycache__ -prune -exec rm -rf {} \;
	find . -type f -name "*.pyc" -delete

docker-build:
	@echo "Building Docker images..."
	docker-compose build

docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs:
	docker-compose logs -f

deploy:
	@echo "Deploying to Kubernetes..."
	kubectl apply -f k8s/

deploy-dev:
	@echo "Deploying to development environment..."
	kubectl apply -f k8s/ --namespace=atsinfra-dev

lint:
	@echo "Running linters..."
	cd frontend && npm run lint
	cd api-gateway && npm run lint
	cd services/parser && black . && mypy .

format:
	@echo "Formatting code..."
	cd frontend && npm run format
	cd api-gateway && npm run format
	cd services/parser && black .

db-migrate:
	@echo "Running database migrations..."
	docker-compose exec postgres psql -U atsinfra -d atsinfra -f /docker-entrypoint-initdb.d/init.sql

db-reset:
	@echo "Resetting database..."
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	make db-migrate

logs:
	docker-compose logs -f

ps:
	docker-compose ps

restart:
	docker-compose restart

stop:
	docker-compose stop

start:
	docker-compose start
