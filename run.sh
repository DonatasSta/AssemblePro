#!/bin/bash

# Start the backend server
echo "Starting Django backend server..."
cd backend
# Make sure database migrations are applied
python manage.py migrate
# Start the server
DJANGO_SETTINGS_MODULE=assembleally.settings python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Wait a bit longer for the backend to start
sleep 5

# Return to the main directory
cd ..

# Start the frontend server
echo "Starting React frontend server with Vite..."
cd frontend && VITE_ALLOW_BYPASS_DOMAIN=true npm run start &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Set up trap to catch script termination signals
trap cleanup SIGINT SIGTERM

# Keep script running until Ctrl+C
echo "Servers are running. Press Ctrl+C to stop."
wait
