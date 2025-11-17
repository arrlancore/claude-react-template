-- Drop existing tables
DROP TABLE IF EXISTS learning_sessions CASCADE;
DROP TABLE IF EXISTS user_calibrations CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;

-- Recreate learning_sessions table
CREATE TABLE learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  pattern_id text REFERENCES patterns(id),
  level integer DEFAULT 1,
  current_problem_id text,
  is_active boolean DEFAULT true,
  best_score integer DEFAULT 0,
  current_score integer DEFAULT 0,
  attempts_count integer DEFAULT 0,
  persona_type text DEFAULT 'balanced_learner',
  started_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  progress_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_calibrations table
CREATE TABLE user_calibrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  calibration_type text NOT NULL,
  calibration_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_name text NOT NULL,
  achievement_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_learning_sessions_updated_at
  BEFORE UPDATE ON learning_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_calibrations_updated_at
  BEFORE UPDATE ON user_calibrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
