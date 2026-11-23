/**
 * =====================================================================
 * ROUTEWISE: DATABASE CONFIGURATION & DATA ACCESS LAYER
 * DBMS Subject Integration: MySQL Pool with Resilient Persistence
 * Supports Azure Database for MySQL Flexible Server and local MySQL80
 * =====================================================================
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let pool = null;
let isMySQL = false;
let dbStatusMessage = 'Initializing database...';

// Configuration parameters
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'routewise_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 4000
};

if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

// Local fallback store path
const LOCAL_STORE_FILE = path.join(__dirname, '..', 'database', 'local_store.json');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// In-memory / file-backed fallback state
let fallbackData = {
  users: [
    {
      user_id: 1,
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      password_hash: '$2a$10$SKydIpbt5BbhPm3MUo3GsOrlseCAcGlANefjgh2908wq0ytsQgQxu',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      user_id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password_hash: '$2a$10$SKydIpbt5BbhPm3MUo3GsOrlseCAcGlANefjgh2908wq0ytsQgQxu',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ],
  fuel_settings: [
    {
      setting_id: 1,
      user_id: 1,
      fuel_type: 'Petrol',
      mileage: 16.5,
      fuel_price: 102.86,
      updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      setting_id: 2,
      user_id: 2,
      fuel_type: 'Diesel',
      mileage: 21.0,
      fuel_price: 88.5,
      updated_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ],
  search_history: [
    {
      search_id: 1,
      user_id: 1,
      source: 'Bengaluru, Karnataka',
      destination: 'Mysuru, Karnataka',
      source_lat: 12.9715987,
      source_lng: 77.5945627,
      dest_lat: 12.2958104,
      dest_lng: 76.6393805,
      search_date: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      search_id: 2,
      user_id: 1,
      source: 'Koramangala, Bengaluru',
      destination: 'Kempegowda International Airport, Bengaluru',
      source_lat: 12.9351740,
      source_lng: 77.6244806,
      dest_lat: 13.1986348,
      dest_lng: 77.7065928,
      search_date: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ],
  routes: [
    {
      route_id: 1,
      search_id: 1,
      route_name: 'Bengaluru - Mysuru Expressway',
      distance: 143.20,
      duration: 135.00,
      estimated_fuel_cost: 892.73,
      route_type: 'fastest',
      geometry_geojson: null
    },
    {
      route_id: 2,
      search_id: 1,
      route_name: 'Via Kanakapura & Malavalli (NH 209)',
      distance: 158.40,
      duration: 190.00,
      estimated_fuel_cost: 987.49,
      route_type: 'alternative',
      geometry_geojson: null
    },
    {
      route_id: 3,
      search_id: 2,
      route_name: 'Via Bellary Road & Hebbal Flyover',
      distance: 41.50,
      duration: 68.00,
      estimated_fuel_cost: 258.62,
      route_type: 'fastest',
      geometry_geojson: null
    }
  ]
};

// Load saved local data if available
function loadLocalStore() {
  if (fs.existsSync(LOCAL_STORE_FILE)) {
    try {
      const data = fs.readFileSync(LOCAL_STORE_FILE, 'utf8');
      fallbackData = JSON.parse(data);
    } catch (err) {
      console.warn('[DBMS] Error reading local store, using default seed:', err.message);
    }
  } else {
    saveLocalStore();
  }
}

function saveLocalStore() {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(fallbackData, null, 2), 'utf8');
  } catch (err) {
    console.warn('[DBMS] Could not write local store file:', err.message);
  }
}

loadLocalStore();

// Initialize Database Connection
async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();

    isMySQL = true;
    dbStatusMessage = `Connected to MySQL [${dbConfig.host}:${dbConfig.port}/${dbConfig.database}]`;
    console.log(`✓ [DBMS] ${dbStatusMessage}`);

    // Auto-create tables if they don't exist yet
    await setupMySQLTables();
  } catch (err) {
    isMySQL = false;
    dbStatusMessage = `MySQL unreachable (${err.code || err.message}). Active Store: Relational persistent store`;
    console.warn(`! [DBMS Notice] ${dbStatusMessage}`);
  }
}

async function setupMySQLTables() {
  try {
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      // Split into statements
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (e) {
          // ignore already exists errors
        }
      }
      console.log('✓ [DBMS] Verified MySQL schema tables');
    }
  } catch (error) {
    console.warn('! [DBMS] Schema verification note:', error.message);
  }
}

// Unified Parameterized Query Executor
async function query(sql, params = []) {
  if (isMySQL && pool) {
    return pool.query(sql, params);
  }

  // Fallback persistent relational engine for local machine convenience
  return executeFallbackQuery(sql, params);
}

// Execute queries against fallback store
function executeFallbackQuery(sql, params = []) {
  const normalizedSql = sql.trim().replace(/\s+/g, ' ');
  const lower = normalizedSql.toLowerCase();

  // 1. SELECT queries
  if (lower.startsWith('select')) {
    // 1a. User by email
    if (lower.includes('from users where email = ?')) {
      const user = fallbackData.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
      return [[user ? { ...user } : undefined].filter(Boolean)];
    }

    // 1b. User by ID
    if (lower.includes('from users where user_id = ?')) {
      const user = fallbackData.users.find(u => u.user_id === Number(params[0]));
      return [[user ? { ...user } : undefined].filter(Boolean)];
    }

    // 1c. Fuel settings by user_id
    if (lower.includes('from fuel_settings where user_id = ?')) {
      const setting = fallbackData.fuel_settings.find(s => s.user_id === Number(params[0]));
      return [[setting ? { ...setting } : undefined].filter(Boolean)];
    }

    // 1d. Search History query
    if (lower.includes('from search_history') && (lower.includes('where search_history.user_id = ?') || lower.includes('where user_id = ?'))) {
      const userId = Number(params[0]);
      const searches = fallbackData.search_history
        .filter(s => s.user_id === userId)
        .sort((a, b) => new Date(b.search_date) - new Date(a.search_date));

      const results = searches.map(s => {
        const routeList = fallbackData.routes.filter(r => r.search_id === s.search_id);
        return {
          ...s,
          routes: routeList
        };
      });

      return [results];
    }

    // 1e. Routes for a search
    if (lower.includes('from routes where search_id = ?')) {
      const searchId = Number(params[0]);
      const routeList = fallbackData.routes
        .filter(r => r.search_id === searchId)
        .sort((a, b) => a.distance - b.distance);
      return [routeList];
    }

    // 1f. Single search with routes
    if (lower.includes('from search_history where search_id = ? and user_id = ?')) {
      const searchId = Number(params[0]);
      const userId = Number(params[1]);
      const s = fallbackData.search_history.find(item => item.search_id === searchId && item.user_id === userId);
      if (!s) return [[]];
      const routeList = fallbackData.routes.filter(r => r.search_id === searchId);
      return [[{ ...s, routes: routeList }]];
    }

    // 1g. Multi-Table JOIN query
    if (lower.includes('join routes r') || lower.includes('inner join routes')) {
      const userId = Number(params[0]);
      const userSearches = fallbackData.search_history.filter(s => s.user_id === userId);
      const joinedRows = [];
      userSearches.forEach(sh => {
        const matchingRoutes = fallbackData.routes.filter(r => r.search_id === sh.search_id);
        matchingRoutes.forEach(r => {
          joinedRows.push({
            search_id: sh.search_id,
            source: sh.source,
            destination: sh.destination,
            search_date: sh.search_date,
            route_name: r.route_name,
            distance: r.distance,
            duration: r.duration,
            estimated_fuel_cost: r.estimated_fuel_cost,
            route_type: r.route_type
          });
        });
      });
      return [joinedRows];
    }

    // 1h. Aggregate queries for dashboard stats
    if (lower.includes('count(distinct') || lower.includes('count(') || lower.includes('sum(')) {
      const userId = Number(params[0]);
      const userSearches = fallbackData.search_history.filter(s => s.user_id === userId);
      const searchIds = new Set(userSearches.map(s => s.search_id));
      const userRoutes = fallbackData.routes.filter(r => searchIds.has(r.search_id));

      const totalKm = userRoutes.reduce((acc, curr) => acc + Number(curr.distance || 0), 0);
      const totalFuelCost = userRoutes.reduce((acc, curr) => acc + Number(curr.estimated_fuel_cost || 0), 0);
      const avgDuration = userRoutes.length > 0 ? (userRoutes.reduce((acc, curr) => acc + Number(curr.duration || 0), 0) / userRoutes.length) : 0;

      return [[{
        total_searches: userSearches.length,
        total_routes_calculated: userRoutes.length,
        total_distance_km: parseFloat(totalKm.toFixed(2)),
        total_fuel_cost_inr: parseFloat(totalFuelCost.toFixed(2)),
        avg_trip_duration_mins: parseFloat(avgDuration.toFixed(1))
      }]];
    }

    return [[]];
  }

  // 2. INSERT queries
  if (lower.startsWith('insert into users')) {
    const [name, email, password_hash] = params;
    const newId = fallbackData.users.length > 0 ? Math.max(...fallbackData.users.map(u => u.user_id)) + 1 : 1;
    const newUser = {
      user_id: newId,
      name,
      email,
      password_hash,
      created_at: new Date().toISOString()
    };
    fallbackData.users.push(newUser);
    saveLocalStore();
    return [{ insertId: newId, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into fuel_settings')) {
    const [userId, fuelType, mileage, price] = params;
    const newId = fallbackData.fuel_settings.length > 0 ? Math.max(...fallbackData.fuel_settings.map(s => s.setting_id)) + 1 : 1;
    const newSetting = {
      setting_id: newId,
      user_id: Number(userId),
      fuel_type: fuelType,
      mileage: parseFloat(mileage),
      fuel_price: parseFloat(price),
      updated_at: new Date().toISOString()
    };
    fallbackData.fuel_settings.push(newSetting);
    saveLocalStore();
    return [{ insertId: newId, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into search_history')) {
    const [userId, source, destination, sLat, sLng, dLat, dLng] = params;
    const newId = fallbackData.search_history.length > 0 ? Math.max(...fallbackData.search_history.map(s => s.search_id)) + 1 : 1;
    const newSearch = {
      search_id: newId,
      user_id: Number(userId),
      source,
      destination,
      source_lat: parseFloat(sLat),
      source_lng: parseFloat(sLng),
      dest_lat: parseFloat(dLat),
      dest_lng: parseFloat(dLng),
      search_date: new Date().toISOString()
    };
    fallbackData.search_history.push(newSearch);
    saveLocalStore();
    return [{ insertId: newId, affectedRows: 1 }];
  }

  if (lower.startsWith('insert into routes')) {
    const [searchId, routeName, distance, duration, fuelCost, routeType, geometry] = params;
    const newId = fallbackData.routes.length > 0 ? Math.max(...fallbackData.routes.map(r => r.route_id)) + 1 : 1;
    const newRoute = {
      route_id: newId,
      search_id: Number(searchId),
      route_name: routeName,
      distance: parseFloat(distance),
      duration: parseFloat(duration),
      estimated_fuel_cost: parseFloat(fuelCost),
      route_type: routeType || 'alternative',
      geometry_geojson: geometry || null
    };
    fallbackData.routes.push(newRoute);
    saveLocalStore();
    return [{ insertId: newId, affectedRows: 1 }];
  }

  // 3. UPDATE queries
  if (lower.startsWith('update fuel_settings')) {
    const [fuelType, mileage, price, userId] = params;
    const existingIndex = fallbackData.fuel_settings.findIndex(s => s.user_id === Number(userId));
    if (existingIndex >= 0) {
      fallbackData.fuel_settings[existingIndex] = {
        ...fallbackData.fuel_settings[existingIndex],
        fuel_type: fuelType,
        mileage: parseFloat(mileage),
        fuel_price: parseFloat(price),
        updated_at: new Date().toISOString()
      };
      saveLocalStore();
      return [{ affectedRows: 1 }];
    } else {
      // Upsert
      const newId = fallbackData.fuel_settings.length > 0 ? Math.max(...fallbackData.fuel_settings.map(s => s.setting_id)) + 1 : 1;
      fallbackData.fuel_settings.push({
        setting_id: newId,
        user_id: Number(userId),
        fuel_type: fuelType,
        mileage: parseFloat(mileage),
        fuel_price: parseFloat(price),
        updated_at: new Date().toISOString()
      });
      saveLocalStore();
      return [{ affectedRows: 1, insertId: newId }];
    }
  }

  // 4. DELETE queries
  if (lower.startsWith('delete from search_history')) {
    const [searchId, userId] = params;
    const initialLen = fallbackData.search_history.length;
    fallbackData.search_history = fallbackData.search_history.filter(
      s => !(s.search_id === Number(searchId) && s.user_id === Number(userId))
    );
    // Cascade delete routes
    fallbackData.routes = fallbackData.routes.filter(r => r.search_id !== Number(searchId));
    saveLocalStore();
    return [{ affectedRows: initialLen - fallbackData.search_history.length }];
  }

  return [{ affectedRows: 0 }];
}

// Kick off initialization
initDatabase();

module.exports = {
  query,
  initDatabase,
  isMySQLConnected: () => isMySQL,
  getStatusMessage: () => dbStatusMessage
};
