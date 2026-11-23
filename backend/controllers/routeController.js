/**
 * =====================================================================
 * ROUTEWISE: ROUTE CONTROLLER (ENHANCED)
 * Geocoding, Multi-Stop Waypoints, Driving Turn-by-Turn, AI/ML Optimization
 * =====================================================================
 */

const geocodeService = require('../services/geocodeService');
const routingService = require('../services/routingService');
const optimizerService = require('../services/optimizerService');
const db = require('../config/db');

/**
 * Autocomplete / Search location suggestions
 * GET /api/routes/search-location?q=...
 */
async function searchLocation(req, res, next) {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.status(200).json({ success: true, locations: [] });
    }

    const locations = await geocodeService.searchLocations(query, 6);
    return res.status(200).json({
      success: true,
      locations
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Calculate driving routes between source, optional waypoints, and destination
 * POST /api/routes/calculate
 */
async function calculateRoute(req, res, next) {
  try {
    const { 
      source, 
      destination, 
      sourceCoords, 
      destCoords, 
      waypoints = [], // Array of intermediate stops [{ name, lat, lng }]
      fuelSettings, 
      departureHour,
      saveToHistory 
    } = req.body;

    let sLat, sLng, sName;
    let dLat, dLng, dName;

    // 1. Resolve Source Coordinates
    if (sourceCoords && !isNaN(sourceCoords.lat) && !isNaN(sourceCoords.lng)) {
      sLat = parseFloat(sourceCoords.lat);
      sLng = parseFloat(sourceCoords.lng);
      sName = sourceCoords.displayName || source;
    } else {
      const geoSource = await geocodeService.geocodeLocation(source);
      if (!geoSource) {
        return res.status(404).json({
          success: false,
          message: `Unable to pinpoint location for source: "${source}". Please check the spelling or select from suggestions.`
        });
      }
      sLat = geoSource.lat;
      sLng = geoSource.lng;
      sName = geoSource.displayName || source;
    }

    // 2. Resolve Intermediate Waypoints (if any)
    const resolvedWaypoints = [];
    if (waypoints && Array.isArray(waypoints)) {
      for (let i = 0; i < waypoints.length; i++) {
        const wp = waypoints[i];
        if (typeof wp === 'string' && wp.trim().length > 0) {
          const geoWp = await geocodeService.geocodeLocation(wp);
          if (geoWp) {
            resolvedWaypoints.push({ name: geoWp.displayName || wp, lat: geoWp.lat, lng: geoWp.lng });
          }
        } else if (wp && !isNaN(wp.lat) && !isNaN(wp.lng)) {
          resolvedWaypoints.push({ name: wp.name || wp.displayName || `Stop ${i + 1}`, lat: parseFloat(wp.lat), lng: parseFloat(wp.lng) });
        }
      }
    }

    // 3. Resolve Destination Coordinates
    if (destCoords && !isNaN(destCoords.lat) && !isNaN(destCoords.lng)) {
      dLat = parseFloat(destCoords.lat);
      dLng = parseFloat(destCoords.lng);
      dName = destCoords.displayName || destination;
    } else {
      const geoDest = await geocodeService.geocodeLocation(destination);
      if (!geoDest) {
        return res.status(404).json({
          success: false,
          message: `Unable to pinpoint location for destination: "${destination}". Please check the spelling or select from suggestions.`
        });
      }
      dLat = geoDest.lat;
      dLng = geoDest.lng;
      dName = geoDest.displayName || destination;
    }

    // 4. Assemble complete ordered path points: [Source, ...Waypoints, Destination]
    const allPoints = [
      { lat: sLat, lng: sLng, name: sName },
      ...resolvedWaypoints,
      { lat: dLat, lng: dLng, name: dName }
    ];

    // 5. Fetch real driving routes and turn maneuvers from OSRM
    const rawRoutes = await routingService.fetchDrivingRoutesWithWaypoints(allPoints);

    // 6. Calculate predictive fuel consumption, CO2 emissions, and apply multi-objective badges
    const optimizedRoutes = optimizerService.optimizeRoutes(rawRoutes, {
      ...fuelSettings,
      departureHour
    });

    let searchId = null;

    // 7. If user is authenticated, persist search query and computed routes in MySQL
    if (req.user && req.user.userId && saveToHistory !== false) {
      try {
        const [searchResult] = await db.query(
          `INSERT INTO search_history (user_id, source, destination, source_lat, source_lng, dest_lat, dest_lng)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [req.user.userId, sName, dName, sLat, sLng, dLat, dLng]
        );

        searchId = searchResult.insertId;

        // Persist each route linked to search_history
        for (const route of optimizedRoutes) {
          await db.query(
            `INSERT INTO routes (search_id, route_name, distance, duration, estimated_fuel_cost, route_type, geometry_geojson)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              searchId,
              route.routeName,
              route.distanceKm,
              route.durationMins,
              route.estimatedFuelCost,
              route.routeType,
              JSON.stringify(route.geometry || null)
            ]
          );
        }
      } catch (dbErr) {
        console.warn('[DBMS] Error persisting search history to MySQL:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      searchId,
      source: { name: sName, lat: sLat, lng: sLng },
      waypoints: resolvedWaypoints,
      destination: { name: dName, lat: dLat, lng: dLng },
      fuelSettings: {
        fuelType: fuelSettings?.fuelType || 'Petrol',
        mileage: parseFloat(fuelSettings?.mileage || 15.0),
        fuelPrice: parseFloat(fuelSettings?.fuelPrice || 102.5)
      },
      routesCount: optimizedRoutes.length,
      routes: optimizedRoutes,
      disclaimer: 'Fuel expense and CO2 estimates factor in road hierarchy and peak-hour traffic multipliers. Tolls and parking fees are excluded.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Recalculate fuel for currently displayed routes in memory
 * POST /api/routes/recalculate-fuel
 */
function recalculateFuel(req, res) {
  const { routes, fuelSettings, departureHour } = req.body;
  if (!routes || !Array.isArray(routes)) {
    return res.status(400).json({ success: false, message: 'Routes array required' });
  }

  const updatedRoutes = optimizerService.optimizeRoutes(routes, {
    ...fuelSettings,
    departureHour
  });

  return res.status(200).json({
    success: true,
    routes: updatedRoutes
  });
}

module.exports = {
  searchLocation,
  calculateRoute,
  recalculateFuel
};
