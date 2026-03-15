#!/bin/bash

echo "======================================"
echo "  E-Commerce Application Startup"
echo "======================================"
echo ""

# Check if MySQL is running
echo "1. Checking MySQL status..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running!"
    echo "Please start MySQL first:"
    echo "  - macOS: brew services start mysql"
    echo "  - Or use MySQL preference pane"
    exit 1
fi
echo "✅ MySQL is running"
echo ""

# Check if database exists and create if needed
echo "2. Setting up database..."
mysql -u root -pAyush0917 -e "CREATE DATABASE IF NOT EXISTS ecommerce_db;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database ready"
else
    echo "❌ Database setup failed. Please check MySQL credentials in application.properties"
    exit 1
fi
echo ""

# Optional: Load sample data
read -p "Do you want to load sample data? (y/n): " load_data
if [ "$load_data" = "y" ]; then
    echo "Loading sample data..."
    mysql -u root -pAyush0917 ecommerce_db < sql/sample_data.sql 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Sample data loaded"
    else
        echo "⚠️  Sample data load failed (this is okay if data already exists)"
    fi
fi
echo ""

# Start the application
echo "3. Starting Spring Boot application..."
echo "   This may take 20-30 seconds..."
echo ""
echo "📝 NOTE: If Maven wrapper fails, please run the application from IntelliJ:"
echo "   Right-click PrototypeApplication.java → Run"
echo ""

# Try to run with Maven wrapper
if [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run
else
    echo "❌ Maven wrapper not found!"
    echo ""
    echo "Please run the application using IntelliJ IDEA:"
    echo "1. Open the project in IntelliJ"
    echo "2. Find: src/main/java/.../PrototypeApplication.java"
    echo "3. Right-click → Run 'PrototypeApplication'"
    echo ""
    echo "Or install Maven and run: mvn spring-boot:run"
fi

echo ""
echo "======================================"
echo "  Application stopped"
echo "======================================"

