@echo off
title RouteWise MySQL Setup & Seed Utility
echo =====================================================================
echo  ROUTEWISE: MYSQL DATABASE INITIALIZATION
echo  DBMS Subject Integration: Auto-Executing schema.sql & seed.sql
echo =====================================================================
echo.

set /p MYSQL_USER="Enter MySQL Username [default: root]: "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASS="Enter MySQL Password: "

echo.
echo Running schema.sql...
mysql -u %MYSQL_USER% -p%MYSQL_PASS% < "%~dp0schema.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to execute schema.sql. Please verify your MySQL credentials and service status.
    pause
    exit /b %errorlevel%
)

echo Running seed.sql...
mysql -u %MYSQL_USER% -p%MYSQL_PASS% < "%~dp0seed.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to execute seed.sql.
    pause
    exit /b %errorlevel%
)

echo.
echo =====================================================================
echo  [SUCCESS] Database 'routewise_db' initialized and seeded!
echo =====================================================================
echo.
pause
