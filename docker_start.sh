#!/bin/bash
echo "Cleaning local environment..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
fi

echo "Installing dependencies..."
npm install

echo "Performing clean start in Docker..."
docker compose down
echo "Building and Starting AstroReha API in Docker..."
docker compose up -d --build --force-recreate
echo "Pruning dangling docker images (older builds)..."
docker image prune -f
echo "Docker container is starting. Access it at http://localhost:1300"
echo "Interactive Swagger API Docs: http://localhost:1300/api-docs"
