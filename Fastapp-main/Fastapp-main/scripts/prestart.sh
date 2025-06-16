#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! pg_isready -h db -U iqraa_user -d iqraa_db; do
    sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting application..."
exec "$@" 