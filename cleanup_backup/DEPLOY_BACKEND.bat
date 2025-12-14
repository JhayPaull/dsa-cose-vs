@echo off
REM Deploy Backend to Google Cloud Run
echo Deploying Backend to Google Cloud Run...
echo.

REM Check if Google Cloud SDK is installed
gcloud --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Google Cloud SDK is not installed or not in PATH.
    echo Please install Google Cloud SDK from https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

echo Logging into Google Cloud...
gcloud auth login
if %errorlevel% neq 0 (
    echo Failed to login to Google Cloud.
    pause
    exit /b 1
)

echo Setting project...
gcloud config set project dsa-cose-vs
if %errorlevel% neq 0 (
    echo Failed to set project.
    pause
    exit /b 1
)

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
echo Check Google Cloud Run console for the deployed URL.
echo.
echo Deployment completed successfully!
echo.
pause