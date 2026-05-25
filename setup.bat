@echo off
echo Cleaning and Installing Dependencies...
if exist node_modules (
    echo Deleting node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Deleting package-lock.json...
    del /f /q package-lock.json
)
echo Running npm install...
npm install
echo Setup Complete!
pause
