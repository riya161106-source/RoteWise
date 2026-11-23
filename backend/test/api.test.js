/**
 * =====================================================================
 * ROUTEWISE: AUTOMATED UNIT & INTEGRATION TEST SUITE
 * Uses Node.js native test runner (node:test & node:assert)
 * =====================================================================
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const optimizerService = require('../services/optimizerService');
const routingService = require('../services/routingService');
const geocodeService = require('../services/geocodeService');
const db = require('../config/db');

describe('RouteWise System Test Suite', () => {

  test('1. Geocode Service Fallback Test', async () => {
    const locations = await geocodeService.searchLocations('Bengaluru', 2);
    assert.ok(locations.length > 0, 'Geocode should return at least 1 location');
    assert.ok(locations[0].lat !== undefined, 'Location must have latitude');
    assert.ok(locations[0].lng !== undefined, 'Location must have longitude');
  });

  test('2. Routing Service Offline Fallback & Step Parsing', async () => {
    const points = [
      { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
      { lat: 12.2958, lng: 76.6394, name: 'Mysuru' }
    ];
    const routes = await routingService.fetchDrivingRoutesWithWaypoints(points);
    assert.ok(routes.length >= 1, 'Should return at least 1 route');
    assert.ok(routes[0].distanceKm > 0, 'Distance must be positive');
    assert.ok(routes[0].durationMins > 0, 'Duration must be positive');
    assert.ok(routes[0].steps && routes[0].steps.length > 0, 'Steps array must be populated');
  });

  test('3. AI/ML Optimizer & CO2 Emission Formulas', () => {
    const sampleRoutes = [
      {
        routeIndex: 0,
        routeName: 'Route 1',
        distanceKm: 150,
        durationMins: 120,
        stepsCount: 15
      },
      {
        routeIndex: 1,
        routeName: 'Route 2',
        distanceKm: 140,
        durationMins: 135,
        stepsCount: 25
      }
    ];

    const optimized = optimizerService.optimizeRoutes(sampleRoutes, {
      mileage: 15.0,
      fuelPrice: 100.0,
      fuelType: 'Petrol',
      departureHour: 9 // Peak morning
    });

    assert.strictEqual(optimized.length, 2, 'Must return 2 optimized routes');
    assert.ok(optimized[0].fuelRequiredLitres > 0, 'Fuel required must be positive');
    assert.ok(optimized[0].estimatedFuelCost > 0, 'Fuel cost must be positive');
    assert.ok(optimized[0].co2EmissionsKg > 0, 'CO2 emissions must be positive');
    assert.ok(optimized.some(r => r.badges.includes('FASTEST')), 'One route must be FASTEST');
    assert.ok(optimized.some(r => r.badges.includes('SHORTEST')), 'One route must be SHORTEST');
    assert.ok(optimized.some(r => r.badges.includes('ECO-FRIENDLY')), 'One route must be ECO-FRIENDLY');
  });

  test('4. Relational Database Operations', async () => {
    // Parameterized SELECT query
    const [users] = await db.query('SELECT user_id, name, email FROM users WHERE user_id = ?', [1]);
    assert.ok(users.length === 1, 'Should return user with id 1');
    assert.strictEqual(users[0].name, 'Aditya Sharma');

    // Aggregate Analytics query
    const [analytics] = await db.query('SELECT COUNT(DISTINCT sh.search_id) AS total_searches FROM search_history sh WHERE sh.user_id = ?', [1]);
    assert.ok(analytics.length > 0, 'Aggregate query must return results');
  });

});
