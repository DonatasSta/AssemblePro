#!/bin/bash

# Special script to run Vite in Replit environment
# This bypasses any host checking issues

export NODE_ENV=development
export VITE_USER_NODE_OPTIONS=--no-warnings
export VITE_ALLOW_BYPASS_DOMAIN=true 

# Run Vite using the Replit-specific config
npx --no -- vite --config vite.config.replit.js --host 0.0.0.0 --port 5000 --strictPort