# DSA Pattern Master - Supabase Database Setup

This directory contains the complete database setup for DSA Pattern Master, serving as the single source of truth for all database configuration.

## 📁 Directory Structure

```
supabase/
├── migrations/           # Database schema migrations (versioned)
├── functions/           # Database functions (stored procedures)
├── seed/               # Initial data and test data
├── types/              # TypeScript type definitions
├── config/             # Supabase client configuration
└── setup/              # Setup and utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase CLI installed: `npm install -g supabase`

### 1. Local Development Setup
```bash
# Run the automated setup script
./supabase/setup/local-setup.sh

# Or manually:
supabase start
supabase db reset --local
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and update with your keys:
```bash
cp .env.example .env.local
# Edit .env.local with the connection details from the setup script
```

### 3. Verify Setup
Visit http://localhost:54323 to access the Supabase dashboard.

## 📋 Database Schema Overview

### Core Tables
- **user_profiles** - User account information and subscription status
- **patterns** - Available learning patterns (MVP: only two-pointer active)
- **learning_sessions** - Active learning sessions with progress tracking
- **pattern_progress** - Completed pattern achievements
- **ai_interactions** - AI usage tracking for cost management
- **subscriptions** - Stripe subscription management
- **payment_history** - Payment transaction records

### Key Features
- **Row Level Security (RLS)** - Users can only access their own data
- **Real-time subscriptions** - Live updates for learning progress
- **Cost tracking** - Automatic AI usage monitoring with limits
- **Adaptive learning** - Progress and mastery score calculations

## 🔧 Database Functions

### Core Business Logic Functions
- `calculate_mastery_score(user_id, pattern_id)` - Calculates weighted mastery score
- `update_learning_progress(user_id, session_id, progress_data, understanding_delta)` - Updates session progress atomically
- `track_ai_usage(user_id, session_id, interaction_type, tokens, cost)` - Tracks AI costs with limits

### Usage Examples
```sql
-- Calculate user's mastery score for two-pointer pattern
SELECT calculate_mastery_score('user-id', 'two-pointer');

-- Track AI interaction with cost validation
SELECT track_ai_usage(
  'user-id',
  'session-id',
  'socratic_question',
  150, 300,
  'gemini-2.5-pro',
  0.003125
);
```

## 📊 MVP Configuration

### Two-Pointer Pattern Focus
For the MVP, only the two-pointer pattern is active:
- 8 problems across 3 levels (Level 1: Interview Ready)
- Problems: two-sum-ii, valid-palindrome, container-with-water, move-zeroes, three-sum, remove-duplicates, sort-colors, remove-nth-node
- Mastery threshold: 80% overall score
- Understanding threshold: 75% understanding level

### AI Cost Management
- Default monthly limit: $3.00 per user
- Real-time cost tracking with warnings at 80% usage
- Automatic usage validation before AI interactions
- Trial users: 14-day access to full features

## 🔒 Security Configuration

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Service role has admin access for system operations
- Public read access only for patterns table

### Authentication Flow
1. User signs up → automatic profile creation via trigger
2. Profile includes subscription status and AI usage limits
3. All database operations respect user permissions
4. Session tracking with automatic cleanup

## 🛠️ Development Workflow

### Making Schema Changes
1. Create new migration file: `supabase migration new description`
2. Write SQL in the migration file
3. Test locally: `supabase db reset --local`
4. Commit to version control

### Adding New Functions
1. Create `.sql` file in `supabase/functions/`
2. Apply locally: `psql postgresql://postgres:postgres@localhost:54322/postgres -f function.sql`
3. Add to setup scripts for automated deployment

### Testing Data
```bash
# Reset database with fresh test data
./supabase/setup/reset-database.sh

# Available test users:
# - test.user@example.com (trial)
# - advanced.user@example.com (premium)
# - beginner.user@example.com (trial)
```

## 📈 Monitoring & Analytics

### Key Metrics Tracked
- **Learning Progress**: Session completion rates, time spent, mastery scores
- **AI Usage**: Token consumption, cost per user, model usage patterns
- **User Engagement**: Pattern completion rates, retention metrics
- **System Performance**: Query response times, error rates

### Materialized Views
- `monthly_ai_usage` - Aggregated AI costs and usage by user/month
- Refreshed automatically via scheduled function

## 🚨 Troubleshooting

### Common Issues

**"Migration failed"**
```bash
# Check current migration status
supabase db status --local

# Reset if needed
supabase db reset --local
```

**"Function not found"**
```bash
# Reapply functions
for func in supabase/functions/*.sql; do
  psql postgresql://postgres:postgres@localhost:54322/postgres -f "$func"
done
```

**"RLS policy blocking access"**
- Ensure user is authenticated
- Check if using correct user ID in queries
- Verify RLS policies in `supabase/migrations/20250101000005_rls_policies.sql`

### Getting Help
- Check Supabase dashboard logs: http://localhost:54323
- Review migration files for schema reference
- Test with sample data provided in seed files

## 🔄 Production Deployment

### Environment Setup
1. Create Supabase project at https://supabase.com
2. Link local project: `supabase link --project-ref your-project-ref`
3. Push migrations: `supabase db push`
4. Update environment variables with production URLs

### Security Checklist
- [ ] RLS policies tested and verified
- [ ] Service role key secured
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Connection pooling configured for scale

## 📝 Migration History

- `20250101000001` - Initial schema with user profiles and core types
- `20250101000002` - Authentication setup and user profile triggers
- `20250101000003` - Learning system tables
- `20250101000004` - AI tracking and subscription management
- `20250101000005` - Row level security policies

---

**Note**: This database setup is specifically designed for the MVP focusing on the two-pointer pattern. Additional patterns can be activated by updating the `is_active` flag in the patterns table and adding corresponding configuration files.
