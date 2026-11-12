-- =====================================================================
-- ROUTEWISE: SMART ROUTE PLANNING AND OPTIMIZATION SYSTEM
-- DBMS Subject Integration: MySQL Relational Database Schema (3NF)
-- =====================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS routewise_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE routewise_db;

-- ---------------------------------------------------------------------
-- Table: users
-- Represents registered users authenticated via bcrypt password hashing
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: fuel_settings
-- Stores user vehicle preferences (Mileage and Fuel Prices)
-- 1-to-1 or 1-to-many relationship with users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fuel_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fuel_type ENUM('Petrol', 'Diesel') NOT NULL DEFAULT 'Petrol',
    mileage DECIMAL(6, 2) NOT NULL DEFAULT 15.00 COMMENT 'km per litre',
    fuel_price DECIMAL(6, 2) NOT NULL DEFAULT 102.50 COMMENT 'price in INR per litre',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fuel_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_mileage_positive CHECK (mileage > 0),
    CONSTRAINT chk_price_positive CHECK (fuel_price > 0),
    INDEX idx_fuel_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: search_history
-- Records each route planning query conducted by authenticated users
-- 1-to-many relationship with users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS search_history (
    search_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    source_lat DECIMAL(10, 7) NULL,
    source_lng DECIMAL(10, 7) NULL,
    dest_lat DECIMAL(10, 7) NULL,
    dest_lng DECIMAL(10, 7) NULL,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_search_user_date (user_id, search_date DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: routes
-- Stores computed alternative routes associated with a search query
-- 1-to-many relationship with search_history
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    search_id INT NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    distance DECIMAL(8, 2) NOT NULL COMMENT 'Distance in kilometres',
    duration DECIMAL(8, 2) NOT NULL COMMENT 'Duration in minutes',
    estimated_fuel_cost DECIMAL(10, 2) NOT NULL COMMENT 'Calculated cost in INR',
    route_type VARCHAR(50) NOT NULL DEFAULT 'standard' COMMENT 'fastest, shortest, cheapest, recommended, alternative',
    geometry_geojson MEDIUMTEXT NULL COMMENT 'GeoJSON coordinates string for route polyline visualization',
    CONSTRAINT fk_route_search
        FOREIGN KEY (search_id) REFERENCES search_history(search_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_route_search (search_id),
    INDEX idx_route_type (route_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
