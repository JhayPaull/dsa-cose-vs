@echo off
echo Starting TCC E-Voting System...

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo Starting server on http://localhost:3001
npm start