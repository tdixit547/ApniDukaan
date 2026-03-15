#!/bin/bash

echo "=========================================="
echo "  E-Commerce App - System Check"
echo "=========================================="
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Check 1: MySQL Running
echo "✓ Checking MySQL..."
if pgrep -x "mysqld" > /dev/null; then
    echo "  ✅ MySQL is running"
    ((CHECKS_PASSED++))
else
    echo "  ❌ MySQL is NOT running"
    echo "     Fix: brew services start mysql"
    ((CHECKS_FAILED++))
fi

# Check 2: Database exists
echo ""
echo "✓ Checking database..."
if mysql -u root -pAyush0917 -e "USE ecommerce_db;" 2>/dev/null; then
    echo "  ✅ Database 'ecommerce_db' exists"
    ((CHECKS_PASSED++))
else
    echo "  ❌ Database 'ecommerce_db' not found"
    echo "     Creating database..."
    mysql -u root -pAyush0917 -e "CREATE DATABASE ecommerce_db;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "  ✅ Database created successfully"
        ((CHECKS_PASSED++))
    else
        echo "  ❌ Failed to create database"
        ((CHECKS_FAILED++))
    fi
fi

# Check 3: Port 8080 available
echo ""
echo "✓ Checking port 8080..."
if lsof -i :8080 > /dev/null 2>&1; then
    echo "  ⚠️  Port 8080 is in use"
    echo "     If Spring Boot is already running, this is OK"
    echo "     Otherwise run: lsof -i :8080 | grep LISTEN"
else
    echo "  ✅ Port 8080 is available"
    ((CHECKS_PASSED++))
fi

# Check 4: Java installed
echo ""
echo "✓ Checking Java..."
if command -v java > /dev/null 2>&1; then
    JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2)
    echo "  ✅ Java is installed (version: $JAVA_VERSION)"
    ((CHECKS_PASSED++))
else
    echo "  ❌ Java is NOT installed"
    echo "     Please install Java 17 or higher"
    ((CHECKS_FAILED++))
fi

# Check 5: Project files
echo ""
echo "✓ Checking project files..."
if [ -f "src/main/java/coldblooded/project/prototype/PrototypeApplication.java" ]; then
    echo "  ✅ PrototypeApplication.java found"
    ((CHECKS_PASSED++))
else
    echo "  ❌ PrototypeApplication.java not found"
    ((CHECKS_FAILED++))
fi

if [ -f "index.html" ]; then
    echo "  ✅ index.html found"
    ((CHECKS_PASSED++))
else
    echo "  ❌ index.html not found"
    ((CHECKS_FAILED++))
fi

if [ -f "app.js" ]; then
    echo "  ✅ app.js found"
    ((CHECKS_PASSED++))
else
    echo "  ❌ app.js not found"
    ((CHECKS_FAILED++))
fi

# Check 6: Sample data
echo ""
echo "✓ Checking sample data..."
PRODUCT_COUNT=$(mysql -u root -pAyush0917 ecommerce_db -e "SELECT COUNT(*) FROM products;" 2>/dev/null | tail -1)
if [ ! -z "$PRODUCT_COUNT" ] && [ "$PRODUCT_COUNT" -gt 0 ]; then
    echo "  ✅ Found $PRODUCT_COUNT products in database"
    ((CHECKS_PASSED++))
else
    echo "  ⚠️  No products in database"
    echo "     Load sample data: mysql -u root -pAyush0917 ecommerce_db < sql/sample_data.sql"
fi

# Summary
echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo "  Checks Passed: $CHECKS_PASSED"
echo "  Checks Failed: $CHECKS_FAILED"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo "✅ All systems ready!"
    echo ""
    echo "Next steps:"
    echo "1. Open IntelliJ IDEA"
    echo "2. Open this project"
    echo "3. Run PrototypeApplication.java"
    echo "4. Open http://localhost:8080 in browser"
    echo ""
    echo "Or read: INTELLIJ_STARTUP.md for detailed instructions"
else
    echo "❌ Please fix the issues above before running"
    echo ""
    echo "Need help? Read: INTELLIJ_STARTUP.md"
fi

echo "=========================================="

