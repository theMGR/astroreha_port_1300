@echo off
echo Stopping AstroReha API on port 1300...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :1300 ^| findstr LISTENING') do (
    echo Found process ID %%a. Killing...
    taskkill /F /PID %%a
)
echo Stop command finished.
pause
