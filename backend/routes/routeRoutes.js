const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { routeLimiter } = require('../middleware/rateLimiter');
const { validateRouteCalculation } = require('../middleware/validateMiddleware');
const { optionalToken } = require('../middleware/authMiddleware');

// Autocomplete geocoding suggestions
router.get('/search-location', routeLimiter, routeController.searchLocation);

// Driving route calculation & multi-objective optimization (optional auth to save history)
router.post('/calculate', routeLimiter, optionalToken, validateRouteCalculation, routeController.calculateRoute);

// In-memory fuel cost recalculation for currently rendered routes
router.post('/recalculate-fuel', routeController.recalculateFuel);

module.exports = router;
