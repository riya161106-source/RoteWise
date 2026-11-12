/**
 * =====================================================================
 * ROUTEWISE: INPUT VALIDATION & SANITIZATION MIDDLEWARE
 * Cyber Security Subject Integration: Protection against injection & bad data
 * =====================================================================
 */

const { body, query, validationResult } = require('express-validator');

// Validation error handler middleware
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map(err => ({ field: err.path, msg: err.msg }))
    });
  }
  next();
}

// Validation rules for User Registration
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Validation rules for User Login
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Validation rules for Fuel Settings
const validateFuelSettings = [
  body('fuel_type')
    .optional()
    .isIn(['Petrol', 'Diesel']).withMessage('Fuel type must be either Petrol or Diesel'),
  body('mileage')
    .isFloat({ min: 0.1, max: 100.0 }).withMessage('Vehicle mileage must be a valid number between 0.1 and 100 km/L'),
  body('fuel_price')
    .isFloat({ min: 1.0, max: 500.0 }).withMessage('Fuel price must be a valid number between ₹1 and ₹500 per litre'),
  handleValidationErrors
];

// Validation rules for Route Calculation
const validateRouteCalculation = [
  body('source')
    .trim()
    .notEmpty().withMessage('Source location is required')
    .escape(),
  body('destination')
    .trim()
    .notEmpty().withMessage('Destination location is required')
    .escape(),
  body('source')
    .custom((value, { req }) => {
      if (value.toLowerCase().trim() === (req.body.destination || '').toLowerCase().trim()) {
        throw new Error('Source and destination cannot be the same location');
      }
      return true;
    }),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateFuelSettings,
  validateRouteCalculation
};
