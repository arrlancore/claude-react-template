export interface PersonaType {
  id: string
  name: string
  characteristics: string[]
  ai_approach: string
  guidance_config: GuidanceConfig
}

export interface GuidanceConfig {
  explanation_depth: 'minimal' | 'standard' | 'maximum'
  hint_frequency: 'low' | 'moderate' | 'high'
  celebration_style: 'challenge_oriented' | 'achievement_focused' | 'confidence_building'
  example_count: 'minimal' | 'standard' | 'multiple'
  pace_preference: 'rapid' | 'steady' | 'patient'
}

export interface CalibrationQuestion {
  id: string
  type: 'multiple_choice'
  text: string
  options: CalibrationOption[]
}

export interface CalibrationOption {
  id: string
  text: string
  weight: number
  follow_up: string
}

export interface CalibrationResult {
  total_score: number
  persona_type: PersonaType
  user_responses: Record<string, string>
  guidance_config: GuidanceConfig
}

export interface Achievement {
  id: string
  name: string
  description: string
  category: string
  icon: string
  unlock_condition: string
  points: number
  rarity: string
  unlocked_at?: string
}

export interface UserProgress {
  user_id: string
  pattern_id: string
  level: number
  problems_completed: number
  total_problems: number
  understanding_level: number
  pattern_recognition_speed: number
  implementation_accuracy: number
  hints_used: number
  total_time_spent: number
  achievements: Achievement[]
  persona_type?: PersonaType
}

export interface SessionState {
  session_id: string
  user_id: string
  pattern_id: string
  level: number
  current_problem_id?: string
  is_active: boolean
  best_score: number
  current_score: number
  attempts_count: number
  persona_type: string
  started_at: string
  last_activity_at: string
  progress_data: {
    problems_completed: string[]
    understanding_level: number
    pattern_recognition_times: number[]
    implementation_times: number[]
    hints_used_per_problem: Record<string, number>
    achievements_unlocked: string[]
  }
}
