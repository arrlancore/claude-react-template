-- Seed data for patterns table - MVP focus on two-pointer only
-- Insert basic pattern information - detailed config stored in pattern files

INSERT INTO patterns (id, name, description, is_active) VALUES
(
  'two-pointer',
  'Two Pointer Technique',
  'Master the art of using two pointers to solve array and string problems efficiently',
  true
),
(
  'sliding-window',
  'Sliding Window Technique',
  'Learn to efficiently solve substring and subarray problems using the sliding window approach',
  false -- Not active in MVP
),
(
  'fast-slow-pointers',
  'Fast & Slow Pointers',
  'Master cycle detection and linked list problems using fast and slow pointer technique',
  false -- Not active in MVP
),
(
  'merge-intervals',
  'Merge Intervals',
  'Learn to solve overlapping intervals and scheduling problems efficiently',
  false -- Not active in MVP
),
(
  'binary-search',
  'Binary Search Patterns',
  'Master binary search variations and search space problems',
  false -- Not active in MVP
),
(
  'dynamic-programming',
  'Dynamic Programming Patterns',
  'Learn to identify and solve DP problems using systematic approaches',
  false -- Not active in MVP
),
(
  'tree-traversal',
  'Tree Traversal Patterns',
  'Master DFS, BFS, and tree manipulation techniques',
  false -- Not active in MVP
),
(
  'graph-algorithms',
  'Graph Algorithm Patterns',
  'Learn essential graph traversal and shortest path algorithms',
  false -- Not active in MVP
);

-- Verify the data was inserted correctly
DO $$
DECLARE
  pattern_count integer;
  active_count integer;
BEGIN
  SELECT COUNT(*) INTO pattern_count FROM patterns;
  SELECT COUNT(*) INTO active_count FROM patterns WHERE is_active = true;

  IF pattern_count = 8 AND active_count = 1 THEN
    RAISE NOTICE 'Successfully inserted % patterns (% active for MVP)', pattern_count, active_count;
  ELSE
    RAISE EXCEPTION 'Expected 8 patterns with 1 active, but found % patterns with % active', pattern_count, active_count;
  END IF;
END $$;
