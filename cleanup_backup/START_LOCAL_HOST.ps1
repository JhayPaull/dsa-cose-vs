Write-Host "========================================" -ForegroundColor Green
Write-Host "  STARTING LOCAL DEVELOPMENT SERVER" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "This will start a local server for testing your site." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your site will be available at:" -ForegroundColor Cyan
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""

Set-Location -Path "c:\Users\jhayp\Downloads\Development of Web and Mobile-Based E-Voting System with Real-Time Vote Tabulation for School Elections for COSE\frontend"
python -m http.server 8000