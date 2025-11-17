# PatternLift Database Schema Documentation

## Schema Overview

PatternLift uses PostgreSQL with Supabase as the database platform. The schema is designed for an AI-powered algorithm pattern learning platform with subscription management, progress tracking, and cost control.

## Domain Entities

### 🔐 Authentication & Users
- **user_profiles** - Core user data and subscription status
- **subscriptions** - Stripe subscription management
- **payment_history** - Payment transaction records

### 📚 Learning System
- **patterns** - Available algorithm patterns (metadata only)
- **learning_sessions** - Active learning sessions per user/pattern
- **pattern_progress** - Completed pattern achievements
- **user_calibrations** - AI persona calibration results
- **user_achievements** - Gamification achievements

### 🤖 AI & Analytics
- **ai_interactions** - All AI usage tracking for cost control
- **monthly_ai_usage** - Materialized view for usage analytics

## Detailed Schema

### user_profiles
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  subscription_status user_subscription_status DEFAULT 'trial',
  subscription_tier text DEFAULT 'basic',
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  monthly_ai_usage_limit numeric DEFAULT 3.00,
  current_month_ai_cost numeric DEFAULT 0.00,
  learning_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Purpose**: Core user profile with subscription and AI usage limits
**Key Features**:
- $3 monthly AI cost limit
- 14-day trial period
- JSONB preferences for personalization

### learning_sessions
```sql
CREATE TABLE learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  pattern_id text REFERENCES patterns(id),
  current_stage learning_stage DEFAULT 'introduction',
  current_level integer DEFAULT 1 CHECK (current_level IN (1, 2, 3)),
  stage_progress jsonb DEFAULT '{}',
  understanding_level numeric DEFAULT 50.0 CHECK (understanding_level >= 0 AND understanding_level <= 100),
  attempt_history jsonb DEFAULT '[]',
  struggle_indicators text[] DEFAULT '{}',
  mastery_scores jsonb DEFAULT '{}',
  best_score numeric DEFAULT 0,
  current_score numeric DEFAULT 0,
  attempts_count integer DEFAULT 0,
  persona_type text DEFAULT 'balanced_learner',
  is_active boolean DEFAULT true,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, pattern_id)
);
```

**Purpose**: Active learning sessions with AI-driven progress tracking
**Key Features**:
- One active session per user/pattern
- 0-100 understanding level tracking
- AI persona-based guidance
- Best/current score tracking

### ai_interactions
```sql
CREATE TABLE ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES learning_sessions(id) ON DELETE SET NULL,
  interaction_type text NOT NULL,
  prompt_tokens integer NOT NULL CHECK (prompt_tokens >= 0),
  completion_tokens integer NOT NULL CHECK (completion_tokens >= 0),
  model_used text NOT NULL,
  cost_usd numeric(10,6) NOT NULL CHECK (cost_usd >= 0),
  response_quality_score numeric CHECK (response_quality_score >= 1 AND response_quality_score <= 5),
  user_feedback integer CHECK (user_feedback >= 1 AND user_feedback <= 5),
  created_at timestamptz DEFAULT now()
);
```

**Purpose**: Complete AI usage tracking for cost control and analytics
**Key Features**:
- Per-interaction cost tracking (6 decimal precision)
- Token usage monitoring
- Quality scoring for AI improvements

### user_calibrations
```sql
CREATE TABLE user_calibrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  pattern_id text NOT NULL,
  persona_type text NOT NULL,
  total_score integer NOT NULL,
  responses jsonb NOT NULL,
  guidance_config jsonb NOT NULL,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  UNIQUE(user_id, pattern_id)
);
```

**Purpose**: Store AI persona calibration for personalized learning
**Key Features**:
- Per-pattern persona assignment
- Guidance configuration storage
- Response tracking for analysis

### user_achievements
```sql
CREATE TABLE user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id text NOT NULL,
  achievement_name text NOT NULL,
  achievement_data jsonb NOT NULL,
  unlocked_at timestamptz DEFAULT NOW(),
  created_at timestamptz DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

**Purpose**: Gamification system for motivation and progress tracking
**Key Features**:
- Unique achievements per user
- Flexible achievement data storage
- Unlock timestamp tracking

## Custom Types

```sql
CREATE TYPE user_subscription_status AS ENUM (
  'trial', 'active', 'canceled', 'past_due', 'unpaid'
);

CREATE TYPE learning_stage AS ENUM (
  'introduction', 'knowledge_check', 'hands_on_practice', 'mastery_assessment'
);
```

## Key Indexes

```sql
-- Performance-critical indexes
CREATE INDEX idx_learning_sessions_user_pattern ON learning_sessions(user_id, pattern_id);
CREATE INDEX idx_learning_sessions_active ON learning_sessions(user_id, completed_at) WHERE completed_at IS NULL;
CREATE INDEX idx_ai_interactions_user_created ON ai_interactions(user_id, created_at);
CREATE INDEX idx_ai_interactions_cost ON ai_interactions(user_id, created_at, cost_usd);
```

## Database Functions

### calculate_mastery_score(p_user_id uuid, p_pattern_id text) → numeric
Calculates overall pattern mastery based on multiple metrics.

### track_ai_usage(p_user_id uuid, p_session_id uuid, ...) → jsonb
Records AI interaction and returns updated usage statistics.

### update_learning_progress(p_user_id uuid, p_session_id uuid, ...) → jsonb
Updates session progress and triggers achievement checks.

## ⚠️ Schema Sync Issues Detected

### Missing from TypeScript Types (database.ts):

1. **user_calibrations table** - Missing entirely
   - Fields: persona_type, total_score, responses, guidance_config
   - Critical for AI personalization

2. **user_achievements table** - Missing entirely
   - Fields: achievement_id, achievement_name, achievement_data, unlocked_at
   - Required for gamification

3. **learning_sessions missing fields**:
   - `best_score` (numeric)
   - `current_score` (numeric)
   - `attempts_count` (integer)
   - `persona_type` (text)
   - `is_active` (boolean)

### Action Required:
Update `/supabase/types/database.ts` to include:
- Complete user_calibrations table definition
- Complete user_achievements table definition
- Missing fields in learning_sessions table

## RLS Policies Summary

All tables implement Row Level Security:
- Users can only access their own data
- Auth service user ID used for access control
- Separate policies for SELECT, INSERT, UPDATE operations

## Migration History

1. `20250101000001_initial_schema.sql` - Core tables and types
2. `20250101000002_auth_setup.sql` - Auth configuration
3. `20250101000003_learning_tables.sql` - Learning system tables
4. `20250101000004_ai_tracking.sql` - AI usage and billing
5. `20250101000005_rls_policies.sql` - Security policies
6. `20250624120013_add_calibration_achievements.sql` - Calibration and achievements
7. `20250624120523_add_is_active_to_learning_sessions.sql` - Session state tracking

## Cost Control Architecture

The schema implements a robust cost control system:
- Monthly AI usage limits per user ($3 default)
- Real-time cost tracking per interaction
- Materialized view for usage analytics
- Automatic cost accumulation on user profiles

## Performance Considerations

- Materialized view `monthly_ai_usage` requires periodic refresh
- JSONB fields used for flexible schema evolution
- Indexes optimized for common query patterns
- Unique constraints prevent data duplication

## Next Steps

1. **Sync TypeScript types** with actual schema
2. **Add missing table definitions** to database.ts
3. **Implement database type generation** from migrations
4. **Add schema validation tests** for sync verification
