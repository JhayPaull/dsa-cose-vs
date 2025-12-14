@echo off
echo ========================================
echo TCC E-Voting System - Start Development Servers
echo ========================================
echo.

echo Starting Backend Server...
cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\backend"
start "Backend Server" /MIN cmd /c "npm run dev ^& pause"

timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\frontend"
start "Frontend Server" /MIN cmd /c "python -m http.server 8000 ^& pause"

echo.
echo ========================================
echo Servers started successfully!
echo ========================================
echo.
echo Frontend: http://localhost:8000
echo Backend:  http://localhost:3000
echo.
echo Press any key to exit...
pause >nul