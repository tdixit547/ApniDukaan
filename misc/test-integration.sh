#!/bin/bash

# 🚀 Quick Test Script for API Integration

echo "=========================================="
echo "🎯 E-Commerce API Integration Test"
echo "=========================================="
echo ""

# Check if server is running
echo "📡 Checking if server is running on port 8080..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Server is running!"
else
    echo "❌ Server is not running on port 8080"
    echo "Please start the server first:"
    echo "  ./mvnw spring-boot:run"
    exit 1
fi

echo ""
echo "=========================================="
echo "🧪 Testing API Endpoints"
echo "=========================================="
echo ""

# Test Products endpoint
echo "1️⃣ Testing GET /api/products..."
if curl -s http://localhost:8080/api/products?page=0&size=5 | grep -q "content"; then
    echo "   ✅ Products endpoint working"
else
    echo "   ❌ Products endpoint failed"
fi

# Test Categories endpoint
echo "2️⃣ Testing GET /api/categories..."
if curl -s http://localhost:8080/api/categories?page=0&size=5 | grep -q "content"; then
    echo "   ✅ Categories endpoint working"
else
    echo "   ❌ Categories endpoint failed"
fi

echo ""
echo "=========================================="
echo "📁 Checking Frontend Files"
echo "=========================================="
echo ""

# Check if all JS files exist
files=("app.js" "orders.js" "profile.js" "admin.js" "style.css")
all_exist=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        all_exist=false
    fi
done

if [ -f "src/main/resources/static/app.js" ]; then
    echo "✅ Static resources synced"
else
    echo "⚠️  Static resources might need sync"
fi

echo ""
echo "=========================================="
echo "🌐 Access Points"
echo "=========================================="
echo ""
echo "Main Shop:    http://localhost:8080/index.html"
echo "Orders Page:  http://localhost:8080/orders.html"
echo "Profile Page: http://localhost:8080/profile.html"
echo "Admin Panel:  http://localhost:8080/admin.html"
echo ""
echo "=========================================="
echo "📋 Quick Test Steps"
echo "=========================================="
echo ""
echo "1. Open http://localhost:8080/index.html"
echo "2. Try to add a product to cart (will prompt login)"
echo "3. Register a new account"
echo "4. Add products to cart"
echo "5. View cart and proceed to checkout"
echo "6. Check your orders at http://localhost:8080/orders.html"
echo "7. Click on any product to view details and reviews"
echo "8. Write a review for a product"
echo ""
echo "For Admin:"
echo "9. Login with admin credentials"
echo "10. Go to http://localhost:8080/admin.html"
echo "11. Add a new product"
echo "12. Update order status"
echo ""
echo "=========================================="
echo "✨ All Set! Happy Testing! ✨"
echo "=========================================="

