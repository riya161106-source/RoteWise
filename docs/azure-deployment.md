# RouteWise – Microsoft Azure Cloud Deployment Guide

## 1. Cloud Architecture Overview

RouteWise is engineered for deployment on **Microsoft Azure**, adopting a decoupled cloud architecture designed for cost efficiency, scalability, and security:

```
[User Browser]
      │
      ▼ (HTTPS)
[Azure Static Web Apps (Frontend CDN)]
      │
      ▼ (REST API Calls over HTTPS)
[Azure App Service (Node.js Linux Backend)]
      │
      ▼ (Encrypted TLS / Port 3306)
[Azure Database for MySQL Flexible Server]
```

- **Frontend**: Hosted on **Azure Static Web Apps (Free Tier)** with global CDN distribution, automatic SSL certificate provisioning, and SPA navigation rewrites via `staticwebapp.config.json`.
- **Backend**: Hosted on **Azure App Service (Linux B1 or Free F1 Tier)** with dynamic port binding (`process.env.PORT`) and continuous health checks.
- **Database**: Hosted on **Azure Database for MySQL Flexible Server (Burstable B1ms)** with SSL/TLS encryption.

---

## 2. Cloud Cost Safety & Budget Estimation

Before provisioning paid Azure cloud resources, review the estimated monthly costs:

| Azure Resource | Tier / SKU | Estimated Monthly Cost | Free Tier Eligible |
| :--- | :--- | :--- | :--- |
| **Azure Static Web Apps** | Free Tier | $0.00 / month | Yes (Always Free) |
| **Azure App Service** | F1 Free or B1 Basic | $0.00 - $13.00 / month | Yes (F1 Free tier available) |
| **Azure Database for MySQL** | Flexible Server (B1ms) | ~$15.00 / month | Free 12 months with Azure Free Account |

> [!IMPORTANT]
> Always check for available **Azure for Students credits ($100 free)** or **Azure Free Trial ($200 credit)** before provisioning paid flexible servers. Use resource locks and budget alerts.

---

## 3. Step-by-Step Deployment Instructions

### Phase 1: Deploying Azure Database for MySQL Flexible Server
1. In Azure Portal, navigate to **Azure Database for MySQL flexible servers** > **Create**.
2. Select your subscription, resource group (`rg-routewise`), and compute tier (`Burstable B1ms`).
3. Set Administrator credentials (e.g., `adminuser` and strong password).
4. Under **Networking**, enable **Allow public access from any Azure service within Azure to this server**.
5. Once provisioned, connect via MySQL CLI or Workbench and run `database/schema.sql` and `database/seed.sql`:
   ```bash
   mysql -h your-server.mysql.database.azure.com -u adminuser -p --ssl-mode=REQUIRED < database/schema.sql
   mysql -h your-server.mysql.database.azure.com -u adminuser -p --ssl-mode=REQUIRED < database/seed.sql
   ```

### Phase 2: Deploying Express Backend to Azure App Service
1. Create an **App Service** in Azure Portal:
   - Name: `routewise-api`
   - Publish: `Code`
   - Runtime stack: `Node 18 LTS` or `Node 20 LTS`
   - Operating System: `Linux`
   - Plan: `F1 Free` or `B1`
2. Configure **Environment Variables** in App Service **Configuration > Application settings**:
   ```env
   NODE_ENV=production
   PORT=8080
   CORS_ORIGIN=https://your-frontend.azurestaticapps.net
   JWT_SECRET=your_production_secure_jwt_token_key_academic_2026
   JWT_EXPIRES_IN=24h
   DB_HOST=your-server.mysql.database.azure.com
   DB_PORT=3306
   DB_USER=adminuser
   DB_PASSWORD=your_mysql_password
   DB_NAME=routewise_db
   DB_SSL=true
   ```
3. Set the startup command in **Configuration > General settings**:
   ```bash
   node server.js
   ```
4. Verify backend health probe:
   ```bash
   curl https://routewise-api.azurewebsites.net/api/health
   ```

### Phase 3: Deploying React Frontend to Azure Static Web Apps
1. Create an **Azure Static Web App** in Azure Portal:
   - App location: `/frontend`
   - Output location: `dist`
2. Connect your GitHub repository (`https://github.com/riya161106-source/RoteWise`).
3. Set Environment Variable in Static Web App **Configuration**:
   ```env
   VITE_API_URL=https://routewise-api.azurewebsites.net/api
   ```
4. The GitHub Actions workflow will automatically build and deploy the React application.

---

## 4. Production Health Check & Telemetry

The RouteWise backend provides a dedicated health check endpoint at `/api/health`:
```json
{
  "status": "healthy",
  "system": "RouteWise - Smart Route Planning and Optimization System",
  "uptimeSeconds": 3600,
  "environment": "production",
  "database": {
    "isMySQL": true,
    "statusMessage": "Connected to MySQL [your-server.mysql.database.azure.com:3306/routewise_db]"
  },
  "memory": {
    "rssMb": 68,
    "heapUsedMb": 22
  }
}
```
This endpoint integrates with Azure Application Insights and App Service health probes to ensure zero-downtime operation.
