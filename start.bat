@echo off
title TripMate – Next.js & Express Platform
echo ========================================================
echo   Starting TripMate – Smart Travel Planning Platform
echo ========================================================
echo.

echo [1/3] Starting Backend REST API (Node/Express on Port 5000)...
start "TripMate Backend (Port 5000)" cmd /k "cd backend && npm run dev"

echo [2/3] Starting Frontend (Next.js 14 on Port 3000)...
start "TripMate Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo [3/3] Opening TripMate in your default browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================================
echo   TripMate is running!
echo   Frontend (Next.js): http://localhost:3000
echo   Backend  (Express): http://localhost:5000/api/health
echo ========================================================
echo Keep this window open or close it at any time.
pause
