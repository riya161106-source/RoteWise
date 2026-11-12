-- =====================================================================
-- ROUTEWISE: SAMPLE SEED DATA
-- DBMS Subject Integration: Test Users, Fuel Preferences, History & Routes
-- =====================================================================

USE routewise_db;

-- Insert sample users
-- Note: 'password123' bcrypt hash ($2a$10$7s26mZvhYI1fOQ0lO9M/eupg6u23X1jZ0w1XvA6L5P4E8M7K0Q6i6)
INSERT INTO users (user_id, name, email, password_hash, created_at) VALUES
(1, 'Aditya Sharma', 'aditya.sharma@example.com', '$2a$10$SKydIpbt5BbhPm3MUo3GsOrlseCAcGlANefjgh2908wq0ytsQgQxu', NOW() - INTERVAL 10 DAY),
(2, 'Priya Patel', 'priya.patel@example.com', '$2a$10$SKydIpbt5BbhPm3MUo3GsOrlseCAcGlANefjgh2908wq0ytsQgQxu', NOW() - INTERVAL 5 DAY)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert fuel settings for sample users
INSERT INTO fuel_settings (setting_id, user_id, fuel_type, mileage, fuel_price, updated_at) VALUES
(1, 1, 'Petrol', 16.50, 102.86, NOW() - INTERVAL 10 DAY),
(2, 2, 'Diesel', 21.00, 88.50, NOW() - INTERVAL 5 DAY)
ON DUPLICATE KEY UPDATE mileage=VALUES(mileage), fuel_price=VALUES(fuel_price);

-- Insert sample search history
INSERT INTO search_history (search_id, user_id, source, destination, source_lat, source_lng, dest_lat, dest_lng, search_date) VALUES
(1, 1, 'Bengaluru, Karnataka', 'Mysuru, Karnataka', 12.9715987, 77.5945627, 12.2958104, 76.6393805, NOW() - INTERVAL 3 DAY),
(2, 1, 'Koramangala, Bengaluru', 'Kempegowda International Airport, Bengaluru', 12.9351740, 77.6244806, 13.1986348, 77.7065928, NOW() - INTERVAL 1 DAY),
(3, 2, 'Mumbai, Maharashtra', 'Pune, Maharashtra', 19.0760900, 72.8774260, 18.5204303, 73.8567437, NOW() - INTERVAL 2 DAY)
ON DUPLICATE KEY UPDATE source=VALUES(source);

-- Insert sample routes associated with searches
INSERT INTO routes (route_id, search_id, route_name, distance, duration, estimated_fuel_cost, route_type) VALUES
-- Search 1 routes (Bengaluru to Mysuru)
(1, 1, 'Bengaluru - Nidaghatta - Mysuru Expressway', 143.20, 135.00, 892.73, 'fastest'),
(2, 1, 'Via Kanakapura & Malavalli (NH 209 / NH 948)', 158.40, 190.00, 987.49, 'alternative'),
(3, 1, 'Via Kunigal & Pandavapura', 168.10, 210.00, 1047.90, 'alternative'),

-- Search 2 routes (Koramangala to Airport)
(4, 2, 'Via Bellary Road & Hebbal Flyover', 41.50, 68.00, 258.62, 'fastest'),
(5, 2, 'Via SH 104 & Budigere Cross (Less Signals)', 44.20, 75.00, 275.45, 'alternative'),

-- Search 3 routes (Mumbai to Pune)
(6, 3, 'Mumbai - Pune Expressway', 148.50, 165.00, 625.82, 'fastest'),
(7, 3, 'Old Mumbai - Pune Highway (NH 48)', 154.00, 220.00, 649.00, 'shortest')
ON DUPLICATE KEY UPDATE distance=VALUES(distance);
