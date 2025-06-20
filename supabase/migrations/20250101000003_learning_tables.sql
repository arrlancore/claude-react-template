-- Learning system tables for patterns, sessions, and progress tracking

-- Simplified patterns table - detailed config stored in files
CREATE TABLE patterns (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_patterns_updated_at
  BEFORE UPDATE ON patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Learning sessions tracking
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
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, pattern_id) -- One active session per pattern per user
);

CREATE TRIGGER update_learning_sessions_updated_at
  BEFORE UPDATE ON learning_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Pattern progress tracking (for completed patterns)
CREATE TABLE pattern_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  pattern_id text REFERENCES patterns(id),
  level_completed integer NOT NULL CHECK (level_completed IN (1, 2, 3)),
  mastery_score numeric NOT NULL CHECK (mastery_score >= 0 AND mastery_score <= 100),
  completed_stages text[] NOT NULL,
  time_spent_minutes integer DEFAULT 0,
  problems_solved integer DEFAULT 0,
  hints_used integer DEFAULT 0,
  last_review_at timestamptz,
  next_review_at timestamptz,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, pattern_id, level_completed)
);

CREATE TRIGGER update_pattern_progress_updated_at
  BEFORE UPDATE ON pattern_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_learning_sessions_user_pattern ON learning_sessions(user_id, pattern_id);
CREATE INDEX idx_learning_sessions_active ON learning_sessions(user_id, completed_at) WHERE completed_at IS NULL;
CREATE INDEX idx_pattern_progress_user ON pattern_progress(user_id, pattern_id);
CREATE INDEX idx_pattern_progress_review ON pattern_progress(next_review_at) WHERE next_review_at IS NOT NULL;
