#!/bin/bash

# Quick Database Population Script
# This will insert all sample data into your MySQL database

echo "🚀 Starting database population..."

# Database connection details
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="ecommerce_db"
DB_USER="root"
DB_PASS="Ayush0917"

# Check if mysql command exists
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client not found!"
    echo "Please install MySQL client or use the Postman method instead."
    echo "See POSTMAN_DATA_SETUP.md for manual API calls."
    exit 1
fi

echo "📊 Connecting to database..."

# Execute the SQL script
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER $DB_PASS $DB_NAME < "$(dirname "$0")/sample_data.sql"

if [ $? -eq 0 ]; then
    echo "✅ Sample data inserted successfully!"
    echo ""
    echo "📦 Data Summary:"
    echo "   - 5 Users (4 customers + 1 admin)"
    echo "   - 5 Categories"
    echo "   - 10 Products"
    echo "   - 2 Cart Items"
    echo "   - 3 Orders"
    echo "   - 5 Reviews"
    echo ""
    echo "🔐 Login Details (password: password123):"
    echo "   - raj.sharma@gmail.com"
    echo "   - priya.patel@gmail.com"
    echo "   - amit.kumar@gmail.com"
    echo "   - sneha.singh@gmail.com"
    echo "   - admin@ecommerce.com (ADMIN)"
    echo ""
    echo "🎉 Ready to test in Postman!"
else
    echo "❌ Error inserting data!"
    echo "Please check your MySQL connection and try again."
    exit 1
fi
