/**
 * =====================================================================
 * ROUTEWISE: AUTHENTICATION CONTROLLER
 * Cyber Security & DBMS: bcrypt hashing, JWT issuance, parameterized SQL
 * =====================================================================
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'routewise_secure_jwt_secret_token_key_academic_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if email already registered (Parameterized Query)
    const [existingUsers] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Insert user into MySQL
    const [userResult] = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), passwordHash]
    );

    const userId = userResult.insertId;

    // Create default fuel preferences for user
    await db.query(
      'INSERT INTO fuel_settings (user_id, fuel_type, mileage, fuel_price) VALUES (?, ?, ?, ?)',
      [userId, 'Petrol', 15.00, 102.50]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, email: email.toLowerCase(), name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        userId,
        name,
        email: email.toLowerCase()
      },
      fuelSettings: {
        fuel_type: 'Petrol',
        mileage: 15.00,
        fuel_price: 102.50
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log in existing user
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Retrieve user record including hash (Parameterized Query)
    const [users] = await db.query(
      'SELECT user_id, name, email, password_hash FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination'
      });
    }

    const user = users[0];

    // Compare bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination'
      });
    }

    // Retrieve user fuel preferences
    const [fuelRows] = await db.query(
      'SELECT fuel_type, mileage, fuel_price FROM fuel_settings WHERE user_id = ?',
      [user.user_id]
    );

    const fuelSettings = fuelRows && fuelRows.length > 0 
      ? fuelRows[0] 
      : { fuel_type: 'Petrol', mileage: 15.00, fuel_price: 102.50 };

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return sanitized response without password_hash
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email
      },
      fuelSettings
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get currently authenticated user profile
 * GET /api/auth/me
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.userId;

    const [users] = await db.query(
      'SELECT user_id, name, email, created_at FROM users WHERE user_id = ?',
      [userId]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const [fuelRows] = await db.query(
      'SELECT fuel_type, mileage, fuel_price FROM fuel_settings WHERE user_id = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      user: users[0],
      fuelSettings: fuelRows?.[0] || { fuel_type: 'Petrol', mileage: 15.0, fuel_price: 102.5 }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile
};
