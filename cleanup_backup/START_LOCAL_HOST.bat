@echo off
echo ========================================
echo   STARTING LOCAL DEVELOPMENT SERVER
echo ========================================
echo.
echo This will start a local server for testing your site.
echo.
echo Your site will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo Starting server...
echo.

cd /d "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\frontend"
python -m http.server 8000

pause