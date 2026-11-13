@echo off
title RouteWise Launcher - Smart Route Planning and Optimization System
echo =====================================================================
echo  ROUTEWISE: SMART ROUTE PLANNING AND OPTIMIZATION SYSTEM
echo  BTech CSE AI & ML Academic Capstone Project
echo =====================================================================
echo.
echo Starting RouteWise Backend (Express on Port 5000)...
start "RouteWise Backend Server" cmd /k "cd /d %~dp0backend && npm start"

echo Starting RouteWise Frontend (Vite React on Port 5173)...
start "RouteWise Frontend Web App" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 3 /nobreak > nul

echo Opening RouteWise in your default browser...
start http://localhost:5173

echo.
echo =====================================================================
echo  RouteWise is now running!
echo  Frontend URL: http://localhost:5173
echo  Backend Health: http://localhost:5000/api/health
echo =====================================================================
pause
