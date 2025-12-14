@echo off
echo ========================================
echo Deploying TCC E-Voting System to Cloud Run and Firebase Hosting
echo ========================================
echo.

echo Step 1: Checking prerequisites...
echo.

where gcloud >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Google Cloud SDK not found.
    echo Please install Google Cloud SDK and try again.
    echo Download from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found.
    echo Please install Firebase CLI and try again.
    echo Download from: https://firebase.google.com/docs/cli
    pause
    exit /b 1
)

echo Google Cloud SDK: OK
echo Firebase CLI: OK
echo.

echo Step 2: Authenticating with Google Cloud...
echo You may be prompted to log in to your Google account.
echo.
gcloud auth login
if %errorlevel% neq 0 (
    echo ERROR: Failed to authenticate with Google Cloud.
    pause
    exit /b 1
)
echo.

echo Step 3: Setting Google Cloud project...
gcloud config set project dsa-cose-vs
if %errorlevel% neq 0 (
    echo ERROR: Failed to set Google Cloud project.
    pause
    exit /b 1
)
echo.

echo Step 4: Building and deploying backend to Cloud Run...
echo This may take several minutes...
echo.

cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\backend"

echo Building Docker image and deploying to Cloud Run...
gcloud run deploy tcc-e-voting-backend ^
  --source . ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --port 8080

if %errorlevel% neq 0 (
    echo ERROR: Failed to deploy backend to Cloud Run.
    pause
    exit /b 1
)

echo.
echo Step 5: Getting backend service URL...
echo.

for /f "tokens=*" %%i in ('gcloud run services describe tcc-e-voting-backend --platform managed --region us-central1 --format "value(status.url)"') do set BACKEND_URL=%%i

echo Backend deployed successfully!
echo Backend URL: %BACKEND_URL%
echo.

echo Step 6: Updating frontend configuration...
echo.

cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\frontend\js"

echo Updating auth.js with backend URL...
powershell -Command "(gc auth.js) -replace 'https://your-backend-api-url.com/api', '%BACKEND_URL%/api' | Out-File -encoding ASCII auth.js"

echo Frontend configuration updated!
echo.

echo Step 7: Deploying frontend to Firebase Hosting...
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
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your TCC E-Voting System is now live:
echo Frontend: https://dsa-cose-vs.web.app
echo Backend API: %BACKEND_URL%
echo.
echo The system will now run automatically without manual intervention.
echo.
pause