@echo off
REM Start Frontend Server
echo Starting Frontend Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install http-server globally if not already installed
npm list -g http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing http-server...
    npm install -g http-server
    if %errorlevel% neq 0 (
        echo Failed to install http-server. Trying with yarn...
        yarn global add http-server
        if %errorlevel% neq 0 (
            echo Failed to install http-server with both npm and yarn.
            echo Please install it manually with: npm install -g http-server
            pause
            exit /b 1
        )
    )
)

echo Starting frontend server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

cd frontend
http-server -p 8000

pause