#!/bin/bash
# Script to kill the server process
PID=$(lsof -t -i:3000)
if [ -n "$PID" ]; then
    kill $PID
    echo "Server process $PID killed"
else
    echo "No process found running on port 3000"
fi