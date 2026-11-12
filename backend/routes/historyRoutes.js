const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { verifyToken } = require('../middleware/authMiddleware');

// All history routes require strict JWT authentication
router.use(verifyToken);

// User search history CRUD & Analytics
router.get('/', historyController.getHistory);
router.get('/analytics/stats', historyController.getAnalytics);
router.post('/:searchId/recalculate', historyController.recalculateRoute);
router.delete('/:searchId', historyController.deleteHistory);

module.exports = router;
