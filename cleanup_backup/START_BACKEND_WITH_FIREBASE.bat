@echo off
echo Starting E-Voting System Backend with Firebase...
echo.

cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\backend"

echo Checking if serviceAccountKey.json exists...
if exist "serviceAccountKey.json" (
    echo ✓ Found serviceAccountKey.json
) else (
    echo ✗ serviceAccountKey.json not found!
    echo Please follow the Firebase setup guide to download your service account key.
    echo.
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install
echo.

echo Starting server...
npm run dev

pause