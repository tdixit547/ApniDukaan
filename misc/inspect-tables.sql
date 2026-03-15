-- =========================================
-- E-commerce Database Inspection Script
-- =========================================

-- Use the e-commerce database
USE ecommerce_db;

-- Show all tables
SELECT '========== ALL TABLES ==========' AS '';
SHOW TABLES;

-- Show table structures
SELECT '\n========== USERS TABLE ==========' AS '';
DESCRIBE users;

SELECT '\n========== CATEGORIES TABLE ==========' AS '';
DESCRIBE categories;

SELECT '\n========== PRODUCTS TABLE ==========' AS '';
DESCRIBE products;

SELECT '\n========== CARTS TABLE ==========' AS '';
DESCRIBE carts;

SELECT '\n========== CART_ITEMS TABLE ==========' AS '';
DESCRIBE cart_items;

SELECT '\n========== ORDERS TABLE ==========' AS '';
DESCRIBE orders;

SELECT '\n========== ORDER_ITEMS TABLE ==========' AS '';
DESCRIBE order_items;

SELECT '\n========== REVIEWS TABLE ==========' AS '';
DESCRIBE reviews;

-- Show all constraints
SELECT '\n========== UNIQUE CONSTRAINTS ==========' AS '';
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    INDEX_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'ecommerce_db' AND NON_UNIQUE = 0
ORDER BY TABLE_NAME, INDEX_NAME;

-- Show all foreign keys
SELECT '\n========== FOREIGN KEY RELATIONSHIPS ==========' AS '';
SELECT
    CONCAT(TABLE_NAME, '.', COLUMN_NAME) AS 'Foreign Key',
    CONCAT(REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME) AS 'References',
    CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'ecommerce_db'
ORDER BY TABLE_NAME;

-- Count rows in each table
SELECT '\n========== ROW COUNTS ==========' AS '';
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'carts', COUNT(*) FROM carts
UNION ALL
SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- Show version column on products (for optimistic locking)
SELECT '\n========== PRODUCTS VERSION COLUMN (Optimistic Locking) ==========' AS '';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ecommerce_db'
  AND TABLE_NAME = 'products'
  AND COLUMN_NAME = 'version';

-- Show enum values
SELECT '\n========== ENUM-LIKE COLUMNS ==========' AS '';
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ecommerce_db'
  AND (COLUMN_NAME LIKE '%status%' OR COLUMN_NAME LIKE '%method%' OR COLUMN_NAME = 'role')
ORDER BY TABLE_NAME, COLUMN_NAME;

