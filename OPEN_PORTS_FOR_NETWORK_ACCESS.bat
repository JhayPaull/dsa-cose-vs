@echo off
echo Opening firewall ports for E-Voting System network access...
echo This script needs to run as Administrator.
echo Right-click and select "Run as administrator" if you haven't already.
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0OPEN_PORTS_FOR_NETWORK_ACCESS.ps1"

pause