#!/bin/bash

echo "=========================================="
echo "Spring Boot E-commerce Setup Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check MySQL
echo -e "${YELLOW}Step 1: Checking MySQL...${NC}"
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL client found${NC}"
    mysql --version
else
    echo -e "${RED}✗ MySQL client not found in PATH${NC}"
    echo "  Please install MySQL or add it to your PATH"
    exit 1
fi

# Check if MySQL server is running
echo ""
echo -e "${YELLOW}Step 2: Checking if MySQL server is running...${NC}"
if pgrep -x "mysqld" > /dev/null; then
    echo -e "${GREEN}✓ MySQL server is running${NC}"
else
    echo -e "${RED}✗ MySQL server is not running${NC}"
    echo "  Start it with: brew services start mysql"
    echo "  Or: sudo /usr/local/mysql/support-files/mysql.server start"
    exit 1
fi

# Test MySQL connection
echo ""
echo -e "${YELLOW}Step 3: Testing MySQL connection...${NC}"
echo "Enter MySQL root password (press Enter if no password):"
read -s MYSQL_PASSWORD

if [ -z "$MYSQL_PASSWORD" ]; then
    MYSQL_CONN="mysql -u root"
else
    MYSQL_CONN="mysql -u root -p$MYSQL_PASSWORD"
fi

if $MYSQL_CONN -e "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✓ MySQL connection successful${NC}"

    # Create database if not exists
    echo ""
    echo -e "${YELLOW}Step 4: Creating database...${NC}"
    $MYSQL_CONN -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" &> /dev/null
    echo -e "${GREEN}✓ Database 'ecommerce_db' is ready${NC}"

    # Update application.properties if password is set
    if [ ! -z "$MYSQL_PASSWORD" ]; then
        echo ""
        echo -e "${YELLOW}Step 5: Updating application.properties...${NC}"
        sed -i '' "s/spring.datasource.password=.*/spring.datasource.password=$MYSQL_PASSWORD/" src/main/resources/application.properties
        echo -e "${GREEN}✓ Password updated in application.properties${NC}"
    fi
else
    echo -e "${RED}✗ Cannot connect to MySQL${NC}"
    echo "  Please check your MySQL root password"
    exit 1
fi

# Run Spring Boot application
echo ""
echo -e "${YELLOW}Step 6: Starting Spring Boot application...${NC}"
echo -e "${YELLOW}This will create all database tables automatically${NC}"
echo ""
echo "=========================================="
echo "Starting application..."
echo "Watch for Hibernate DDL statements below"
echo "=========================================="
echo ""

./mvnw spring-boot:run

