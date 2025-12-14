@echo off
REM Start Frontend Development Server with Live Reload
echo ========================================
echo TCC E-Voting System - Frontend Development Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if live-server is installed globally
npm list -g live-server >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing live-server for development...
    npm install -g live-server
    if %errorlevel% neq 0 (
        echo Failed to install live-server.
        echo Trying alternative method...
        goto alt_method
    )
)

echo Starting frontend development server with live reload...
echo Frontend files will be served at: http://localhost:8080
echo Any changes to files will automatically refresh the browser!
echo Press Ctrl+C to stop the server
echo.

cd frontend
live-server --port=8080 --host=localhost
goto end

:alt_method
echo Using built-in Node.js server as alternative...
echo Frontend files will be served at: http://localhost:8000
echo Note: Changes will require manual browser refresh
echo.

cd frontend
node server.js
goto end

:end
pause