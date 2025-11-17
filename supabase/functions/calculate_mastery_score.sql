-- Function to calculate mastery score for a user's pattern progress
-- This implements the weighted scoring algorithm from the PRD

CREATE OR REPLACE FUNCTION calculate_mastery_score(
  p_user_id uuid,
  p_pattern_id text
) RETURNS numeric AS $$
DECLARE
  session_data record;
  concept_score numeric;
  problem_score numeric;
  pattern_score numeric;
  final_score numeric;
  attempt_record jsonb;
  total_attempts integer := 0;
  successful_attempts integer := 0;
BEGIN
  -- Get learning session data
  SELECT
    understanding_level,
    mastery_scores,
    attempt_history,
    struggle_indicators
  INTO session_data
  FROM learning_sessions
  WHERE user_id = p_user_id AND pattern_id = p_pattern_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Calculate concept understanding score (40% weight)
  -- Cap at 100 and ensure it's not negative
  concept_score := LEAST(GREATEST(session_data.understanding_level, 0), 100.0);

  -- Calculate problem solving score (35% weight)
  -- Extract average score from attempt history for hands-on practice
  problem_score := 0;

  IF session_data.attempt_history IS NOT NULL THEN
    FOR attempt_record IN SELECT * FROM jsonb_array_elements(session_data.attempt_history)
    LOOP
      IF attempt_record->>'stage' = 'hands_on_practice' AND
         attempt_record->>'score' IS NOT NULL THEN
        total_attempts := total_attempts + 1;
        problem_score := problem_score + COALESCE((attempt_record->>'score')::numeric, 0);

        -- Count successful attempts (score >= 80)
        IF (attempt_record->>'score')::numeric >= 80 THEN
          successful_attempts := successful_attempts + 1;
        END IF;
      END IF;
    END LOOP;

    -- Calculate average problem score
    IF total_attempts > 0 THEN
      problem_score := problem_score / total_attempts;
    END IF;
  END IF;

  -- Calculate pattern recognition score (25% weight)
  -- Based on understanding level and lack of struggle indicators
  pattern_score := CASE
    WHEN session_data.understanding_level > 80 AND
         array_length(session_data.struggle_indicators, 1) <= 2 THEN 85.0
    WHEN session_data.understanding_level > 70 THEN 70.0
    WHEN session_data.understanding_level > 60 THEN 55.0
    ELSE 30.0
  END;

  -- Apply bonus for consistent performance
  IF successful_attempts > 0 AND total_attempts > 0 THEN
    DECLARE
      success_rate numeric := successful_attempts::numeric / total_attempts::numeric;
    BEGIN
      IF success_rate >= 0.8 THEN
        pattern_score := pattern_score + 10.0;
      ELSIF success_rate >= 0.6 THEN
        pattern_score := pattern_score + 5.0;
      END IF;
    END;
  END IF;

  -- Apply penalty for excessive struggle indicators
  IF array_length(session_data.struggle_indicators, 1) > 5 THEN
    pattern_score := pattern_score - 15.0;
  ELSIF array_length(session_data.struggle_indicators, 1) > 3 THEN
    pattern_score := pattern_score - 8.0;
  END IF;

  -- Ensure pattern score is within bounds
  pattern_score := LEAST(GREATEST(pattern_score, 0), 100.0);

  -- Weighted final score calculation
  final_score := (concept_score * 0.4) + (problem_score * 0.35) + (pattern_score * 0.25);

  -- Ensure final score is within valid range
  final_score := LEAST(GREATEST(final_score, 0), 100.0);

  RETURN ROUND(final_score, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_mastery_score(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_mastery_score(uuid, text) TO service_role;
