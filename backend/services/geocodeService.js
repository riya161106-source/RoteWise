/**
 * =====================================================================
 * ROUTEWISE: GEOCODING SERVICE
 * External Services Layer: Photon Geocoding API (OpenStreetMap based)
 * =====================================================================
 */

const axios = require('axios');

const PHOTON_API_URL = process.env.PHOTON_API_URL || 'https://photon.komoot.io';

// Fallback coordinates for common landmark locations if external geocoding times out
const FALLBACK_CITIES = {
  'bengaluru': { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9715987, lng: 77.5945627 },
  'bangalore': { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9715987, lng: 77.5945627 },
  'mysuru': { name: 'Mysuru', state: 'Karnataka', country: 'India', lat: 12.2958104, lng: 76.6393805 },
  'mysore': { name: 'Mysuru', state: 'Karnataka', country: 'India', lat: 12.2958104, lng: 76.6393805 },
  'mumbai': { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760900, lng: 72.8774260 },
  'pune': { name: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204303, lng: 73.8567437 },
  'delhi': { name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139391, lng: 77.2090212 },
  'new delhi': { name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139391, lng: 77.2090212 },
  'hyderabad': { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850440, lng: 78.4866710 },
  'chennai': { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0826802, lng: 80.2707184 },
  'kolkata': { name: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726460, lng: 88.3638950 },
  'ahmedabad': { name: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225050, lng: 72.5713621 },
  'jaipur': { name: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124336, lng: 75.7872709 }
};

/**
 * Search locations via Photon API
 * @param {string} query - Location name or address
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} List of geocoded locations with lat/lng
 */
async function searchLocations(query, limit = 5) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.trim();

  try {
    const response = await axios.get(`${PHOTON_API_URL}/api/`, {
      params: {
        q: cleanQuery,
        limit: limit
      },
      timeout: 5000
    });

    if (response.data && response.data.features && response.data.features.length > 0) {
      return response.data.features.map(f => {
        const p = f.properties || {};
        const coords = f.geometry ? f.geometry.coordinates : [0, 0];
        
        const nameParts = [p.name, p.city || p.district, p.state, p.country].filter(Boolean);
        const displayName = nameParts.length > 0 ? nameParts.join(', ') : (p.name || cleanQuery);

        return {
          name: p.name || cleanQuery,
          city: p.city || p.district || '',
          state: p.state || '',
          country: p.country || '',
          postcode: p.postcode || '',
          displayName: displayName,
          lng: coords[0],
          lat: coords[1]
        };
      });
    }
  } catch (error) {
    console.warn(`[Geocode Service] Photon API warning for "${cleanQuery}":`, error.message);
  }

  // Fallback to static city match if Photon was unreachable or timed out
  const lowerQ = cleanQuery.toLowerCase();
  for (const [key, city] of Object.entries(FALLBACK_CITIES)) {
    if (lowerQ.includes(key) || key.includes(lowerQ)) {
      return [{
        name: city.name,
        city: city.name,
        state: city.state,
        country: city.country,
        displayName: `${city.name}, ${city.state}, ${city.country}`,
        lat: city.lat,
        lng: city.lng
      }];
    }
  }

  return [];
}

/**
 * Geocode a single location address into [lat, lng]
 */
async function geocodeLocation(address) {
  const results = await searchLocations(address, 1);
  if (results && results.length > 0) {
    return {
      displayName: results[0].displayName,
      lat: results[0].lat,
      lng: results[0].lng
    };
  }
  return null;
}

module.exports = {
  searchLocations,
  geocodeLocation
};
