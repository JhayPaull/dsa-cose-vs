@echo off
REM Start Full E-Voting System
echo Starting TCC E-Voting System...
echo.

echo ========================================
echo TCC E-Voting System Startup Instructions
echo ========================================
echo.
echo You have several options to run the system:
echo.
echo 1. Automatic Mode (Recommended for beginners)
echo    - Run: START_AUTOMATIC.bat
echo    - Automatically starts both servers in the background
echo    - Opens your browser to the frontend
echo.
echo 2. Manual Mode (Separate servers)
echo    - Backend: START_BACKEND.bat (API server on port 3001)
echo    - Frontend: START_FRONTEND.bat (Web interface on port 8000)
echo.
echo 3. Docker Mode (Containerized deployment)
echo    - Requires Docker installation
echo    - Run: START_DOCKER_SYSTEM.bat
echo.
echo 4. Firebase Hosting (Production deployment)
echo    - Deploy frontend to Firebase Hosting
echo    - Run only the backend server
echo.
echo Firebase Project: dsa-cose-vs
echo Firebase Hosting URLs:
echo - https://dsa-cose-vs.web.app
echo - https://dsa-cose-vs.firebaseapp.com
echo.
echo ========================================
echo Additional Notes:
echo ========================================
echo - Make sure you have Node.js installed
echo - The first time you run, dependencies will be installed automatically
echo - For Firebase deployment, use: firebase deploy
echo.
pause