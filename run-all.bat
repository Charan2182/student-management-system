@echo off
echo ===================================================
echo   Starting Student Management System
echo ===================================================
echo [1/3] Launching Spring Boot Backend on http://localhost:8085...
start "SMS Backend (Spring Boot :8085)" cmd /k "cd /d "%~dp0backend" && mvn spring-boot:run"

echo [2/3] Launching React Vite Frontend on http://localhost:5173...
start "SMS Frontend (React Vite :5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [3/3] Waiting for servers to initialize and opening browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo ===================================================
echo Application launched successfully!
echo - Web App (UI): http://localhost:5173
echo - Backend API:  http://localhost:8085/api/v1/students
echo ===================================================
pause
