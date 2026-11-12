/**
 * =====================================================================
 * ROUTEWISE: FUEL PREFERENCES CONTROLLER
 * DBMS & Business Logic: Manages vehicle mileage and fuel rates
 * =====================================================================
 */

const db = require('../config/db');

/**
 * Retrieve user's saved fuel preferences
 * GET /api/fuel/settings
 */
async function getFuelSettings(req, res, next) {
  try {
    const userId = req.user.userId;

    const [rows] = await db.query(
      'SELECT fuel_type, mileage, fuel_price, updated_at FROM fuel_settings WHERE user_id = ?',
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        fuelSettings: {
          fuel_type: 'Petrol',
          mileage: 15.00,
          fuel_price: 102.50
        }
      });
    }

    return res.status(200).json({
      success: true,
      fuelSettings: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user's fuel preferences in MySQL
 * PUT /api/fuel/settings
 */
async function updateFuelSettings(req, res, next) {
  try {
    const userId = req.user.userId;
    const { fuel_type, mileage, fuel_price } = req.body;

    const fuelType = fuel_type || 'Petrol';
    const mileageVal = parseFloat(mileage);
    const priceVal = parseFloat(fuel_price);

    // Update or Insert (Upsert)
    const [existing] = await db.query(
      'SELECT setting_id FROM fuel_settings WHERE user_id = ?',
      [userId]
    );

    if (existing && existing.length > 0) {
      await db.query(
        'UPDATE fuel_settings SET fuel_type = ?, mileage = ?, fuel_price = ? WHERE user_id = ?',
        [fuelType, mileageVal, priceVal, userId]
      );
    } else {
      await db.query(
        'INSERT INTO fuel_settings (user_id, fuel_type, mileage, fuel_price) VALUES (?, ?, ?, ?)',
        [userId, fuelType, mileageVal, priceVal]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Fuel preferences saved successfully',
      fuelSettings: {
        fuel_type: fuelType,
        mileage: mileageVal,
        fuel_price: priceVal
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFuelSettings,
  updateFuelSettings
};
