@echo off
echo ========================================
echo Deploying TCC E-Voting System Frontend Only
echo ========================================
echo.

echo Step 1: Checking prerequisites...
echo.

where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found.
    echo Please install Firebase CLI and try again.
    echo Download from: https://firebase.google.com/docs/cli
    pause
    exit /b 1
)

echo Firebase CLI: OK
echo.

echo Step 2: Authenticating with Firebase...
echo You may be prompted to log in to your Google account.
echo.
firebase login
if %errorlevel% neq 0 (
    echo ERROR: Failed to authenticate with Firebase.
    pause
    exit /b 1
)
echo.

echo Step 3: Deploying frontend to Firebase Hosting...
echo.

cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE"

firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo ERROR: Failed to deploy frontend to Firebase Hosting.
    pause
    exit /b 1
)

echo.
echo ========================================
echo FRONTEND DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your TCC E-Voting System frontend is now live at:
echo https://dsa-cose-vs.web.app
echo.
echo NOTE: The login and registration features will not work yet
echo because the backend API has not been deployed.
echo.
echo To enable full functionality:
echo 1. Run DEPLOY_TO_CLOUD_RUN.bat to deploy the backend
echo 2. Or deploy the backend manually to a cloud service
echo.
pause