@echo off
REM Initialize Firebase Project
echo Initializing Firebase Project...
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

echo.
echo Initializing Firebase project...
echo This will walk you through setting up your Firebase project.
echo Make sure you have created a project in the Firebase Console first.
echo.

firebase init
if %errorlevel% neq 0 (
    echo Failed to initialize Firebase project.
    pause
    exit /b 1
)

echo.
echo Firebase project initialized successfully!
echo You can now deploy your project with: firebase deploy
echo.

pause