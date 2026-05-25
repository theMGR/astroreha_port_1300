#!/bin/bash
echo "Cleaning and Installing Dependencies..."

if [ -d "node_modules" ]; then
    echo "Deleting node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "Deleting package-lock.json..."
    rm -f package-lock.json
fi

echo "Running npm install..."
npm install
echo "Setup Complete!"
