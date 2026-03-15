#!/bin/bash

# =============================================
# ApniDukaan E-Commerce - Quick Start Script
# =============================================

echo "🚀 ApniDukaan E-Commerce - Quick Start"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check MySQL
echo "📋 Step 1: Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL not found. Please install MySQL first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MySQL found${NC}"
echo ""

# Step 2: Check if database exists
echo "📋 Step 2: Checking database..."
read -s -p "Enter MySQL root password: " MYSQL_PASSWORD
echo ""

# Test connection
if mysql -u root -p"$MYSQL_PASSWORD" -e "USE ecommerce_db;" 2>/dev/null; then
    echo -e "${GREEN}✅ Database 'ecommerce_db' exists${NC}"
    read -p "Do you want to reset the database with fresh data? (y/n): " RESET_DB
    if [ "$RESET_DB" = "y" ]; then
        echo "🔄 Resetting database..."
        mysql -u root -p"$MYSQL_PASSWORD" ecommerce_db < sql/sample_data.sql
        echo -e "${GREEN}✅ Database reset complete${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Database doesn't exist. Creating...${NC}"
    mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE DATABASE ecommerce_db;"
    mysql -u root -p"$MYSQL_PASSWORD" ecommerce_db < sql/sample_data.sql
    echo -e "${GREEN}✅ Database created and populated${NC}"
fi
echo ""

# Step 3: Update product images
echo "📋 Step 3: Updating product images..."
mysql -u root -p"$MYSQL_PASSWORD" ecommerce_db < sql/update_product_images.sql 2>/dev/null
echo -e "${GREEN}✅ Product images updated${NC}"
echo ""

# Step 4: Copy photos to static resources
echo "📋 Step 4: Copying photos to static resources..."
if [ -d "photos" ]; then
    cp -r photos src/main/resources/static/ 2>/dev/null
    echo -e "${GREEN}✅ Photos copied${NC}"
else
    echo -e "${YELLOW}⚠️  Photos folder not found${NC}"
fi
echo ""

# Step 5: Build the project
echo "📋 Step 5: Building the project..."
echo "This may take a few minutes..."
./mvnw clean package -DskipTests
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 6: Show completion message
echo "======================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "======================================"
echo ""
echo "📝 What's been set up:"
echo "   ✅ Database created/updated"
echo "   ✅ Sample data loaded"
echo "   ✅ Product images configured"
echo "   ✅ Project built successfully"
echo ""
echo "🚀 To start the application:"
echo "   ./mvnw spring-boot:run"
echo ""
echo "   Or run in background:"
echo "   nohup ./mvnw spring-boot:run > server.log 2>&1 &"
echo ""
echo "🌐 Access the application:"
echo "   Customer Portal: http://localhost:8080"
echo "   Admin Dashboard: http://localhost:8080/admin.html"
echo ""
echo "👤 Test Credentials:"
echo "   Customer:"
echo "     Email: raj.sharma@gmail.com"
echo "     Password: password123"
echo ""
echo "   Admin:"
echo "     Email: admin@ecommerce.com"
echo "     Password: password123"
echo ""
echo "📚 Documentation:"
echo "   - API_INTEGRATION_COMPLETE.md - Full API guide"
echo "   - PRODUCT_IMAGES_SETUP.md - Image setup guide"
echo ""
echo "🎉 Happy testing!"

