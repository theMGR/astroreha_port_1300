@echo off
echo Cleaning environment...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo Installing dependencies...
call npm install

echo Starting AstroReha API on port 1300...
npm start
pause
