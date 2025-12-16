# Script to open firewall ports for E-Voting System network access
# Run this script as Administrator

Write-Host "Opening firewall ports for E-Voting System..." -ForegroundColor Green

# Open port 3001 for backend API
try {
    netsh advfirewall firewall add rule name="E-Voting Backend API" dir=in action=allow protocol=TCP localport=3001
    Write-Host "Successfully opened port 3001 for backend API" -ForegroundColor Green
} catch {
    Write-Host "Failed to open port 3001. Error: $_" -ForegroundColor Red
}

# Open port 8081 for frontend
try {
    netsh advfirewall firewall add rule name="E-Voting Frontend" dir=in action=allow protocol=TCP localport=8081
    Write-Host "Successfully opened port 8081 for frontend" -ForegroundColor Green
} catch {
    Write-Host "Failed to open port 8081. Error: $_" -ForegroundColor Red
}

Write-Host "Firewall rules added. You should now be able to access the system from other devices." -ForegroundColor Yellow
Write-Host ""
Write-Host "To access from other devices:" -ForegroundColor Cyan
Write-Host "1. Find your computer's IP address by running 'ipconfig' in Command Prompt" -ForegroundColor Cyan
Write-Host "2. On another device on the same network, navigate to:" -ForegroundColor Cyan
Write-Host "   Frontend: http://YOUR_IP_ADDRESS:8081" -ForegroundColor Cyan
Write-Host "   Backend API: http://YOUR_IP_ADDRESS:3001/api" -ForegroundColor Cyan
Write-Host "   Backend Health Check: http://YOUR_IP_ADDRESS:3001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Example (if your IP is 192.168.1.100):" -ForegroundColor Cyan
Write-Host "   Frontend: http://192.168.1.100:8081" -ForegroundColor Cyan
Write-Host "   Backend API: http://192.168.1.100:3001/api" -ForegroundColor Cyan
Write-Host "   Backend Health Check: http://192.168.1.100:3001/api/health" -ForegroundColor Cyan

Pause