@echo off
echo Performing clean start in Docker...
docker-compose down
echo Building and Starting AstroReha API in Docker...
docker-compose up -d --build --force-recreate
echo Docker container is starting. Access it at http://localhost:1300
pause
