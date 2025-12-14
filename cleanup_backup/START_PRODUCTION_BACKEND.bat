@echo off
echo ========================================
echo Starting TCC E-Voting System Backend Server
echo ========================================
echo.

echo Checking if required files exist...
if exist "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\backend\server.js" (
    echo ✓ Found server.js
) else (
    echo ✗ server.js not found!
    pause
    exit /b 1
)

if exist "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\backend\serviceAccountKey.json" (
    echo ✓ Found serviceAccountKey.json
) else (
    echo ✗ serviceAccountKey.json not found!
    echo Please download your service account key from Firebase Console.
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\backend"
npm install --production
echo.

echo Starting backend server...
node server.js

pause