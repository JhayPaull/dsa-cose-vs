# Start Frontend Development Server with Live Reload
Write-Host "========================================"
Write-Host "TCC E-Voting System - Frontend Development Server"
Write-Host "========================================"
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion"
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH."
    Write-Host "Please install Node.js from https://nodejs.org/"
    pause
    exit 1
}

# Check if live-server is installed globally
try {
    $liveServerCheck = npm list -g live-server 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "live-server not found"
    }
    Write-Host "live-server is already installed"
} catch {
    Write-Host "Installing live-server for development..."
    npm install -g live-server
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install live-server."
        Write-Host "Using built-in Node.js server as alternative..."
        Write-Host "Frontend files will be served at: http://localhost:8000"
        Write-Host "Note: Changes will require manual browser refresh"
        Write-Host ""
        Set-Location -Path "frontend"
        node server.js
        exit 0
    }
}

Write-Host "Starting frontend development server with live reload..."
Write-Host "Frontend files will be served at: http://localhost:8080"
Write-Host "Any changes to files will automatically refresh the browser!"
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

Set-Location -Path "frontend"
live-server --port=8080 --host=localhost