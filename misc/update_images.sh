#!/bin/bash

# =============================================
# Apply Product Image Updates
# =============================================

echo "🖼️  Updating product images in database..."
echo ""

# Check if MySQL is accessible
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL command not found. Please ensure MySQL is installed and in PATH."
    echo ""
    echo "Alternative: Run the SQL file manually in your MySQL client:"
    echo "   mysql -u root -p ecommerce_db < sql/update_product_images.sql"
    exit 1
fi

# Read password (if not provided)
read -s -p "Enter MySQL root password: " MYSQL_PASSWORD
echo ""

# Execute the SQL update
mysql -u root -p"$MYSQL_PASSWORD" ecommerce_db < sql/update_product_images.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Product images updated successfully!"
    echo ""
    echo "📸 Image mappings:"
    echo "   1. iPhone 14         → /photos/iphone.jpeg"
    echo "   2. Samsung Galaxy M33 → /photos/galaxy m33.jpeg"
    echo "   3. Dell Laptop       → /photos/dell laptop.jpeg"
    echo "   4. Levis Jeans       → /photos/levis jeans.jpeg"
    echo "   5. Nike Shoes        → /photos/nike air max.jpeg"
    echo "   6. Pressure Cooker   → /photos/cooker.jpeg"
    echo "   7. Iron              → /photos/iron.jpeg"
    echo "   8. Ikigai Book       → /photos/ikigai.webp"
    echo "   9. Sapiens Book      → /photos/sapiens.webp"
    echo "   10. Yoga Mat         → /photos/yoga mat.jpeg"
    echo ""
else
    echo ""
    echo "❌ Failed to update images. Please check your MySQL connection."
    exit 1
fi

