-- =============================================
-- UPDATE PRODUCT IMAGE PATHS
-- Run this to match product images with photos in /photos folder
-- =============================================

USE ecommerce_db;

-- Update all product image paths to match actual photo files
UPDATE products SET image_path = '/photos/iphone.jpeg' WHERE id = 1;
UPDATE products SET image_path = '/photos/galaxy m33.jpeg' WHERE id = 2;
UPDATE products SET image_path = '/photos/dell laptop.jpeg' WHERE id = 3;
UPDATE products SET image_path = '/photos/levis jeans.jpeg' WHERE id = 4;
UPDATE products SET image_path = '/photos/nike air max.jpeg' WHERE id = 5;
UPDATE products SET image_path = '/photos/cooker.jpeg' WHERE id = 6;
UPDATE products SET image_path = '/photos/iron.jpeg' WHERE id = 7;
UPDATE products SET image_path = '/photos/ikigai.webp' WHERE id = 8;
UPDATE products SET image_path = '/photos/sapiens.webp' WHERE id = 9;
UPDATE products SET image_path = '/photos/yoga mat.jpeg' WHERE id = 10;
UPDATE products SET image_path = '/photos/lego set.jpeg' WHERE id = 12;

-- NEW PRODUCTS (added via admin panel)
UPDATE products SET image_path = '/photos/macbook.jpeg' WHERE LOWER(name) LIKE '%macbook%';
UPDATE products SET image_path = '/photos/java.jpeg' WHERE LOWER(name) LIKE '%java%';
UPDATE products SET image_path = '/photos/pan.jpeg' WHERE LOWER(name) LIKE '%pan%';
UPDATE products SET image_path = '/photos/television.jpeg' WHERE LOWER(name) LIKE '%tv%' OR LOWER(name) LIKE '%television%';

-- Verify the updates
SELECT id, name, image_path FROM products ORDER BY id;
