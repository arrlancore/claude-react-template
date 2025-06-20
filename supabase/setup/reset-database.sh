#!/bin/bash
# Reset database script for DSA Pattern Master

set -e

echo "⚠️  WARNING: This will reset ALL data in the local database!"
echo "This includes:"
echo "  - All user profiles and learning sessions"
echo "  - All AI interaction history"
echo "  - All pattern progress"
echo "  - All sample data"
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Resetting local Supabase database..."

    # Check if Supabase is running
    if ! supabase status --local &> /dev/null; then
        echo "❌ Local Supabase is not running. Starting it first..."
        supabase start
        sleep 5
    fi

    # Reset the database (runs all migrations fresh)
    echo "🗄️  Applying fresh migrations..."
    supabase db reset --local

    # Apply database functions
    echo "🔧 Reapplying database functions..."
    for func in supabase/functions/*.sql; do
        if [ -f "$func" ]; then
            echo "  Applying $(basename "$func")..."
            psql postgresql://postgres:postgres@localhost:54322/postgres -f "$func"
        fi
    done

    # Reseed data
    echo "🌱 Reseeding initial data..."
    echo "  Inserting patterns..."
    psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/seed/patterns.sql

    echo "  Inserting sample data..."
    psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/seed/sample_data.sql

    # Refresh materialized view
    echo "🔄 Refreshing materialized views..."
    psql postgresql://postgres:postgres@localhost:54322/postgres -c "REFRESH MATERIALIZED VIEW monthly_ai_usage;"

    echo ""
    echo "✅ Database reset complete!"
    echo "🎯 MVP is ready with fresh two-pointer pattern data."
    echo "🧪 Test users have been recreated with sample learning sessions."

else
    echo "❌ Database reset cancelled."
fi
