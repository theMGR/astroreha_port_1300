#!/bin/bash
echo "Stopping AstroReha API on port 1300..."

# Find process ID using lsof (fallback to netstat or fuser if needed)
PID=$(lsof -t -i:1300 2>/dev/null)

if [ -z "$PID" ]; then
    PID=$(netstat -lntp 2>/dev/null | grep :1300 | awk '{print $7}' | cut -d'/' -f1)
fi

if [ -z "$PID" ]; then
    PID=$(fuser 1300/tcp 2>/dev/null)
fi

if [ -n "$PID" ]; then
    echo "Found process ID $PID. Killing..."
    kill -9 $PID
    echo "Stop command finished."
else
    echo "No active process found running on port 1300."
fi
