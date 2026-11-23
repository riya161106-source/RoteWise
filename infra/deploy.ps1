# =====================================================================
# ROUTEWISE: AZURE AUTOMATED DEPLOYMENT SCRIPT (POWERSHELL)
# =====================================================================

param (
    [string]$ResourceGroupName = "rg-routewise-capstone",
    [string]$Location = "eastus",
    [string]$AppName = "routewise"
)

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " RouteWise - Automated Azure Cloud Deployment" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Warning "Azure CLI ('az') is not installed or not in PATH."
    Write-Host "Please install Azure CLI from: https://aka.ms/installazurecliwindows"
    exit 1
}

# Check login status
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Logging into your Microsoft Azure account..." -ForegroundColor Yellow
    az login
}

Write-Host "Target Subscription: $($account.name) ($($account.id))" -ForegroundColor Cyan

# Create Resource Group
Write-Host "Creating Resource Group: $ResourceGroupName in $Location..." -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Prompt for database password
$securePassword = Read-Host "Enter Azure MySQL Administrator Password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Deploy Bicep template
Write-Host "Deploying Azure Infrastructure via Bicep Template..." -ForegroundColor Yellow
az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file ./infra/main.bicep `
    --parameters appName=$AppName dbAdminPassword=$plainPassword

Write-Host "Deployment completed successfully!" -ForegroundColor Green
