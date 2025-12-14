@echo off
REM Run NPM Commands - Bypasses PowerShell Execution Policy
REM Usage: RUN_NPM.bat <npm-command>
REM Example: RUN_NPM.bat start
REM Example: RUN_NPM.bat install

if "%1"=="" (
    echo Usage: RUN_NPM.bat ^<npm-command^>
    echo Example: RUN_NPM.bat start
    echo Example: RUN_NPM.bat install
    exit /b 1
)

cd /d "%~dp0backend"
cmd /c npm %*
pause

