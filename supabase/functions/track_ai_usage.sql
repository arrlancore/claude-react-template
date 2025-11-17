-- Function to track AI usage with cost limits and validation
-- Implements business logic for AI cost management

CREATE OR REPLACE FUNCTION track_ai_usage(
  p_user_id uuid,
  p_session_id uuid,
  p_interaction_type text,
  p_prompt_tokens integer,
  p_completion_tokens integer,
  p_model_used text,
  p_cost_usd numeric
) RETURNS jsonb AS $$
DECLARE
  current_monthly_cost numeric;
  user_limit numeric;
  user_status text;
  new_interaction_id uuid;
  result jsonb;
BEGIN
  -- Input validation
  IF p_prompt_tokens < 0 OR p_completion_tokens < 0 OR p_cost_usd < 0 THEN
    RAISE EXCEPTION 'Token counts and cost must be non-negative';
  END IF;

  IF p_interaction_type IS NULL OR trim(p_interaction_type) = '' THEN
    RAISE EXCEPTION 'Interaction type cannot be empty';
  END IF;

  IF p_model_used IS NULL OR trim(p_model_used) = '' THEN
    RAISE EXCEPTION 'Model used cannot be empty';
  END IF;

  -- Get user's monthly limit, current usage, and subscription status
  SELECT
    monthly_ai_usage_limit,
    current_month_ai_cost,
    subscription_status
  INTO user_limit, current_monthly_cost, user_status
  FROM user_profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Check subscription status
  IF user_status NOT IN ('trial', 'active') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'subscription_inactive',
      'message', 'Subscription is not active'
    );
  END IF;

  -- Check if adding this cost would exceed limit
  IF (current_monthly_cost + p_cost_usd) > user_limit THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'usage_limit_exceeded',
      'message', 'Monthly AI usage limit would be exceeded',
      'current_cost', current_monthly_cost,
      'limit', user_limit,
      'attempted_cost', p_cost_usd
    );
  END IF;

  -- Validate session exists if provided
  IF p_session_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM learning_sessions
      WHERE id = p_session_id AND user_id = p_user_id
    ) THEN
      RAISE EXCEPTION 'Learning session not found or unauthorized';
    END IF;
  END IF;

  -- Log the AI interaction
  INSERT INTO ai_interactions (
    user_id,
    session_id,
    interaction_type,
    prompt_tokens,
    completion_tokens,
    model_used,
    cost_usd
  ) VALUES (
    p_user_id,
    p_session_id,
    p_interaction_type,
    p_prompt_tokens,
    p_completion_tokens,
    p_model_used,
    p_cost_usd
  ) RETURNING id INTO new_interaction_id;

  -- Update user's current month cost
  UPDATE user_profiles
  SET
    current_month_ai_cost = current_month_ai_cost + p_cost_usd,
    updated_at = now()
  WHERE id = p_user_id;

  -- Prepare success response
  result := jsonb_build_object(
    'success', true,
    'interaction_id', new_interaction_id,
    'new_monthly_cost', current_monthly_cost + p_cost_usd,
    'remaining_budget', user_limit - (current_monthly_cost + p_cost_usd),
    'usage_percentage', ROUND(((current_monthly_cost + p_cost_usd) / user_limit * 100), 2)
  );

  -- Add warning if approaching limit
  IF (current_monthly_cost + p_cost_usd) > (user_limit * 0.8) THEN
    result := result || jsonb_build_object(
      'warning', 'approaching_limit',
      'warning_message', 'You are approaching your monthly AI usage limit'
    );
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION track_ai_usage(uuid, uuid, text, integer, integer, text, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION track_ai_usage(uuid, uuid, text, integer, integer, text, numeric) TO service_role;
