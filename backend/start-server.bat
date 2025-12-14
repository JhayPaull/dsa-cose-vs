@echo off
echo ========================================
echo Starting TCC E-Voting System Backend Server
echo ========================================
echo.

echo Checking if required files exist...
if exist "server.js" (
    echo ✓ Found server.js
) else (
    echo ✗ server.js not found!
    pause
    exit /b 1
)

if exist "config\firebase.js" (
    echo ✓ Found Firebase configuration
) else (
    echo ✗ Firebase configuration not found!
    echo Please ensure you have configured Firebase properly.
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install --production
echo.

echo Starting backend server...
npm start

pause