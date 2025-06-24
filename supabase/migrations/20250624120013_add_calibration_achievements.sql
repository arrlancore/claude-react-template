-- Add new columns to existing learning_sessions table
ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS best_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS attempts_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS persona_type text DEFAULT 'balanced_learner';

-- Create user_calibrations table
CREATE TABLE IF NOT EXISTS user_calibrations (
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

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id text NOT NULL,
  achievement_name text NOT NULL,
  achievement_data jsonb NOT NULL,
  unlocked_at timestamptz DEFAULT NOW(),
  created_at timestamptz DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_calibrations_user_pattern ON user_calibrations(user_id, pattern_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_persona ON learning_sessions(persona_type);

-- Add RLS policies for user_calibrations
ALTER TABLE user_calibrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calibrations" ON user_calibrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calibrations" ON user_calibrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calibrations" ON user_calibrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Add RLS policies for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE user_calibrations IS 'Stores user persona calibration results for personalized AI guidance';
COMMENT ON TABLE user_achievements IS 'Tracks unlocked achievements for gamification and progress motivation';
COMMENT ON COLUMN learning_sessions.best_score IS 'Highest score achieved across all attempts';
COMMENT ON COLUMN learning_sessions.current_score IS 'Score for the current active session';
COMMENT ON COLUMN learning_sessions.attempts_count IS 'Number of learning attempts for this pattern';
COMMENT ON COLUMN learning_sessions.persona_type IS 'AI persona type for personalized guidance';
