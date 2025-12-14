@echo off
echo ========================================
echo Deploying TCC E-Voting System Backend to Google Cloud Run
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

echo Google Cloud SDK: OK
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

echo Step 4: Building and deploying to Cloud Run...
echo This may take several minutes...
echo.

echo Building Docker image and deploying to Cloud Run...
gcloud run deploy tcc-e-voting-backend ^
  --source . ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --port 8080

if %errorlevel% neq 0 (
    echo ERROR: Failed to deploy to Cloud Run.
    pause
    exit /b 1
)

echo.
echo Step 5: Getting service URL...
echo.

for /f "tokens=*" %%i in ('gcloud run services describe tcc-e-voting-backend --platform managed --region us-central1 --format "value(status.url)"') do set BACKEND_URL=%%i

echo Backend deployed successfully!
echo Backend URL: %BACKEND_URL%
echo.

echo To update the frontend to use this backend:
echo 1. Open frontend/js/auth.js
echo 2. Update the API_BASE_URL to point to: %BACKEND_URL%/api
echo 3. Redeploy the frontend with: firebase deploy --only hosting
echo.

pause