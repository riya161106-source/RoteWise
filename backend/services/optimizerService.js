/**
 * =====================================================================
 * ROUTEWISE: ROUTE OPTIMIZER & AI/ML PREDICTIVE FUEL & EMISSION ENGINE
 * Business Logic Layer: Predictive fuel consumption, carbon emissions (CO2),
 * time-of-day traffic models, and multi-objective recommendation badges
 * =====================================================================
 */

/**
 * Determine Time-of-Day Traffic Congestion Factor (Ct)
 * Peak morning rush hours (8-10 AM) and evening rush hours (5-8 PM) add idling and deceleration penalties
 */
function getTrafficCongestionFactor(departureHour = null) {
  const currentHour = departureHour !== null ? departureHour : new Date().getHours();

  if (currentHour >= 8 && currentHour <= 10) {
    return { factor: 1.18, period: 'Morning Rush Hour (+18% fuel penalty)' };
  } else if (currentHour >= 17 && currentHour <= 20) {
    return { factor: 1.22, period: 'Evening Rush Hour (+22% fuel penalty)' };
  } else if (currentHour >= 23 || currentHour <= 5) {
    return { factor: 0.95, period: 'Night Off-Peak (-5% fuel efficiency gain)' };
  }
  return { factor: 1.0, period: 'Normal Daytime Traffic Flow' };
}

/**
 * AI/ML Predictive Fuel Consumption & CO2 Engine
 * Evaluates route segment road complexity (turn density, average velocity)
 * @param {Array} rawRoutes - Routes retrieved from OSRM
 * @param {Object} fuelParams - { mileage, fuelPrice, fuelType, departureHour }
 * @returns {Array} Enhanced routes with ML fuel estimates, CO2 emissions, and badges
 */
function optimizeRoutes(rawRoutes, fuelParams = {}) {
  if (!rawRoutes || rawRoutes.length === 0) {
    return [];
  }

  // 1. Sanitize user vehicle parameters
  const mileage = Math.max(0.1, parseFloat(fuelParams.mileage) || 15.0);
  const fuelPrice = Math.max(0.1, parseFloat(fuelParams.fuelPrice) || 102.5);
  const fuelType = fuelParams.fuelType || 'Petrol';

  // Carbon emission factor (kg CO2 per litre of fuel)
  // Standard IPCC / EPA emissions factors
  const co2FactorPerLitre = fuelType === 'Diesel' ? 2.68 : 2.31;

  // Traffic time factor
  const trafficModel = getTrafficCongestionFactor(fuelParams.departureHour);

  // 2. Compute predictive fuel consumption & CO2 for each route
  const routesWithCosts = rawRoutes.map(r => {
    // Basic baseline fuel required
    const baseFuelRequired = r.distanceKm / mileage;

    // Road complexity adjustment:
    // Routes with high step count / turn density per km indicate city streets with more idling
    const stepDensity = r.distanceKm > 0 ? ((r.stepsCount || 10) / r.distanceKm) : 0.1;
    const roadTypePenalty = stepDensity > 0.4 ? 1.08 : (stepDensity < 0.1 ? 0.96 : 1.0); // +8% city, -4% highway cruising

    // Predictive Fuel Required (Litres) = Base × Traffic Factor × Road Complexity
    const predictiveFuelRequired = parseFloat((baseFuelRequired * trafficModel.factor * roadTypePenalty).toFixed(2));
    
    // Estimated Fuel Cost (INR)
    const estimatedCost = parseFloat((predictiveFuelRequired * fuelPrice).toFixed(2));

    // CO2 Carbon Footprint in Kilograms
    const co2EmissionsKg = parseFloat((predictiveFuelRequired * co2FactorPerLitre).toFixed(2));

    // Tree absorption offset (1 mature tree absorbs ~21.8 kg CO2/year)
    const treesNeededToOffset = parseFloat((co2EmissionsKg / 21.8).toFixed(2));

    return {
      ...r,
      fuelType,
      mileage,
      fuelPrice,
      trafficModel: trafficModel.period,
      trafficMultiplier: trafficModel.factor,
      fuelRequiredLitres: predictiveFuelRequired,
      estimatedFuelCost: estimatedCost,
      co2EmissionsKg: co2EmissionsKg,
      treesNeededToOffset: treesNeededToOffset,
      badges: []
    };
  });

  // 3. Determine best routes per criterion
  let minDuration = Infinity;
  let minDistance = Infinity;
  let minCost = Infinity;
  let minEmissions = Infinity;

  let fastestIndex = 0;
  let shortestIndex = 0;
  let cheapestIndex = 0;
  let ecoIndex = 0;

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
    if (r.co2EmissionsKg < minEmissions) {
      minEmissions = r.co2EmissionsKg;
      ecoIndex = idx;
    }
  });

  // 4. Multi-objective trade-off score for RECOMMENDED badge
  // 50% duration weight, 30% fuel cost weight, 20% eco footprint
  let bestScore = Infinity;
  let recommendedIndex = fastestIndex;

  routesWithCosts.forEach((r, idx) => {
    const normDuration = minDuration > 0 ? (r.durationMins / minDuration) : 1;
    const normCost = minCost > 0 ? (r.estimatedFuelCost / minCost) : 1;
    const normEco = minEmissions > 0 ? (r.co2EmissionsKg / minEmissions) : 1;
    const combinedScore = (normDuration * 0.5) + (normCost * 0.3) + (normEco * 0.2);

    if (combinedScore < bestScore) {
      bestScore = combinedScore;
      recommendedIndex = idx;
    }
  });

  // 5. Assign badges
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
    if (idx === ecoIndex) {
      badges.push('ECO-FRIENDLY');
    }
    if (idx === recommendedIndex) {
      badges.push('RECOMMENDED');
    }

    r.badges = badges;

    // Database route_type categorization
    if (idx === recommendedIndex) {
      r.routeType = 'recommended';
    } else if (idx === fastestIndex) {
      r.routeType = 'fastest';
    } else if (idx === shortestIndex) {
      r.routeType = 'shortest';
    } else if (idx === cheapestIndex) {
      r.routeType = 'cheapest';
    } else if (idx === ecoIndex) {
      r.routeType = 'eco-friendly';
    } else {
      r.routeType = 'alternative';
    }
  });

  return routesWithCosts;
}

module.exports = {
  optimizeRoutes,
  getTrafficCongestionFactor
};
