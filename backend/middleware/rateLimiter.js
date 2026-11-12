/**
 * =====================================================================
 * ROUTEWISE: RATE LIMITING MIDDLEWARE
 * Cyber Security Subject Integration: Protection against DoS & Brute Force
 * =====================================================================
 */

const rateLimit = require('express-rate-limit');

// Strict limiter for authentication endpoints (prevent brute-force password guessing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

// Route Calculation Limiter (protect external geocoding and OSRM upstream APIs)
const routeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Max 100 route queries per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many route requests submitted. Please wait a short while before calculating more routes.'
  }
});

// General Global API Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please throttle your requests.'
  }
});

module.exports = {
  authLimiter,
  routeLimiter,
  globalLimiter
};
