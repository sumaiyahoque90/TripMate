Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting TripMate – Smart Travel Planning Platform" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Starting Backend Server (Express on Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "[2/3] Starting Frontend Server (Next.js 14 on Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "[3/3] Waiting for servers to initialize and opening http://localhost:3000..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Done! TripMate is running." -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
