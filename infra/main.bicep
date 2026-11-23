// =====================================================================
// ROUTEWISE: AZURE INFRASTRUCTURE AS CODE (BICEP TEMPLATE)
// Azure Cloud Computing Subject Integration: Automated Provisioning
// =====================================================================

@description('Location for all resources.')
param location string = resourceGroup().location

@description('Application name prefix.')
param appName string = 'routewise'

@description('Azure App Service plan SKU.')
param appServiceSku string = 'F1'

@description('Azure Database for MySQL administrator username.')
param dbAdminUsername string = 'routewiseadmin'

@description('Azure Database for MySQL administrator password.')
@secure()
param dbAdminPassword string

// 1. App Service Plan (Linux)
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan'
  location: location
  kind: 'linux'
  sku: {
    name: appServiceSku
  }
  properties: {
    reserved: true
  }
}

// 2. Azure App Service (Express Backend)
resource appService 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-api-${uniqueString(resourceGroup().id)}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'node server.js'
      alwaysOn: false
      appSettings: [
        { name: 'NODE_ENV', value: 'production' }
        { name: 'PORT', value: '8080' }
        { name: 'JWT_EXPIRES_IN', value: '24h' }
        { name: 'DB_PORT', value: '3306' }
        { name: 'DB_NAME', value: 'routewise_db' }
        { name: 'DB_SSL', value: 'true' }
      ]
    }
  }
}

// 3. Azure Static Web App (React Frontend)
resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${appName}-web'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    provider: 'GitHub'
  }
}

// Outputs
output backendUrl string = 'https://${appService.properties.defaultHostName}'
output frontendUrl string = 'https://${staticWebApp.properties.defaultHostname}'
