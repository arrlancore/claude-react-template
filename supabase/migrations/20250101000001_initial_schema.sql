-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_subscription_status AS ENUM (
  'trial', 'active', 'canceled', 'past_due', 'unpaid'
);

CREATE TYPE learning_stage AS ENUM (
  'introduction', 'knowledge_check', 'hands_on_practice', 'mastery_assessment'
);

-- Core user profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  subscription_status user_subscription_status DEFAULT 'trial',
  subscription_tier text DEFAULT 'basic',
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  monthly_ai_usage_limit numeric DEFAULT 3.00, -- $3 monthly limit
  current_month_ai_cost numeric DEFAULT 0.00,
  learning_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
