@echo off
REM Deploy Frontend to Firebase Hosting
echo Deploying Frontend to Firebase Hosting...
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Firebase CLI is not installed or not in PATH.
    echo Please install Firebase CLI from https://firebase.google.com/docs/cli
    echo Or run: npm install -g firebase-tools
    pause
    exit /b 1
)

echo Logging into Firebase...
firebase login
if %errorlevel% neq 0 (
    echo Failed to login to Firebase.
    pause
    exit /b 1
)

echo Deploying frontend to Firebase Hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo Failed to deploy frontend to Firebase Hosting.
    pause
    exit /b 1
)

echo.
echo Frontend deployed successfully!
echo Your site is now available at:
echo - https://dsa-cose-vs.web.app
echo - https://dsa-cose-vs.firebaseapp.com
echo.
echo Deployment completed successfully!
echo.
pause