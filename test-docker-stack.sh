#!/bin/bash
# Simple script to test if the Docker stack is working

echo "🧪 Testing Docker Stack..."
echo ""

# Test Frontend
echo "📱 Testing Frontend (http://localhost:3002)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend is working (HTTP $FRONTEND_STATUS)"
else
    echo "❌ Frontend failed (HTTP $FRONTEND_STATUS)"
fi
echo ""

# Test Kong API Gateway
echo "🚪 Testing Kong API Gateway (http://localhost:8000)..."
KONG_RESPONSE=$(curl -s http://localhost:8000/auth/v1/health)
if echo "$KONG_RESPONSE" | grep -q "message"; then
    echo "✅ Kong API Gateway is working"
else
    echo "❌ Kong API Gateway failed"
fi
echo ""

# Test Supabase Studio
echo "🎨 Testing Supabase Studio (http://localhost:3001)..."
STUDIO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)
if [ "$STUDIO_STATUS" = "307" ] || [ "$STUDIO_STATUS" = "200" ]; then
    echo "✅ Supabase Studio is working (HTTP $STUDIO_STATUS)"
else
    echo "❌ Supabase Studio failed (HTTP $STUDIO_STATUS)"
fi
echo ""

# Test Database
echo "🗄️  Testing Database..."
DB_STATUS=$(docker compose ps db --format json 2>/dev/null | grep -o '"Health":"[^"]*"' | cut -d'"' -f4)
if [ "$DB_STATUS" = "healthy" ]; then
    echo "✅ Database is healthy"
else
    echo "⚠️  Database status: $DB_STATUS"
fi
echo ""

# Test Storage
echo "💾 Testing Storage Service..."
STORAGE_RUNNING=$(docker compose ps storage --format json 2>/dev/null | grep -o '"State":"[^"]*"' | cut -d'"' -f4)
if [ "$STORAGE_RUNNING" = "running" ]; then
    echo "✅ Storage service is running"
else
    echo "❌ Storage service status: $STORAGE_RUNNING"
fi
echo ""

echo "✨ Stack test complete!"
echo ""
echo "Access your services:"
echo "  • Frontend:       http://localhost:3002"
echo "  • API Gateway:    http://localhost:8000"
echo "  • Supabase Studio: http://localhost:3001"
echo "  • Email Testing:  http://localhost:9000"
