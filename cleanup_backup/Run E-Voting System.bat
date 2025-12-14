@echo off
REM Double-click this file to start the E-Voting System
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\START_AUTOMATIC.ps1"