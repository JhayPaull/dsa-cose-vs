@echo off
REM Deploy E-Voting System to Firebase Hosting and Google Cloud Run
echo Deploying TCC E-Voting System...
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

REM Check if Google Cloud SDK is installed
gcloud --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Google Cloud SDK is not installed or not in PATH.
    echo Please install Google Cloud SDK from https://cloud.google.com/sdk/docs/install
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

echo Deploying backend to Google Cloud Run...
cd backend
gcloud run deploy evoting-backend --source . --platform managed
if %errorlevel% neq 0 (
    echo Failed to deploy backend to Google Cloud Run.
    pause
    exit /b 1
)
cd ..

echo.
echo Backend deployed successfully!
echo.

echo ========================================
echo Deployment Summary
echo ========================================
echo Frontend: https://dsa-cose-vs.web.app
echo Backend:  Check Google Cloud Run console for URL
echo ========================================
echo.
echo Deployment completed successfully!
echo.
pause