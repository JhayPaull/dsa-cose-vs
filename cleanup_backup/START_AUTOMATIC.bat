@echo off
REM Start Full E-Voting System Automatically
echo Starting TCC E-Voting System...
echo This will start both the backend and frontend servers automatically.
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

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
    if %errorlevel% neq 0 (
        echo Failed to install frontend dependencies.
        echo Continuing without frontend npm packages...
    )
)

echo.
echo Starting backend server...
cd backend
start "Backend Server" /MIN cmd /c "npm start"
cd ..

timeout /t 5 /nobreak >nul

echo Starting frontend server...
cd frontend
start "Frontend Server" /MIN cmd /c "npx http-server -p 8000"
cd ..

echo.
echo ========================================
echo TCC E-Voting System is now running!
echo ========================================
echo.
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:3001
echo.
echo NOTE: Servers are running in the background.
echo Close this window to stop the servers.
echo.
echo Opening frontend in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:8000

echo Press any key to stop the servers and exit.
pause >nul

echo Stopping servers...
taskkill /f /im node.exe >nul 2>&1
echo Servers stopped.

exit