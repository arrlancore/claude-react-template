-- Row Level Security (RLS) policies for all tables

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- ================================================
-- USER PROFILES POLICIES
-- ================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger)
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- LEARNING SESSIONS POLICIES
-- ================================================

-- Users can manage their own learning sessions
CREATE POLICY "Users can view own learning sessions"
  ON learning_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning sessions"
  ON learning_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning sessions"
  ON learning_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own learning sessions"
  ON learning_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- PATTERN PROGRESS POLICIES
-- ================================================

-- Users can view their own pattern progress
CREATE POLICY "Users can view own pattern progress"
  ON pattern_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own pattern progress
CREATE POLICY "Users can insert own pattern progress"
  ON pattern_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pattern progress
CREATE POLICY "Users can update own pattern progress"
  ON pattern_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ================================================
-- AI INTERACTIONS POLICIES
-- ================================================

-- Users can view their own AI interactions
CREATE POLICY "Users can view own AI interactions"
  ON ai_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert AI interactions (service role only)
CREATE POLICY "System can insert AI interactions"
  ON ai_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update feedback on their interactions
CREATE POLICY "Users can update own AI interaction feedback"
  ON ai_interactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- SUBSCRIPTIONS POLICIES
-- ================================================

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can manage subscriptions
CREATE POLICY "System can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ================================================
-- PAYMENT HISTORY POLICIES
-- ================================================

-- Users can view their own payment history
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert payment records
CREATE POLICY "System can insert payment history"
  ON payment_history FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ================================================
-- PATTERNS POLICIES (PUBLIC READ-ONLY)
-- ================================================

-- Patterns are publicly readable
CREATE POLICY "Patterns are publicly readable"
  ON patterns FOR SELECT
  USING (true);

-- Only admins can manage patterns
CREATE POLICY "Admins can manage patterns"
  ON patterns FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ================================================
-- SERVICE ROLE POLICIES (ADMIN ACCESS)
-- ================================================

-- Service role has full access to user_profiles
CREATE POLICY "Service role has full access to user_profiles"
  ON user_profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Service role has full access to learning_sessions
CREATE POLICY "Service role has full access to learning_sessions"
  ON learning_sessions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Service role has full access to ai_interactions
CREATE POLICY "Service role has full access to ai_interactions"
  ON ai_interactions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Service role has full access to pattern_progress
CREATE POLICY "Service role has full access to pattern_progress"
  ON pattern_progress FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ================================================
-- MATERIALIZED VIEW ACCESS
-- ================================================

-- Grant access to materialized view
GRANT SELECT ON monthly_ai_usage TO authenticated;
GRANT SELECT ON monthly_ai_usage TO service_role;

-- ================================================
-- FUNCTION PERMISSIONS
-- ================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION reset_monthly_ai_costs() TO service_role;
GRANT EXECUTE ON FUNCTION refresh_monthly_ai_usage() TO service_role;
