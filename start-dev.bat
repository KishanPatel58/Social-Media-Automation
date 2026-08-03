@echo off
REM Start both client and server in separate cmd windows from this script's folder

nREM Open client terminal and run `npm run dev`
start "Client" cmd /k "cd /d "%~dp0client" && npm run dev"

REM Open server terminal and run `npm run dev`
start "Server" cmd /k "cd /d "%~dp0server" && npm run dev"

exit /b 0
