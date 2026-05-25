@echo off
echo Cleaning local environment...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo Installing dependencies...
call npm install

echo Performing clean start in Docker...
docker-compose down
echo Building and Starting AstroReha API in Docker...
docker-compose up -d --build --force-recreate
echo Pruning dangling docker images (older builds)...
docker image prune -f
echo Docker container is starting. Access it at http://localhost:1300
echo Interactive Swagger API Docs: http://localhost:1300/api-docs
pause
