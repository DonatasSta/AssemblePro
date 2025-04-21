#!/bin/bash

# Production startup script for FurnitureHeroes

# Collect static files for Django
cd backend
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Start Gunicorn server
echo "Starting Gunicorn server..."
gunicorn assembleally.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120