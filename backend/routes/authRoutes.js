const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// Public authentication routes (rate-limited and validated)
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);

// Protected user profile route
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
