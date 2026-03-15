#!/bin/bash

echo "🔧 Fixing port 8080 conflicts..."

# Kill any process on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null
sleep 2

echo "🚀 Starting Spring Boot server..."
echo "📝 Logs will be shown below..."
echo "⏳ Please wait 15-20 seconds for startup..."
echo ""

# Start the server
./mvnw spring-boot:run
