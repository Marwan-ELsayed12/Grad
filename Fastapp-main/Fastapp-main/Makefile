.PHONY: dev build up down logs ps test clean

# Development commands
dev:
	docker compose up --build

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

# Database commands
db-shell:
	docker compose exec db psql -U iqraa_user -d iqraa_db

migrate:
	docker compose exec backend alembic upgrade head

migrate-create:
	docker compose exec backend alembic revision --autogenerate -m "$(message)"

# Testing
test:
	docker compose exec backend pytest

# Cleanup
clean:
	docker compose down -v
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete 