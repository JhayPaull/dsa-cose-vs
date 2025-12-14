@echo off
echo ========================================
echo Starting TCC E-Voting System with Docker
echo ========================================
echo.

echo Checking if Docker is running...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running!
echo.

echo Step 1: Building Docker containers...
echo This may take a few minutes on first run...
echo.
docker-compose build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Docker containers.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Docker containers...
echo.
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Docker containers.
    pause
    exit /b 1
)

echo.
echo Step 3: Waiting for services to be ready...
echo.
timeout /t 15 /nobreak >nul

echo.
echo Step 4: Checking backend health...
echo.
curl -f http://localhost:3001/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend may still be starting. Please wait a moment and check again.
) else (
    echo Backend is healthy and ready!
)

echo.
echo ========================================
echo SYSTEM STARTED!
echo ========================================
echo.
echo Backend API: http://localhost:3001
echo Frontend: http://localhost:8080
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop the system:
echo   docker-compose down
echo.
echo To deploy to Firebase Hosting:
echo   firebase deploy --only hosting
echo.
pause
