const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateFuelSettings } = require('../middleware/validateMiddleware');

// All fuel settings routes require strict JWT authentication
router.use(verifyToken);

router.get('/settings', fuelController.getFuelSettings);
router.put('/settings', validateFuelSettings, fuelController.updateFuelSettings);

module.exports = router;
