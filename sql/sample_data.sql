u-- =============================================
-- E-COMMERCE SAMPLE DATA - Indian Context
-- Password for all users: password123
-- =============================================

USE ecommerce_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- 1. USERS (5 users - 4 customers + 1 admin)
-- =============================================
-- BCrypt hash for "password123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, created_at, updated_at) VALUES
(1, 'raj.sharma@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Raj', 'Sharma', '9876543210', 'CUSTOMER', NOW(), NOW()),
(2, 'priya.patel@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Priya', 'Patel', '9876543211', 'CUSTOMER', NOW(), NOW()),
(3, 'amit.kumar@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Amit', 'Kumar', '9876543212', 'CUSTOMER', NOW(), NOW()),
(4, 'sneha.singh@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sneha', 'Singh', '9876543213', 'CUSTOMER', NOW(), NOW()),
(5, 'admin@ecommerce.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', '9999999999', 'ADMIN', NOW(), NOW());

-- =============================================
-- 2. CATEGORIES (5 categories)
-- =============================================
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES
(1, 'Electronics', 'electronics', 'Mobile phones, laptops, and electronic gadgets', NOW(), NOW()),
(2, 'Fashion', 'fashion', 'Clothing, footwear, and accessories', NOW(), NOW()),
(3, 'Home & Kitchen', 'home-kitchen', 'Home appliances and kitchen essentials', NOW(), NOW()),
(4, 'Books', 'books', 'Fiction, non-fiction, and educational books', NOW(), NOW()),
(5, 'Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness accessories', NOW(), NOW());

-- =============================================
-- 3. PRODUCTS (10 products - All in INR)
-- =============================================
INSERT INTO products (id, sku, name, description, base_price, tax, discount, stock, category_id, image_path, version, created_at, updated_at) VALUES
-- Electronics (Category 1)
(1, 'IPHONE14-128', 'iPhone 14 128GB', 'Apple iPhone 14 with A15 Bionic chip, 6.1-inch display, and dual camera system', 79900.00, 18.00, 5.00, 25, 1, '/photos/iphone.jpeg', 0, NOW(), NOW()),
(2, 'SAMSUNG-M33', 'Samsung Galaxy M33 5G', 'Samsung Galaxy M33 with 6GB RAM, 128GB storage, and 6000mAh battery', 16999.00, 18.00, 10.00, 40, 1, '/photos/galaxy m33.jpeg', 0, NOW(), NOW()),
(3, 'DELL-LAPTOP', 'Dell Inspiron 15 Laptop', 'Dell Inspiron 15 with Intel i5 11th Gen, 8GB RAM, 512GB SSD', 52990.00, 18.00, 8.00, 15, 1, '/photos/dell laptop.jpeg', 0, NOW(), NOW()),

-- Fashion (Category 2)
(4, 'LEVIS-JEANS', 'Levis 511 Slim Fit Jeans', 'Levis 511 Slim Fit Jeans for men - Dark Blue', 2999.00, 12.00, 20.00, 50, 2, '/photos/levis jeans.jpeg', 0, NOW(), NOW()),
(5, 'NIKE-SHOES', 'Nike Air Max Running Shoes', 'Nike Air Max running shoes for men with air cushioning', 5499.00, 12.00, 15.00, 30, 2, '/photos/nike air max.jpeg', 0, NOW(), NOW()),

-- Home & Kitchen (Category 3)
(6, 'PRESTIGE-COOKER', 'Prestige Pressure Cooker 5L', 'Prestige Deluxe Alpha Stainless Steel Pressure Cooker, 5 Litres', 2199.00, 18.00, 12.00, 60, 3, '/photos/cooker.jpeg', 0, NOW(), NOW()),
(7, 'PHILIPS-IRON', 'Philips Steam Iron', 'Philips GC1905 1440-Watt Steam Iron with spray', 1295.00, 18.00, 10.00, 45, 3, '/photos/iron.jpeg', 0, NOW(), NOW()),

