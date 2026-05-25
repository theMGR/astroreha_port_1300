#!/bin/bash
echo "Cleaning environment..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
fi

echo "Installing dependencies..."
npm install

echo "Starting AstroReha API on port 1300..."
npm start
