@echo off
echo Starting E-Voting System Docker Containers...
echo ==========================================

echo Building and starting Docker containers...
docker-compose up -d

echo.
echo Containers started successfully!
echo ==========================================
echo Access the system from other devices using your computer's IP address:
echo.
echo Frontend (Website): http://YOUR_COMPUTER_IP:8081
echo Backend (API): http://YOUR_COMPUTER_IP:3001
echo.
echo Example:
echo If your computer's IP is 192.168.1.100:
echo - Frontend: http://192.168.1.100:8081
echo - Backend API: http://192.168.1.100:3001
echo - Backend Health Check: http://192.168.1.100:3001/api/health
echo.
echo To find your computer's IP address:
echo 1. Open Command Prompt
echo 2. Type: ipconfig
echo 3. Look for "IPv4 Address" under your active network connection
echo.
echo To stop the containers, run: docker-compose down
echo.
pause