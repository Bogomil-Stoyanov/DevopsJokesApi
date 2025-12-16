#!/bin/sh
# Docker entrypoint script for backend service
# Runs database migrations before starting the application

set -e

echo "🔄 Waiting for PostgreSQL to be ready..."

# Wait for PostgreSQL to accept connections
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

echo "Running database migrations..."
npm run migrate

echo "Running database seeds..."
npm run seed

echo "Starting application..."
exec "$@"
