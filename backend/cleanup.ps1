# Cleanup script to remove old frontend directory
# Change to parent directory
Set-Location ..

# Remove the old frontend directory
Remove-Item -Recurse -Force frontend

# Back to backend directory
Set-Location backend

Write-Host "Cleanup completed!"