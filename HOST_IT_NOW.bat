@echo off
echo ========================================
echo   DEPLOYING YOUR SITE TO FIREBASE
echo ========================================
echo.
echo This will make your site accessible at:
echo https://dsa-cose-vs.web.app
echo.
echo Press any key to continue...
pause >nul

echo.
echo Step 1: Logging in to Firebase...
echo (A browser window will open - please sign in)
echo.
firebase login

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Login failed. Please try again.
    pause
    exit /b 1
)

echo.
echo Step 2: Setting Firebase project...
firebase use dsa-cose-vs

echo.
echo Step 3: Deploying your site...
echo This may take a few minutes...
echo.
firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS! YOUR SITE IS NOW LIVE!
    echo ========================================
    echo.
    echo Your site is available at:
    echo https://dsa-cose-vs.web.app
    echo.
    echo You can now search for it and access it online!
    echo.
) else (
    echo.
    echo ERROR: Deployment failed. Please check the error above.
    echo.
)

pause

