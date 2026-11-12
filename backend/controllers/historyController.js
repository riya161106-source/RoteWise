/**
 * =====================================================================
 * ROUTEWISE: HISTORY & ANALYTICS CONTROLLER
 * DBMS Subject Integration: Relational CRUD, JOINs, and Aggregate queries
 * Cyber Security: Row-level authorization & ownership verification
 * =====================================================================
 */

const db = require('../config/db');
const routingService = require('../services/routingService');
const optimizerService = require('../services/optimizerService');

/**
 * Get all search history records for authenticated user (JOIN query)
 * GET /api/history
 */
async function getHistory(req, res, next) {
  try {
    const userId = req.user.userId;

    // Relational query retrieving searches ordered chronologically
    const [searches] = await db.query(
      `SELECT search_id, source, destination, source_lat, source_lng, dest_lat, dest_lng, search_date
       FROM search_history
       WHERE user_id = ?
       ORDER BY search_date DESC`,
      [userId]
    );

    // If no searches found
    if (!searches || searches.length === 0) {
      return res.status(200).json({
        success: true,
        history: []
      });
    }

    // Retrieve associated routes for these searches (JOIN / In-Query)
    const historyWithRoutes = [];
    for (const search of searches) {
      // In MySQL fallback or live pool
      if (search.routes) {
        historyWithRoutes.push(search);
      } else {
        const [routes] = await db.query(
          `SELECT route_id, route_name, distance, duration, estimated_fuel_cost, route_type, geometry_geojson
           FROM routes
           WHERE search_id = ?
           ORDER BY distance ASC`,
          [search.search_id]
        );

        historyWithRoutes.push({
          ...search,
          routes: routes.map(r => ({
            ...r,
            geometry: r.geometry_geojson ? (typeof r.geometry_geojson === 'string' ? JSON.parse(r.geometry_geojson) : r.geometry_geojson) : null
          }))
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: historyWithRoutes.length,
      history: historyWithRoutes
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Recalculate routes for a previously saved search
 * POST /api/history/:searchId/recalculate
 */
async function recalculateRoute(req, res, next) {
  try {
    const userId = req.user.userId;
    const searchId = parseInt(req.params.searchId, 10);

    // Verify ownership
    const [searches] = await db.query(
      `SELECT search_id, source, destination, source_lat, source_lng, dest_lat, dest_lng
       FROM search_history
       WHERE search_id = ? AND user_id = ?`,
      [searchId, userId]
    );

    if (!searches || searches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Search record not found or does not belong to your account'
      });
    }

    const search = searches[0];

    // Fetch user's latest fuel preferences
    const [fuelRows] = await db.query(
      'SELECT fuel_type, mileage, fuel_price FROM fuel_settings WHERE user_id = ?',
      [userId]
    );
    const fuelSettings = fuelRows?.[0] || { fuel_type: 'Petrol', mileage: 15.0, fuel_price: 102.5 };

    // Fetch fresh driving routes from OSRM
    const rawRoutes = await routingService.fetchDrivingRoutes(
      search.source_lat,
      search.source_lng,
      search.dest_lat,
      search.dest_lng
    );

    // Optimize with current fuel rates
    const optimizedRoutes = optimizerService.optimizeRoutes(rawRoutes, {
      fuelType: fuelSettings.fuel_type,
      mileage: fuelSettings.mileage,
      fuelPrice: fuelSettings.fuel_price
    });

    // Update routes in database for this search record
    await db.query('DELETE FROM routes WHERE search_id = ?', [searchId]);
    for (const r of optimizedRoutes) {
      await db.query(
        `INSERT INTO routes (search_id, route_name, distance, duration, estimated_fuel_cost, route_type, geometry_geojson)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [searchId, r.routeName, r.distanceKm, r.durationMins, r.estimatedFuelCost, r.routeType, JSON.stringify(r.geometry || null)]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Route recalculated with fresh driving conditions and fuel preferences',
      source: { name: search.source, lat: search.source_lat, lng: search.source_lng },
      destination: { name: search.destination, lat: search.dest_lat, lng: search.dest_lng },
      routes: optimizedRoutes,
      fuelSettings
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a search record and its associated routes (ON DELETE CASCADE)
 * DELETE /api/history/:searchId
 */
async function deleteHistory(req, res, next) {
  try {
    const userId = req.user.userId;
    const searchId = parseInt(req.params.searchId, 10);

    const [result] = await db.query(
      'DELETE FROM search_history WHERE search_id = ? AND user_id = ?',
      [searchId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Search record not found or unauthorized to delete'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Search record deleted successfully from database'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Aggregate query calculating user's cumulative travel analytics
 * GET /api/history/analytics/stats
 */
async function getAnalytics(req, res, next) {
  try {
    const userId = req.user.userId;

    // SQL Aggregate query joining search_history and routes
    const [rows] = await db.query(
      `SELECT 
         COUNT(DISTINCT sh.search_id) AS total_searches,
         COUNT(r.route_id) AS total_routes_calculated,
         COALESCE(SUM(r.distance), 0) AS total_distance_km,
         COALESCE(SUM(r.estimated_fuel_cost), 0) AS total_fuel_cost_inr,
         COALESCE(AVG(r.duration), 0) AS avg_trip_duration_mins
       FROM search_history sh
       LEFT JOIN routes r ON sh.search_id = r.search_id
       WHERE sh.user_id = ?`,
      [userId]
    );

    const stats = rows?.[0] || {
      total_searches: 0,
      total_routes_calculated: 0,
      total_distance_km: 0,
      total_fuel_cost_inr: 0,
      avg_trip_duration_mins: 0
    };

    return res.status(200).json({
      success: true,
      stats: {
        totalSearches: Number(stats.total_searches),
        totalRoutesCalculated: Number(stats.total_routes_calculated),
        totalDistanceKm: parseFloat(Number(stats.total_distance_km).toFixed(2)),
        totalFuelCostInr: parseFloat(Number(stats.total_fuel_cost_inr).toFixed(2)),
        avgTripDurationMins: parseFloat(Number(stats.avg_trip_duration_mins).toFixed(1))
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHistory,
  recalculateRoute,
  deleteHistory,
  getAnalytics
};
