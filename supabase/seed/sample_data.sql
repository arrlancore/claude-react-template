-- Sample data for testing and development
-- This file creates realistic test data for development purposes

-- Insert test user profiles (for development only)
INSERT INTO user_profiles (id, email, full_name, subscription_status, subscription_tier, learning_preferences) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'test.user@example.com',
  'Test User',
  'trial',
  'basic',
  '{"preferred_pace": "balanced", "learning_style": "visual", "experience_level": "intermediate"}'::jsonb
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'advanced.user@example.com',
  'Advanced User',
  'active',
  'premium',
  '{"preferred_pace": "fast", "learning_style": "hands_on", "experience_level": "advanced"}'::jsonb
),
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
  'beginner.user@example.com',
  'Beginner User',
  'trial',
  'basic',
  '{"preferred_pace": "slow", "learning_style": "explanatory", "experience_level": "beginner"}'::jsonb
);

-- Insert sample learning sessions
INSERT INTO learning_sessions (id, user_id, pattern_id, current_stage, current_level, understanding_level, stage_progress, attempt_history) VALUES
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'two-pointer',
  'hands_on_practice',
  1,
  75.5,
  '{"introduction_completed": true, "knowledge_check_passed": true, "current_problem": "two-sum-ii"}'::jsonb,
  '[
    {
      "timestamp": 1704067200,
      "stage": "introduction",
      "score": 85,
      "time_taken": 15,
      "understanding_before": 50,
      "understanding_after": 65
    },
    {
      "timestamp": 1704070800,
      "stage": "knowledge_check",
      "score": 90,
      "time_taken": 8,
      "understanding_before": 65,
      "understanding_after": 75
    }
  ]'::jsonb
),
(
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid,
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'two-pointer',
  'mastery_assessment',
  2,
  92.0,
  '{"level_1_completed": true, "level_2_progress": 80}'::jsonb,
  '[
    {
      "timestamp": 1704067200,
      "stage": "hands_on_practice",
      "score": 95,
      "time_taken": 12,
      "understanding_before": 80,
      "understanding_after": 90
    }
  ]'::jsonb
);

-- Insert sample pattern progress (completed patterns)
INSERT INTO pattern_progress (user_id, pattern_id, level_completed, mastery_score, completed_stages, time_spent_minutes, problems_solved, hints_used) VALUES
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'two-pointer',
  1,
  88.5,
  ARRAY['introduction', 'knowledge_check', 'hands_on_practice', 'mastery_assessment'],
  240,
  8,
  2
);

-- Insert sample AI interactions
INSERT INTO ai_interactions (user_id, session_id, interaction_type, prompt_tokens, completion_tokens, model_used, cost_usd, response_quality_score) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'socratic_question',
  150,
  300,
  'gemini-2.5-pro',
  0.003125,
  4.5
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid,
  'hint_request',
  80,
  150,
  'gemini-2.5-pro',
  0.001600,
  4.2
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'::uuid,
  'pattern_validation',
  200,
  400,
  'gemini-2.5-pro',
  0.004250,
  4.8
);

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, status, plan_name, plan_price_cents, current_period_start, current_period_end) VALUES
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
  'sub_test_12345',
  'cus_test_12345',
  'active',
  'Premium Monthly',
  1900,
  '2024-01-01 00:00:00+00'::timestamptz,
  '2024-02-01 00:00:00+00'::timestamptz
);

-- Update AI costs for test users
UPDATE user_profiles
SET current_month_ai_cost = 0.85
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;

UPDATE user_profiles
SET current_month_ai_cost = 1.25
WHERE id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid;

-- Verification
DO $$
DECLARE
  user_count integer;
  session_count integer;
  interaction_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM user_profiles WHERE email LIKE '%@example.com';
  SELECT COUNT(*) INTO session_count FROM learning_sessions;
  SELECT COUNT(*) INTO interaction_count FROM ai_interactions;

  RAISE NOTICE 'Sample data created: % users, % sessions, % AI interactions',
    user_count, session_count, interaction_count;
END $$;
