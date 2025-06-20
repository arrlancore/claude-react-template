-- Function to update learning progress with validation and atomic updates
-- Ensures data consistency and applies business logic

CREATE OR REPLACE FUNCTION update_learning_progress(
  p_user_id uuid,
  p_session_id uuid,
  p_progress_data jsonb,
  p_understanding_delta numeric DEFAULT 0
) RETURNS jsonb AS $$
DECLARE
  current_session record;
  new_understanding_level numeric;
  result jsonb;
BEGIN
  -- Get current session state
  SELECT
    id,
    user_id,
    pattern_id,
    understanding_level,
    stage_progress,
    attempt_history,
    struggle_indicators
  INTO current_session
  FROM learning_sessions
  WHERE id = p_session_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Learning session not found or unauthorized access';
  END IF;

  -- Calculate new understanding level with bounds checking
  new_understanding_level := GREATEST(0, LEAST(100,
    current_session.understanding_level + p_understanding_delta
  ));

  -- Update the learning session
  UPDATE learning_sessions
  SET
    stage_progress = COALESCE(stage_progress, '{}'::jsonb) || p_progress_data,
    understanding_level = new_understanding_level,
    attempt_history = CASE
      WHEN p_progress_data ? 'new_attempt' THEN
        COALESCE(attempt_history, '[]'::jsonb) || jsonb_build_array(
          jsonb_build_object(
            'timestamp', extract(epoch from now()),
            'stage', COALESCE(p_progress_data->>'stage', 'unknown'),
            'score', p_progress_data->'new_attempt'->>'score',
            'time_taken', p_progress_data->'new_attempt'->>'time_taken',
            'understanding_before', current_session.understanding_level,
            'understanding_after', new_understanding_level
          )
        )
      ELSE attempt_history
    END,
    struggle_indicators = CASE
      WHEN p_progress_data ? 'struggle_indicator' THEN
        array_append(
          COALESCE(struggle_indicators, '{}'),
          p_progress_data->>'struggle_indicator'
        )
      ELSE struggle_indicators
    END,
    updated_at = now()
  WHERE id = p_session_id AND user_id = p_user_id;

  -- Check if session should be marked as completed
  IF p_progress_data ? 'mark_completed' AND (p_progress_data->>'mark_completed')::boolean THEN
    UPDATE learning_sessions
    SET completed_at = now()
    WHERE id = p_session_id AND user_id = p_user_id;

    -- Create pattern progress record
    INSERT INTO pattern_progress (
      user_id,
      pattern_id,
      level_completed,
      mastery_score,
      completed_stages,
      time_spent_minutes,
      problems_solved,
      hints_used
    ) VALUES (
      p_user_id,
      current_session.pattern_id,
      COALESCE((p_progress_data->>'level_completed')::integer, 1),
      calculate_mastery_score(p_user_id, current_session.pattern_id),
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(p_progress_data->'completed_stages')),
        '{}'
      ),
      COALESCE((p_progress_data->>'time_spent_minutes')::integer, 0),
      COALESCE((p_progress_data->>'problems_solved')::integer, 0),
      COALESCE((p_progress_data->>'hints_used')::integer, 0)
    ) ON CONFLICT (user_id, pattern_id, level_completed)
    DO UPDATE SET
      mastery_score = EXCLUDED.mastery_score,
      completed_stages = EXCLUDED.completed_stages,
      time_spent_minutes = EXCLUDED.time_spent_minutes,
      problems_solved = EXCLUDED.problems_solved,
      hints_used = EXCLUDED.hints_used,
      updated_at = now();
  END IF;

  -- Return updated session info
  SELECT jsonb_build_object(
    'session_id', p_session_id,
    'understanding_level', new_understanding_level,
    'understanding_delta', p_understanding_delta,
    'stage_progress', COALESCE(stage_progress, '{}'::jsonb) || p_progress_data,
    'updated_at', extract(epoch from now())
  ) INTO result
  FROM learning_sessions
  WHERE id = p_session_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_learning_progress(uuid, uuid, jsonb, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION update_learning_progress(uuid, uuid, jsonb, numeric) TO service_role;
