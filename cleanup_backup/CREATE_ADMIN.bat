@echo off
REM Create Initial Admin Account
echo Creating Initial Admin Account...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
    if %errorlevel% neq 0 (
        echo Failed to install backend dependencies.
        pause
        exit /b 1
    )
)

echo Running admin creation script...
cd backend
node create-initial-admin.js
cd ..

echo.
echo Admin creation script completed.
pause