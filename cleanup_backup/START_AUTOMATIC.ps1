# Start Full E-Voting System Automatically (PowerShell Version)
# This script can be run directly or via the "Run E-Voting System.bat" file

param(
    [Parameter(Mandatory=$false)]
    [Switch]$NoBrowser
)

Write-Host "Starting TCC E-Voting System..."
Write-Host "This will start both the backend and frontend servers automatically."
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion"
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH."
    Write-Host "Please install Node.js from https://nodejs.org/"
    Write-Host "Press any key to exit..."
    $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check if backend dependencies are installed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..."
    Set-Location backend
    npm install
    Set-Location ..
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install backend dependencies."
        Write-Host "Press any key to exit..."
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

# Check if frontend dependencies are installed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..."
    Set-Location frontend
    npm install
    Set-Location ..
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install frontend dependencies."
        Write-Host "Continuing without frontend npm packages..."
    }
}

Write-Host ""
Write-Host "Starting backend server..."
Set-Location backend
Start-Process -WindowStyle Minimized -FilePath "npm" -ArgumentList "start"
Set-Location ..

Start-Sleep -Seconds 5

Write-Host "Starting frontend server..."
Set-Location frontend
Start-Process -WindowStyle Minimized -FilePath "npx" -ArgumentList "http-server", "-p", "8000"
Set-Location ..

Write-Host ""
Write-Host "========================================"
Write-Host "TCC E-Voting System is now running!"
Write-Host "========================================"
Write-Host ""
Write-Host "Frontend: http://localhost:8000"
Write-Host "Backend:  http://localhost:3001"
Write-Host ""
Write-Host "NOTE: Servers are running in the background."
Write-Host "Close this window to stop the servers."
Write-Host ""

if (-not $NoBrowser) {
    Write-Host "Opening frontend in your default browser..."
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:8000"
}

Write-Host "Press Ctrl+C to stop the servers and exit."
try {
    Write-Host "Waiting for user input... (Press Ctrl+C to exit)"
    while ($true) {
        Start-Sleep -Milliseconds 500
    }
} catch {
    Write-Host "Stopping servers..."
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "Servers stopped."
}

exit