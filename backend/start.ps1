# Start script for TCC E-Voting System

Write-Host "Starting TCC E-Voting System..." -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "Starting server on http://localhost:3001" -ForegroundColor Yellow
npm start