-- Books (Category 4)
(8, 'IKIGAI-BOOK', 'Ikigai: The Japanese Secret', 'Ikigai: The Japanese Secret to a Long and Happy Life by Héctor García', 299.00, 0.00, 15.00, 100, 4, '/photos/ikigai.webp', 0, NOW(), NOW()),
(9, 'SAPIENS-BOOK', 'Sapiens: A Brief History', 'Sapiens: A Brief History of Humankind by Yuval Noah Harari', 499.00, 0.00, 20.00, 80, 4, '/photos/sapiens.webp', 0, NOW(), NOW()),

-- Sports & Fitness (Category 5)
(10, 'YOGA-MAT', 'Anti-Skid Yoga Mat', 'Premium quality anti-skid yoga mat with carrying strap - 6mm thick', 799.00, 18.00, 25.00, 70, 5, '/photos/yoga mat.jpeg', 0, NOW(), NOW());

-- =============================================
-- 4. CARTS (Auto-created for users)
-- =============================================
INSERT INTO carts (id, user_id, created_at, updated_at) VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(3, 3, NOW(), NOW()),
(4, 4, NOW(), NOW()),
(5, 5, NOW(), NOW());

-- =============================================
-- 5. CART ITEMS (Sample items in Raj's cart)
-- =============================================
-- Raj Sharma (user 1) has 2 items in cart
INSERT INTO cart_items (id, cart_id, product_id, quantity, unit_price, created_at, updated_at) VALUES
(1, 1, 1, 1, 89431.95, NOW(), NOW()),  -- iPhone 14 (final price)
(2, 1, 8, 2, 254.15, NOW(), NOW());    -- Ikigai Book (final price)

-- =============================================
-- 6. ORDERS (3 sample orders)
-- =============================================
INSERT INTO orders (id, order_number, user_id, status, total_amount, shipping_address, payment_method, payment_status, created_at, updated_at) VALUES
(1, 'ORD-20241128-001', 2, 'DELIVERED', 5242.86, 'Flat 302, Shanti Apartments, MG Road, Pune, Maharashtra - 411001', 'CARD', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
(2, 'ORD-20241128-002', 3, 'SHIPPED', 57426.48, 'A-45, Green Park Society, Satellite Road, Ahmedabad, Gujarat - 380015', 'UPI', 'SUCCESS', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(3, 'ORD-20241128-003', 4, 'CONFIRMED', 2082.08, 'House No 23, Sector 12, Chandigarh - 160012', 'COD', 'PENDING', NOW(), NOW());

-- =============================================
-- 7. ORDER ITEMS (Details for above orders)
-- =============================================
-- Order 1 items (Priya - Nike Shoes)
INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
(1, 1, 5, 'Nike Air Max Running Shoes', 5242.86, 1, 5242.86);

-- Order 2 items (Amit - Dell Laptop)
INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
(2, 2, 3, 'Dell Inspiron 15 Laptop', 57426.48, 1, 57426.48);

-- Order 3 items (Sneha - Iron + Yoga Mat)
INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
(3, 3, 7, 'Philips Steam Iron', 1375.89, 1, 1375.89),
(4, 3, 10, 'Anti-Skid Yoga Mat', 706.19, 1, 706.19);

-- =============================================
-- 8. REVIEWS (5 sample reviews)
-- =============================================
INSERT INTO reviews (id, product_id, user_id, rating, comment, created_at) VALUES
(1, 1, 2, 5, 'Excellent phone! Camera quality is amazing and battery life is great. Worth every rupee!', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 5, 2, 4, 'Very comfortable shoes. Good for daily running. Delivery was quick.', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 3, 3, 5, 'Best laptop in this price range. Fast performance and good build quality. Highly recommended!', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 8, 4, 5, 'Life-changing book! Must read for everyone. Quick delivery by seller.', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 6, 1, 4, 'Good quality pressure cooker. Works perfectly. Value for money product.', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
SELECT '✅ Data inserted successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_reviews FROM reviews;

-- Show sample data
SELECT 'Sample Products:' as info;
SELECT id, name, base_price,
       ROUND(base_price * (1 - discount/100) * (1 + tax/100), 2) as final_price,
       stock
FROM products
LIMIT 5;

SELECT 'Sample Orders:' as info;
SELECT order_number,
       (SELECT first_name FROM users WHERE id = orders.user_id) as customer,
       status,
       total_amount
FROM orders;
