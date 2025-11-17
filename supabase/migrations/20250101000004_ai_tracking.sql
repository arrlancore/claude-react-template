-- AI interaction logging and subscription management

-- AI interaction logging for cost tracking and analytics
CREATE TABLE ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES learning_sessions(id) ON DELETE SET NULL,
  interaction_type text NOT NULL, -- 'socratic_question', 'hint', 'assessment', etc.
  prompt_tokens integer NOT NULL CHECK (prompt_tokens >= 0),
  completion_tokens integer NOT NULL CHECK (completion_tokens >= 0),
  model_used text NOT NULL, -- 'gemini-2.5-pro', 'gemini-2.0-flash'
  cost_usd numeric(10,6) NOT NULL CHECK (cost_usd >= 0),
  response_quality_score numeric CHECK (response_quality_score >= 1 AND response_quality_score <= 5),
  user_feedback integer CHECK (user_feedback >= 1 AND user_feedback <= 5),
  created_at timestamptz DEFAULT now()
);

-- Indexes for cost queries
CREATE INDEX idx_ai_interactions_user_created ON ai_interactions(user_id, created_at);
CREATE INDEX idx_ai_interactions_cost ON ai_interactions(user_id, created_at, cost_usd);
CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id) WHERE session_id IS NOT NULL;

-- Monthly AI usage summary (materialized view for performance)
CREATE MATERIALIZED VIEW monthly_ai_usage AS
SELECT
  user_id,
  date_trunc('month', created_at) as month,
  COUNT(*) as interaction_count,
  SUM(prompt_tokens) as total_prompt_tokens,
  SUM(completion_tokens) as total_completion_tokens,
  SUM(cost_usd) as total_cost_usd,
  AVG(response_quality_score) as avg_quality_score
FROM ai_interactions
WHERE created_at >= date_trunc('month', now() - interval '12 months')
GROUP BY user_id, date_trunc('month', created_at);

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_monthly_ai_usage_unique ON monthly_ai_usage(user_id, month);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_monthly_ai_usage()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_ai_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Subscription and billing tracking
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  status text NOT NULL,
  plan_name text NOT NULL,
  plan_price_cents integer NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id) -- One active subscription per user
);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Payment history for record keeping
CREATE TABLE payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id text UNIQUE,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL, -- succeeded, failed, pending, etc.
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payment_history_user ON payment_history(user_id, created_at);
CREATE INDEX idx_payment_history_subscription ON payment_history(subscription_id);
