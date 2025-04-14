#!/bin/bash

# Start the backend server
echo "Starting Django backend server..."
cd backend
DJANGO_SETTINGS_MODULE=assembleally.settings python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Return to the main directory
cd ..

# Start the frontend server
echo "Starting React frontend server..."
cd frontend && npx serve -s public -p 5000 &
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
