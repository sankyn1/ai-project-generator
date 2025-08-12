#!/bin/bash

echo "🚀 Starting AI Project Generator..."
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run setup
    echo
fi

# Check if client/node_modules exists
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    (cd client && npm install)
    echo
fi

echo "🌟 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo
echo "Press Ctrl+C to stop the servers"
echo

npm run dev