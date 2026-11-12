/**
 * =====================================================================
 * ROUTEWISE: AUTHENTICATION MIDDLEWARE
 * Cyber Security Subject Integration: Stateless JWT Verification
 * =====================================================================
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'routewise_secure_jwt_secret_token_key_academic_2026';

/**
 * Strict Authentication Middleware
 * Enforces valid Bearer JWT on protected endpoints
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Missing Authorization Header'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Malformed Authorization token format (Expected: Bearer <token>)'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, name, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session Expired: Please log in again'
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or tampered token'
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user context if valid JWT is present, but permits guest requests
 */
function optionalToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    try {
      const decoded = jwt.verify(parts[1], JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      req.user = null;
    }
  }
  next();
}

module.exports = {
  verifyToken,
  optionalToken
};
