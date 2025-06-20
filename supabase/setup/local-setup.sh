#!/bin/bash
# Local Supabase setup script for DSA Pattern Master MVP

set -e

echo "🚀 Setting up local Supabase database for DSA Pattern Master..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    echo "or"
    echo "brew install supabase/tap/supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/migrations/20250101000001_initial_schema.sql" ]; then
    echo "❌ Migration files not found. Make sure you're in the project root directory."
    exit 1
fi

# Start local Supabase
echo "📦 Starting local Supabase..."
supabase start

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
supabase db reset --local

# Apply database functions
echo "🔧 Applying database functions..."
for func in supabase/functions/*.sql; do
    if [ -f "$func" ]; then
        echo "  Applying $(basename "$func")..."
        psql postgresql://postgres:postgres@localhost:54322/postgres -f "$func"
    fi
done

# Seed initial data
echo "🌱 Seeding initial data..."
echo "  Inserting patterns..."
psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/seed/patterns.sql

echo "  Inserting sample data for testing..."
psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/seed/sample_data.sql

# Refresh materialized view
echo "🔄 Refreshing materialized views..."
psql postgresql://postgres:postgres@localhost:54322/postgres -c "REFRESH MATERIALIZED VIEW monthly_ai_usage;"

# Get connection details
API_URL=$(supabase status --output=json | jq -r '.[] | select(.name=="API URL") | .value' 2>/dev/null || echo "http://localhost:54321")
ANON_KEY=$(supabase status --output=json | jq -r '.[] | select(.name=="anon key") | .value' 2>/dev/null || echo "See dashboard for anon key")
SERVICE_ROLE_KEY=$(supabase status --output=json | jq -r '.[] | select(.name=="service_role key") | .value' 2>/dev/null || echo "See dashboard for service role key")

echo ""
echo "✅ Local Supabase setup complete!"
echo ""
echo "📋 Connection Details:"
echo "🌐 Dashboard: http://localhost:54323"
echo "🔗 API URL: $API_URL"
echo "🔑 Anon Key: $ANON_KEY"
echo "🔐 Service Role Key: $SERVICE_ROLE_KEY"
echo ""
echo "📄 Update your .env.local with:"
echo "NEXT_PUBLIC_SUPABASE_URL=$API_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY"
echo "SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
echo ""
echo "🎯 MVP is ready! Only 'two-pointer' pattern is active for testing."
echo ""
echo "🧪 Test users available:"
echo "  - test.user@example.com (trial user)"
echo "  - advanced.user@example.com (premium user)"
echo "  - beginner.user@example.com (trial user)"
