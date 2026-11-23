# =====================================================================
# ROUTEWISE: MYSQL DATABASE INITIALIZATION (POWERSHELL)
# =====================================================================

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " RouteWise - MySQL Setup & Relational Seed Automation" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan

$user = Read-Host "Enter MySQL Username [default: root]"
if ([string]::IsNullOrWhiteSpace($user)) { $user = "root" }

$pass = Read-Host "Enter MySQL Password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
$plainPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$schemaFile = Join-Path $PSScriptRoot "schema.sql"
$seedFile = Join-Path $PSScriptRoot "seed.sql"

$mysqlCmd = "mysql"
if (-not (Get-Command mysql -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe") {
        $mysqlCmd = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    } else {
        Write-Error "mysql command not found in PATH or standard install locations."
        exit 1
    }
}

Write-Host "Executing schema.sql..." -ForegroundColor Yellow
& $mysqlCmd -u $user -p$plainPass -e "source $schemaFile"

Write-Host "Executing seed.sql..." -ForegroundColor Yellow
& $mysqlCmd -u $user -p$plainPass -e "source $seedFile"

Write-Host "MySQL Database 'routewise_db' initialized successfully!" -ForegroundColor Green
