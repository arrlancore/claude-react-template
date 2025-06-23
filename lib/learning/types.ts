// Types for learning session state management
// Aligned with curriculum structure and database schema

export type LearningStage = 'introduction' | 'practice' | 'mastery';
export type LearningLevel = 1 | 2 | 3; // Interview Ready → Fluent → Expert
export type GuidanceLevel = 'minimal' | 'balanced' | 'detailed';
export type LearningPace = 'fast' | 'balanced' | 'thorough';

export interface AttemptRecord {
  id: string;
  problem_id: string;
  timestamp: Date;
  success: boolean;
  time_spent_seconds: number;
  response_data: any; // Interactive response data
  hints_used: number;
  understanding_before: number;
  understanding_after: number;
}

export interface MasteryScores {
  concept_understanding: number;  // 40% weight
  problem_solving: number;        // 35% weight
  pattern_recognition: number;    // 25% weight
  overall: number;
}

export interface StageProgress {
  // Problem-level tracking
  current_problem?: string;
  problems_completed: string[];
  current_step: number;

  // Calibration results
  guidance_level: GuidanceLevel;
  ai_persona: string;
  learning_pace: LearningPace;

  // Interactive state
  current_interactive?: {
    type: string;
    data: any;
    started_at: Date;
  };
  hints_used: number;
  time_spent_minutes: number;

  // Achievement tracking
  achievements_unlocked: string[];
  speed_records: Record<string, number>; // problem_id -> best_time
}

export interface LearningSession {
  // Database mapping
  id: string;
  user_id: string;
  pattern_id: string;

  // Curriculum Position
  current_stage: LearningStage;
  current_level: LearningLevel;
  stage_progress: StageProgress;

  // Learning Metrics (from curriculum)
  understanding_level: number; // 0-100 (tracked in real-time)
  attempt_history: AttemptRecord[];
  struggle_indicators: string[];
  mastery_scores: MasteryScores;

  // Timing
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AIContext {
  // Session Info
  session_id: string;
  pattern_id: string;
  current_stage: LearningStage;
  current_level: LearningLevel;

  // Performance Metrics
  understanding_level: number;
  mastery_scores: MasteryScores;
  recent_attempts: AttemptRecord[];
  struggle_patterns: string[];

  // Curriculum Position
  problems_completed: string[];
  current_problem?: string;
  guidance_level: GuidanceLevel;
  ai_persona: string;

  // Learning Preferences
  learning_pace: LearningPace;
  hints_preference: number;
  time_constraints?: string;

  // Interactive State
  current_interactive?: {
    type: string;
    started_at: Date;
    attempts: number;
  };
}

export interface SessionCreateRequest {
  user_id: string;
  pattern_id: string;
  initial_calibration?: {
    experience_level: string;
    timeline: string;
    preferences: Record<string, any>;
  };
}

export interface SessionUpdateRequest {
  session_id: string;
  updates: Partial<{
    current_stage: LearningStage;
    current_level: LearningLevel;
    stage_progress: Partial<StageProgress>;
    understanding_level: number;
    mastery_scores: Partial<MasteryScores>;
  }>;
}

export interface ProgressSaveRequest {
  session_id: string;
  attempt?: AttemptRecord;
  understanding_delta?: number;
  struggle_indicator?: string;
  achievement?: string;
}

export type SyncStatus = 'synced' | 'pending' | 'error' | 'syncing';
