/**
 * =====================================================================
 * ROUTEWISE: ROUTING SERVICE
 * External Services Layer: OSRM (Open Source Routing Machine) API
 * Fetches real driving routes, distances, durations, and geometries
 * =====================================================================
 */

const axios = require('axios');

const OSRM_API_URL = process.env.OSRM_API_URL || 'https://router.project-osrm.org';

/**
 * Fetch real driving routes between source and destination coordinates
 * @param {number} startLat - Source Latitude
 * @param {number} startLng - Source Longitude
 * @param {number} endLat - Destination Latitude
 * @param {number} endLng - Destination Longitude
 * @returns {Promise<Array>} List of real driving routes from OSRM
 */
async function fetchDrivingRoutes(startLat, startLng, endLat, endLng) {
  // Validate coordinates
  const sLat = parseFloat(startLat);
  const sLng = parseFloat(startLng);
  const dLat = parseFloat(endLat);
  const dLng = parseFloat(endLng);

  if (isNaN(sLat) || isNaN(sLng) || isNaN(dLat) || isNaN(dLng)) {
    throw new Error('Invalid coordinate inputs provided for route calculation');
  }

  // OSRM expects coordinates in {longitude},{latitude} format
  const coordsString = `${sLng},${sLat};${dLng},${dLat}`;
  const requestUrl = `${OSRM_API_URL}/route/v1/driving/${coordsString}?overview=full&geometries=geojson&alternatives=true&steps=true`;

  try {
    const response = await axios.get(requestUrl, { timeout: 12000 });
    const data = response.data;

    if (!data || data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error(data?.message || 'No drivable route found between these locations.');
    }

    // Process and normalize returned routes
    const routes = data.routes.map((r, index) => {
      const distanceKm = parseFloat((r.distance / 1000).toFixed(2));
      const durationMins = parseFloat((r.duration / 60).toFixed(1));
      
      // Extract prominent road names from route legs/steps to create descriptive route names
      let primaryRoadName = '';
      if (r.legs && r.legs[0] && r.legs[0].steps) {
        const stepNames = r.legs[0].steps
          .map(step => step.name)
          .filter(name => name && name.trim().length > 0 && !name.toLowerCase().includes('way'));
        
        // Pick most frequent or unique prominent road names
        const uniqueNames = [...new Set(stepNames)].slice(0, 2);
        if (uniqueNames.length > 0) {
          primaryRoadName = `Via ${uniqueNames.join(' & ')}`;
        }
      }

      const defaultName = index === 0 ? 'Primary Driving Route' : `Alternative Route ${index + 1}`;
      const routeName = primaryRoadName ? `${primaryRoadName} (${index === 0 ? 'Primary' : 'Alt ' + index})` : defaultName;

      return {
        routeIndex: index,
        routeName: routeName,
        distanceKm: distanceKm,
        durationMins: durationMins,
        geometry: r.geometry, // GeoJSON { type: "LineString", coordinates: [[lng, lat], ...] }
        summary: r.legs?.[0]?.summary || ''
      };
    });

    return routes;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(`OSRM Routing Error: ${error.response.data.message}`);
    }
    throw new Error(`Failed to calculate routes: ${error.message}`);
  }
}

module.exports = {
  fetchDrivingRoutes
};
