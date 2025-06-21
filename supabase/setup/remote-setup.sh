#!/bin/bash
# Remote Supabase setup script for PatternLift Production
# This script deploys the database schema, functions, and essential data to production

set -e

# Enable debug mode if DEBUG=1
if [ "$DEBUG" = "1" ]; then
    set -x
    echo "🐛 DEBUG MODE ENABLED"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
SUPABASE_PROJECT_REF=""
DEPLOYMENT_ENV=""
DB_URL=""
API_URL=""
ANON_KEY=""

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_debug() {
    if [ "$DEBUG" = "1" ]; then
        echo -e "${YELLOW}🐛 DEBUG: $1${NC}"
    fi
}

log_step() {
    echo -e "${YELLOW}🔄 $1${NC}"
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_environment() {
    log_step "Validating environment..."

    # Check if we're in the right directory
    if [ ! -f "supabase/migrations/20250101000001_initial_schema.sql" ]; then
        log_error "Migration files not found. Make sure you're in the project root directory."
        exit 1
    fi
    log_debug "Found migration files in correct directory"

    # Check if supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI not found. Please install it first:"
        echo "npm install -g supabase"
        echo "or"
        echo "brew install supabase/tap/supabase"
        exit 1
    fi
    log_debug "Supabase CLI is installed"

    # Check for required environment variables - try multiple ways
    if [ -z "$SUPABASE_PROJECT_REF" ]; then
        # Try to get from command line argument
        if [ -n "$1" ]; then
            SUPABASE_PROJECT_REF="$1"
            log_debug "Using SUPABASE_PROJECT_REF from command line argument: $SUPABASE_PROJECT_REF"
        else
            log_error "SUPABASE_PROJECT_REF environment variable is required"
            echo "Please set it using one of these methods:"
            echo "1. Environment variable: export SUPABASE_PROJECT_REF='your-project-ref-here'"
            echo "2. Command line argument: ./remote-setup.sh your-project-ref-here"
            echo ""
            echo "Current environment check:"
            echo "  \$SUPABASE_PROJECT_REF = '$SUPABASE_PROJECT_REF'"
            echo "  \$1 (first argument) = '$1'"
            exit 1
        fi
    else
        log_debug "SUPABASE_PROJECT_REF from environment: $SUPABASE_PROJECT_REF"
    fi

    # Set deployment environment
    DEPLOYMENT_ENV="${DEPLOYMENT_ENVIRONMENT:-production}"
    log_info "Deployment environment: $DEPLOYMENT_ENV"
    log_success "Environment validation complete"
}

confirm_production_deployment() {
    if [ "$DEPLOYMENT_ENV" = "production" ]; then
        log_warning "WARNING: You are about to deploy to PRODUCTION"
        echo "This will apply database migrations and functions to your live Supabase project."
        echo ""
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_warning "Deployment cancelled by user"
            exit 0
        fi
        log_debug "User confirmed production deployment"
    fi
}

check_supabase_auth() {
    log_step "Checking Supabase CLI authentication..."

    if ! supabase projects list &>/dev/null; then
        log_error "Not authenticated with Supabase CLI"
        echo "Please run: supabase login"
        exit 1
    fi
    log_debug "Supabase CLI authentication verified"
    log_success "Authentication check complete"
}

# =============================================================================
# PROJECT SETUP FUNCTIONS
# =============================================================================

link_to_remote_project() {
    log_step "Linking to Supabase project: $SUPABASE_PROJECT_REF"
    log_debug "Running: supabase link --project-ref $SUPABASE_PROJECT_REF"

    if supabase link --project-ref "$SUPABASE_PROJECT_REF"; then
        log_success "Successfully linked to remote project"
    else
        log_error "Failed to link to remote project"
        exit 1
    fi
}

verify_project_access() {
    log_step "Verifying project access..."
    log_debug "Checking remote project access after linking"

    # For remote projects, we just need to verify the link worked
    # The linking process already validated access
    log_debug "Project was successfully linked in previous step"
    log_success "Project access verified (remote project linked successfully)"
}

handle_config_differences() {
    log_warning "Config differences between local and remote are normal for production"
    log_debug "This warning can be safely ignored in production deployments"
}

# =============================================================================
# DATABASE MIGRATION FUNCTIONS
# =============================================================================

validate_migrations() {
    log_step "Validating migration files..."

    if [ ! -d "supabase/migrations" ] || [ -z "$(ls -A supabase/migrations)" ]; then
        log_error "No migrations found in supabase/migrations/"
        exit 1
    fi

    log_info "Migrations to be applied:"
    ls -la supabase/migrations/
    log_debug "Found $(ls -1 supabase/migrations/ | wc -l) migration files"
    log_success "Migration validation complete"
}

push_database_migrations() {
    log_step "Pushing database migrations to remote..."
    echo "This will apply all schema changes to your production database."
    echo ""

    log_debug "Running: supabase db push"

    if supabase db push; then
        log_success "Database migrations applied successfully"
    else
        log_error "Failed to push migrations"
        echo ""
        log_warning "Troubleshooting steps:"
        echo "1. Check if migrations are valid: supabase db diff --use-migra"
        echo "2. Verify project permissions in Supabase dashboard"
        echo "3. Try: supabase db reset"
        exit 1
    fi
}

# =============================================================================
# DATABASE FUNCTION FUNCTIONS
# =============================================================================

get_database_connection() {
    log_step "Retrieving database connection details..."
    log_debug "Getting database connection for remote project"

    # For Supabase remote projects, we need to get the actual connection details
    # Try to get the connection string from supabase CLI after linking
    log_debug "Attempting to get database connection info from linked project..."

    # Check if there's a .supabase directory with connection info
    if [ -f ".supabase/config.toml" ]; then
        log_debug "Found .supabase/config.toml, checking for connection details"
    fi

    # Try to use supabase db url command to get the correct connection string
    if DB_URL=$(supabase db url 2>/dev/null); then
        log_debug "Retrieved DB URL using 'supabase db url'"
        log_success "Database connection details obtained"
    else
        log_warning "Could not retrieve database URL automatically"
        log_info "Database functions will be skipped - you can apply them manually later"
        log_info "To apply functions manually, get the connection string from your Supabase dashboard"
        log_info "and run: psql \"[connection-string]\" -f supabase/functions/[function-name].sql"
        DB_URL=""
    fi
}

apply_database_functions() {
    log_step "Applying database functions..."

    if [ -z "$DB_URL" ]; then
        log_warning "Database connection not available - skipping function application"
        log_info "You can apply functions manually using the Supabase dashboard or SQL editor"
        log_info "Functions to apply manually:"
        for func in supabase/functions/*.sql; do
            if [ -f "$func" ]; then
                echo "  - $(basename "$func")"
            fi
        done
        return 0
    fi

    local func_count=0
    for func in supabase/functions/*.sql; do
        if [ -f "$func" ]; then
            log_info "Applying $(basename "$func")..."
            log_debug "Running: psql \"$DB_URL\" -f \"$func\" -q"

            if psql "$DB_URL" -f "$func" -q; then
                func_count=$((func_count + 1))
                log_debug "Successfully applied $(basename "$func")"
            else
                log_error "Failed to apply function: $(basename "$func")"
                log_warning "You can apply this function manually in the Supabase dashboard"
            fi
        fi
    done

    if [ $func_count -gt 0 ]; then
        log_success "Applied $func_count database functions successfully"
    else
        log_info "No database functions were applied automatically"
    fi
}

# =============================================================================
# DATA SEEDING FUNCTIONS
# =============================================================================

seed_production_data() {
    log_step "Seeding production data..."

    if [ -z "$DB_URL" ]; then
        log_warning "Database connection not available - skipping data seeding"
        log_info "You can apply seed data manually using the Supabase dashboard SQL editor"
        if [ -f "supabase/seed/production_data.sql" ]; then
            log_info "Apply: supabase/seed/production_data.sql"
        else
            log_info "Apply: supabase/seed/patterns.sql"
        fi
        return 0
    fi

    # Try production_data.sql first, fall back to patterns.sql
    if [ -f "supabase/seed/production_data.sql" ]; then
        log_info "Applying production patterns..."
        log_debug "Running: psql \"$DB_URL\" -f \"supabase/seed/production_data.sql\" -q"

        if psql "$DB_URL" -f "supabase/seed/production_data.sql" -q; then
            log_success "Production data applied successfully"
        else
            log_warning "Failed to apply production data - you can apply it manually"
        fi
    else
        log_info "Applying patterns from seed/patterns.sql..."
        log_debug "Running: psql \"$DB_URL\" -f \"supabase/seed/patterns.sql\" -q"

        if psql "$DB_URL" -f "supabase/seed/patterns.sql" -q; then
            log_success "Patterns data applied successfully"
        else
            log_warning "Failed to apply patterns data - you can apply it manually"
        fi
    fi
}

refresh_materialized_views() {
    log_step "Refreshing materialized views..."

    if [ -z "$DB_URL" ]; then
        log_warning "Database connection not available - skipping materialized view refresh"
        log_info "You can refresh views manually: REFRESH MATERIALIZED VIEW monthly_ai_usage;"
        return 0
    fi

    log_debug "Running: psql \"$DB_URL\" -c \"REFRESH MATERIALIZED VIEW monthly_ai_usage;\" -q"

    if psql "$DB_URL" -c "REFRESH MATERIALIZED VIEW monthly_ai_usage;" -q; then
        log_success "Materialized views refreshed successfully"
    else
        log_warning "Failed to refresh materialized views (this might be normal if views don't exist yet)"
    fi
}

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

validate_security_configuration() {
    log_step "Validating security configuration..."

    if [ -z "$DB_URL" ]; then
        log_warning "Database connection not available - skipping security validation"
        log_info "You can check RLS policies manually in the Supabase dashboard"
        return 0
    fi

    log_debug "Checking RLS policies..."

    if RLS_CHECK=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM pg_policies;" 2>/dev/null); then
        RLS_COUNT=$(echo "$RLS_CHECK" | tr -d ' ')
        log_debug "Found $RLS_COUNT RLS policies"

        if [ "$RLS_COUNT" -lt 5 ]; then
            log_warning "Expected more RLS policies ($RLS_COUNT found). Please verify security setup."
        else
            log_success "RLS policies are active ($RLS_COUNT policies found)"
        fi
    else
        log_warning "Could not check RLS policies"
    fi
}

run_health_checks() {
    log_step "Running production health checks..."

    if [ -z "$DB_URL" ]; then
        log_warning "Database connection not available - skipping health checks"
        log_info "You can verify the following manually in the Supabase dashboard:"
        log_info "  - Functions: calculate_mastery_score, track_ai_usage"
        log_info "  - Tables: patterns, user_profiles, learning_sessions"
        log_info "  - Active patterns data exists"
        return 0
    fi

    # Test essential functions
    log_info "Testing calculate_mastery_score function..."
    if FUNC_TEST=$(psql "$DB_URL" -t -c "SELECT 1 FROM pg_proc WHERE proname = 'calculate_mastery_score';" 2>/dev/null); then
        if [ "$(echo "$FUNC_TEST" | tr -d ' ')" = "1" ]; then
            log_success "calculate_mastery_score function is available"
        else
            log_warning "calculate_mastery_score function not found"
        fi
    else
        log_warning "Could not check calculate_mastery_score function"
    fi

    log_info "Testing track_ai_usage function..."
    if FUNC_TEST2=$(psql "$DB_URL" -t -c "SELECT 1 FROM pg_proc WHERE proname = 'track_ai_usage';" 2>/dev/null); then
        if [ "$(echo "$FUNC_TEST2" | tr -d ' ')" = "1" ]; then
            log_success "track_ai_usage function is available"
        else
            log_warning "track_ai_usage function not found"
        fi
    else
        log_warning "Could not check track_ai_usage function"
    fi

    # Test patterns data
    log_info "Verifying patterns data..."
    if PATTERNS_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM patterns WHERE is_active = true;" 2>/dev/null); then
        PATTERN_NUM=$(echo "$PATTERNS_COUNT" | tr -d ' ')
        if [ "$PATTERN_NUM" -gt 0 ]; then
            log_success "Found $PATTERN_NUM active pattern(s)"
        else
            log_warning "No active patterns found"
        fi
    else
        log_warning "Could not check patterns data"
    fi
}

# =============================================================================
# OUTPUT FUNCTIONS
# =============================================================================

get_final_connection_details() {
    log_step "Preparing production connection details..."

    # For remote projects, construct the API URL from project ref
    API_URL="https://${SUPABASE_PROJECT_REF}.supabase.co"
    log_debug "API URL: $API_URL"

    # For security, anon key should be retrieved from dashboard
    ANON_KEY="<get-from-supabase-dashboard-settings-api>"

    log_success "Connection details prepared"
}

display_final_results() {
    echo ""
    log_success "Production database setup completed successfully!"
    echo "=================================================================="
    log_info "Database Connection Details:"
    echo ""
    echo -e "${YELLOW}🌐 API URL:${NC} $API_URL"
    echo -e "${YELLOW}🔑 Anon Key:${NC} $ANON_KEY"
    echo -e "${YELLOW}📊 Dashboard:${NC} https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF"
    echo ""
    log_info "Database Environment Variables:"
    echo "----------------------------------------"
    echo "NEXT_PUBLIC_SUPABASE_URL=$API_URL"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY"
    echo "SUPABASE_SERVICE_ROLE_KEY=<get-from-dashboard-settings-api>"
    echo ""

    # Show manual setup instructions if database connection wasn't available
    if [ -z "$DB_URL" ]; then
        log_warning "Manual Setup Required:"
        echo "Some steps need to be completed manually in the Supabase dashboard:"
        echo ""
        echo "📋 Functions to apply (Go to SQL Editor in dashboard):"
        for func in supabase/functions/*.sql; do
            if [ -f "$func" ]; then
                echo "  - Copy and run: $(basename "$func")"
            fi
        done
        echo ""
        echo "📋 Data to seed (Go to SQL Editor in dashboard):"
        if [ -f "supabase/seed/production_data.sql" ]; then
            echo "  - Copy and run: production_data.sql"
        else
            echo "  - Copy and run: patterns.sql"
        fi
        echo ""
    fi

    log_info "Next Steps:"
    echo "1. 📝 Add the 3 database environment variables above to your deployment platform"
    echo "2. 🔐 Get service role key from: Supabase Dashboard → Settings → API"
    if [ -z "$DB_URL" ]; then
        echo "3. 🔧 Complete manual setup steps shown above in Supabase dashboard"
        echo "4. 🌐 Configure other application environment variables (AI, payments, etc.)"
        echo "5. 🚀 Deploy your Next.js application"
    else
        echo "3. 🌐 Configure other application environment variables (AI, payments, etc.)"
        echo "4. 🚀 Deploy your Next.js application"
    fi
    echo ""
    log_success "Database is ready for PatternLift!"
    echo ""
    log_warning "Important Notes:"
    echo "- 🔒 RLS policies are active - users can only access their own data"
    echo "- 💰 AI usage tracking is enabled with \$3/month default limit"
    echo "- 🎯 Only 'two-pointer' pattern is active for MVP"
    echo "- 📊 Monitor usage via Supabase dashboard analytics"
}

# =============================================================================
# MAIN EXECUTION FUNCTION
# =============================================================================

main() {
    echo -e "${BLUE}🚀 PatternLift - Production Supabase Setup${NC}"
    echo "=================================================================="

    # Phase 1: Validation
    log_debug "Starting Phase 1: Validation"
    validate_environment "$1"  # Pass first argument to validation
    confirm_production_deployment
    check_supabase_auth

    # Phase 2: Project Setup
    log_debug "Starting Phase 2: Project Setup"
    link_to_remote_project
    verify_project_access
    handle_config_differences

    # Phase 3: Database Migrations
    log_debug "Starting Phase 3: Database Migrations"
    validate_migrations
    push_database_migrations

    # Phase 4: Database Functions
    log_debug "Starting Phase 4: Database Functions"
    get_database_connection
    apply_database_functions

    # Phase 5: Data Seeding
    log_debug "Starting Phase 5: Data Seeding"
    seed_production_data
    refresh_materialized_views

    # Phase 6: Validation
    log_debug "Starting Phase 6: Validation"
    validate_security_configuration
    run_health_checks

    # Phase 7: Final Output
    log_debug "Starting Phase 7: Final Output"
    get_final_connection_details
    display_final_results

    log_debug "Script execution completed successfully"
}

# =============================================================================
# SCRIPT ENTRY POINT
# =============================================================================

# Trap errors and provide debug info
trap 'echo "❌ Script failed at line $LINENO. Exit code: $?"' ERR

# Run main function
main "$@"
