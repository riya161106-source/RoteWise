/**
 * =====================================================================
 * ROUTEWISE: BACKEND SERVER & APPLICATION LAYER
 * Integrates System Design, DBMS, Azure Cloud readiness, & Cyber Security
 * =====================================================================
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const db = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiter');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const routeRoutes = require('./routes/routeRoutes');
const historyRoutes = require('./routes/historyRoutes');
const fuelRoutes = require('./routes/fuelRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ---------------------------------------------------------------------
// 1. Cyber Security: Helmet Security Headers
// ---------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://photon.komoot.io", "https://router.project-osrm.org", "https://*.tile.openstreetmap.org"],
        imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org", "https://unpkg.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"]
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// ---------------------------------------------------------------------
// 2. Cyber Security: CORS Whitelist Configuration
// ---------------------------------------------------------------------
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || !isProd) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ---------------------------------------------------------------------
// 3. Cyber Security: Global Rate Limiting & Body Parsing
// ---------------------------------------------------------------------
app.use(globalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---------------------------------------------------------------------
// 4. Azure Cloud Integration: Health Check Endpoint
// Useful for Azure App Service Health Probes & Load Balancers
// ---------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    status: 'healthy',
    system: 'RouteWise - Smart Route Planning and Optimization System',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      isMySQL: db.isMySQLConnected(),
      statusMessage: db.getStatusMessage()
    },
    memory: {
      rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024)
    }
  });
});

// ---------------------------------------------------------------------
// 5. Application Layer: Mount REST API Routes
// ---------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/fuel', fuelRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'RouteWise Backend API',
    description: 'Smart Route Planning and Optimization System API',
    status: 'Online',
    healthEndpoint: '/api/health',
    documentation: '/docs'
  });
});

// ---------------------------------------------------------------------
// 6. Safe Error Handling & 404 Management
// Cyber Security: No stack traces or raw database credentials in response
// ---------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  res.status(statusCode).json({
    success: false,
    message: isProd ? 'Internal server error. Please try again later.' : message,
    ...(isProd ? {} : { stack: err.stack })
  });
});

// Start listening (binds dynamically to process.env.PORT for Azure App Service)
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✓ RouteWise API Server listening on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = app;
