-- Production Data Seed for PatternLift
-- Only includes essential pattern data needed for production
-- No test users or sample data

-- Insert the Two Pointer pattern (MVP focus)
INSERT INTO patterns (
  id,
  name,
  description,
  difficulty,
  estimated_time_minutes,
  is_active,
  sort_order,
  metadata
) VALUES (
  'two-pointer',
  'Two Pointer Technique',
  'Master the art of using two pointers to solve array and string problems efficiently. This fundamental pattern appears in 40% of array/string interview questions and reduces time complexity from O(n²) to O(n).',
  'beginner',
  360, -- 6 hours estimated time
  true,
  1,
  jsonb_build_object(
    'prerequisites', ARRAY['arrays', 'basic_loops'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
    'interview_frequency', 'very_high',
    'success_metrics', jsonb_build_object(
      'pattern_recognition_time', 30,
      'implementation_time', 15,
      'transfer_success_rate', 80
    ),
    'level_structure', jsonb_build_object(
      'level_1', jsonb_build_object(
        'name', 'Interview Ready',
        'problems', 8,
        'estimated_time', '4-8 hours',
        'objective', 'Master core Two Pointer patterns for interview success'
      ),
      'level_2', jsonb_build_object(
        'name', 'Fluent Mastery',
        'problems', 4,
        'estimated_time', '2-4 hours',
        'objective', 'Handle all Two Pointer variations with confidence'
      ),
      'level_3', jsonb_build_object(
        'name', 'Expert Optimization',
        'problems', 3,
        'estimated_time', '3-5 hours',
        'objective', 'Master advanced optimizations and complex variations'
      )
    )
  )
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  estimated_time_minutes = EXCLUDED.estimated_time_minutes,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Insert placeholder patterns for future implementation (inactive for MVP)
INSERT INTO patterns (
  id,
  name,
  description,
  difficulty,
  estimated_time_minutes,
  is_active,
  sort_order,
  metadata
) VALUES
(
  'sliding-window',
  'Sliding Window Pattern',
  'Learn to optimize substring and subarray problems using the sliding window technique. Essential for string processing and array optimization problems.',
  'intermediate',
  300,
  false, -- Not active in MVP
  2,
  jsonb_build_object(
    'prerequisites', ARRAY['two-pointer', 'arrays'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'high',
    'coming_soon', true
  )
),
(
  'fast-slow-pointers',
  'Fast & Slow Pointers',
  'Master cycle detection and linked list manipulation using two pointers moving at different speeds. Critical for linked list interview questions.',
  'intermediate',
  240,
  false, -- Not active in MVP
  3,
  jsonb_build_object(
    'prerequisites', ARRAY['two-pointer', 'linked-lists'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'high',
    'coming_soon', true
  )
),
(
  'merge-intervals',
  'Merge Intervals Pattern',
  'Learn to handle overlapping intervals and scheduling problems. Common in system design and optimization questions.',
  'intermediate',
  180,
  false, -- Not active in MVP
  4,
  jsonb_build_object(
    'prerequisites', ARRAY['sorting', 'arrays'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'medium',
    'coming_soon', true
  )
),
(
  'binary-search',
  'Binary Search Pattern',
  'Master binary search and its variations for sorted arrays and search space optimization.',
  'intermediate',
  270,
  false, -- Not active in MVP
  5,
  jsonb_build_object(
    'prerequisites', ARRAY['arrays', 'sorting'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'high',
    'coming_soon', true
  )
),
(
  'tree-traversal',
  'Tree Traversal Patterns',
  'Master DFS, BFS, and tree manipulation patterns for binary trees and graphs.',
  'intermediate',
  360,
  false, -- Not active in MVP
  6,
  jsonb_build_object(
    'prerequisites', ARRAY['trees', 'recursion'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'very_high',
    'coming_soon', true
  )
),
(
  'dynamic-programming',
  'Dynamic Programming',
  'Learn to identify and solve optimization problems using dynamic programming approaches.',
  'advanced',
  480,
  false, -- Not active in MVP
  7,
  jsonb_build_object(
    'prerequisites', ARRAY['recursion', 'arrays'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'high',
    'coming_soon', true
  )
),
(
  'backtracking',
  'Backtracking Pattern',
  'Master recursive exploration and constraint satisfaction problems.',
  'advanced',
  300,
  false, -- Not active in MVP
  8,
  jsonb_build_object(
    'prerequisites', ARRAY['recursion', 'arrays'],
    'companies', ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    'interview_frequency', 'medium',
    'coming_soon', true
  )
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  estimated_time_minutes = EXCLUDED.estimated_time_minutes,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Verify the data was inserted correctly
DO $$
DECLARE
    active_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_count FROM patterns WHERE is_active = true;
    SELECT COUNT(*) INTO total_count FROM patterns;

    RAISE NOTICE 'Production data seeded successfully:';
    RAISE NOTICE '- Total patterns: %', total_count;
    RAISE NOTICE '- Active patterns: %', active_count;
    RAISE NOTICE '- MVP pattern: two-pointer (active)';
    RAISE NOTICE '- Future patterns: % (inactive)', total_count - active_count;
END $$;
