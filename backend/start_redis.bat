@echo off
echo Starting Redis Server...
cd /d "C:\Program Files\Redis"
start /B redis-server.exe
echo Redis server started in background
timeout /t 2 /nobreak >nul
echo Testing Redis connection...
redis-cli ping
