/**
 * =====================================================================
 * ROUTEWISE: ROUTE OPTIMIZER & FUEL CALCULATION SERVICE
 * Business Logic Layer: Computes fuel consumption, costs, and awards
 * multi-criteria recommendations (Fastest, Shortest, Cheapest, Recommended)
 * =====================================================================
 */

/**
 * Optimize routes based on travel time, distance, and vehicle fuel economics
 * @param {Array} rawRoutes - Routes retrieved from OSRM
 * @param {Object} fuelParams - { mileage, fuelPrice, fuelType }
 * @returns {Array} Enhanced routes with fuel metrics and recommendation badges
 */
function optimizeRoutes(rawRoutes, fuelParams = {}) {
  if (!rawRoutes || rawRoutes.length === 0) {
    return [];
  }

  // Sanitize and validate fuel parameters
  const mileage = Math.max(0.1, parseFloat(fuelParams.mileage) || 15.0);
  const fuelPrice = Math.max(0.1, parseFloat(fuelParams.fuelPrice) || 102.5);
  const fuelType = fuelParams.fuelType || 'Petrol';

  // 1. Calculate fuel requirements and costs for each route
  const routesWithCosts = rawRoutes.map(r => {
    // Fuel Required (Litres) = Distance (km) / Vehicle Mileage (km/L)
    const fuelRequiredLitres = parseFloat((r.distanceKm / mileage).toFixed(2));
    
    // Estimated Fuel Cost (INR) = Fuel Required × Fuel Price Per Litre
    const estimatedCost = parseFloat((fuelRequiredLitres * fuelPrice).toFixed(2));

    return {
      ...r,
      fuelType,
      mileage,
      fuelPrice,
      fuelRequiredLitres,
      estimatedFuelCost: estimatedCost,
      badges: []
    };
  });

  // 2. Determine best routes per criterion
  let minDuration = Infinity;
  let minDistance = Infinity;
  let minCost = Infinity;

  let fastestIndex = 0;
  let shortestIndex = 0;
  let cheapestIndex = 0;

  routesWithCosts.forEach((r, idx) => {
    if (r.durationMins < minDuration) {
      minDuration = r.durationMins;
      fastestIndex = idx;
    }
    if (r.distanceKm < minDistance) {
      minDistance = r.distanceKm;
      shortestIndex = idx;
    }
    if (r.estimatedFuelCost < minCost) {
      minCost = r.estimatedFuelCost;
      cheapestIndex = idx;
    }
  });

  // 3. Multi-objective score to find overall RECOMMENDED route
  // Normalized score: 60% duration weight, 40% fuel cost weight
  let bestScore = Infinity;
  let recommendedIndex = fastestIndex;

  routesWithCosts.forEach((r, idx) => {
    const normDuration = minDuration > 0 ? (r.durationMins / minDuration) : 1;
    const normCost = minCost > 0 ? (r.estimatedFuelCost / minCost) : 1;
    const combinedScore = (normDuration * 0.6) + (normCost * 0.4);

    if (combinedScore < bestScore) {
      bestScore = combinedScore;
      recommendedIndex = idx;
    }
  });

  // 4. Assign badges and primary categorization
  routesWithCosts.forEach((r, idx) => {
    const badges = [];

    if (idx === fastestIndex) {
      badges.push('FASTEST');
    }
    if (idx === shortestIndex) {
      badges.push('SHORTEST');
    }
    if (idx === cheapestIndex) {
      badges.push('CHEAPEST');
    }
    if (idx === recommendedIndex) {
      badges.push('RECOMMENDED');
    }

    r.badges = badges;

    // Primary route_type attribute for database storage
    if (idx === recommendedIndex) {
      r.routeType = 'recommended';
    } else if (idx === fastestIndex) {
      r.routeType = 'fastest';
    } else if (idx === shortestIndex) {
      r.routeType = 'shortest';
    } else if (idx === cheapestIndex) {
      r.routeType = 'cheapest';
    } else {
      r.routeType = 'alternative';
    }
  });

  return routesWithCosts;
}

module.exports = {
  optimizeRoutes
};
