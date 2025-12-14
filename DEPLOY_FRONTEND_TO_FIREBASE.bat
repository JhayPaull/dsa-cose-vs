@echo off
echo ==================================================
echo Firebase Deployment Script for E-Voting System
echo ==================================================

echo.
echo [1/3] Checking Firebase CLI installation...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI is not installed!
    echo Please install Firebase CLI from https://firebase.google.com/docs/cli
    pause
    exit /b 1
)
echo ✅ Firebase CLI is installed

echo.
echo [2/3] Checking Firebase login status...
firebase list >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Not logged in to Firebase. Attempting to login...
    firebase login
    if %errorlevel% neq 0 (
        echo ❌ Failed to login to Firebase
        pause
        exit /b 1
    )
)
echo ✅ Logged in to Firebase

echo.
echo [3/3] Deploying to Firebase Hosting...
echo This may take 1-2 minutes...
echo.

firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════╗
    echo ║                    🎉 SUCCESS! 🎉                         ║
    echo ╚══════════════════════════════════════════════════════════╝
    echo.
    echo Your E-Voting System frontend is now LIVE on Firebase!
    echo.
    echo 🌐 Primary URL:   https://dsa-cose-vs.web.app
    echo 🌐 Alternative:  https://dsa-cose-vs.firebaseapp.com
    echo.
    echo ⚠️  IMPORTANT: Remember to configure your backend URL
    echo    using the Configure Backend page or localStorage
    echo.
) else (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo Common issues:
    echo - Make sure you're logged in: firebase login
    echo - Check Firebase Console: https://console.firebase.google.com
    echo - Verify project ID matches: dsa-cose-vs
    echo.
)

pause