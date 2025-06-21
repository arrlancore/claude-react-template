export interface AIConfig {
  apiKey: string;
  proModel: string;
  flashModel: string;
  maxTokens?: number;
  temperature?: number;
}

export interface UserProfile {
  id: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  learning_pace: 'fast' | 'balanced' | 'thorough';
  preferred_style: 'visual' | 'conceptual' | 'practical';
  current_pattern?: string;
  progress_data?: Record<string, any>;
}

export interface AssessmentRequest {
  user_id: string;
  pattern_id: string;
  assessment_type: 'initial' | 'progress' | 'mastery';
  user_input?: string;
  context?: Record<string, any>;
}

export interface AssessmentResponse {
  user_level: 'beginner' | 'intermediate' | 'advanced';
  learning_pace: 'fast' | 'balanced' | 'thorough';
  recommended_path: string[];
  confidence_score: number;
  next_action: 'start_learning' | 'review_prerequisites' | 'advance_level';
  ai_reasoning: string;
}

export interface GuidanceRequest {
  user_id: string;
  pattern_id: string;
  problem_id: string;
  user_input: string;
  context: {
    current_level: number;
    attempts: number;
    hint_level: number;
    user_profile: UserProfile;
  };
}

export interface GuidanceResponse {
  response_type: 'hint' | 'explanation' | 'encouragement' | 'correction' | 'next_step';
  content: string;
  hint_level: number;
  confidence_score: number;
  suggested_action: 'continue' | 'review' | 'advance' | 'practice_more';
  metadata: {
    response_time: number;
    token_usage: number;
    cost_estimate: number;
  };
}

export interface ValidationRequest {
  user_id: string;
  pattern_id: string;
  problem_id: string;
  user_solution: string;
  solution_approach: string;
  context: Record<string, any>;
}

export interface ValidationResponse {
  is_correct: boolean;
  pattern_recognition: boolean;
  efficiency_score: number;
  understanding_level: 'surface' | 'functional' | 'deep';
  feedback: string;
  improvement_suggestions: string[];
  transfer_likelihood: number;
  mastery_indicators: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    pattern_id?: string;
    problem_id?: string;
    message_type?: 'question' | 'answer' | 'hint' | 'explanation';
  };
}

export interface ChatRequest {
  user_id: string;
  message: string;
  context: {
    pattern_id?: string;
    problem_id?: string;
    conversation_history: ChatMessage[];
    user_profile: UserProfile;
  };
}

export interface ChatResponse {
  message: string;
  response_type: 'answer' | 'question' | 'guidance' | 'encouragement';
  suggested_actions: string[];
  metadata: {
    confidence: number;
    token_usage: number;
    cost_estimate: number;
  };
}

export interface AIUsageTracking {
  user_id: string;
  session_id: string;
  operation_type: 'assessment' | 'guidance' | 'validation' | 'chat';
  input_tokens: number;
  output_tokens: number;
  cost_estimate: number;
  response_time: number;
  timestamp: Date;
  pattern_id?: string;
  problem_id?: string;
}

export interface PromptTemplate {
  template_id: string;
  category: 'assessment' | 'guidance' | 'validation' | 'chat';
  subcategory: string;
  template: string;
  variables: string[];
  model_preference: 'pro' | 'flash' | 'either';
  max_tokens?: number;
  temperature?: number;
}

// AI Persona System Types
export type PersonaLevel = 'fast_learner' | 'balanced_learner' | 'struggling_learner';

export interface PersonaConfig {
  core_identity: string;
  explanation_depth: 'concise' | 'balanced' | 'detailed';
  challenge_level: 'advanced' | 'standard' | 'reinforcement';
  hint_style: 'minimal' | 'progressive' | 'gentle';
  celebration_style: string;
  pace_preference: string;
}

export interface TeachingStep {
  id: number;
  name: string;
  objective: string;
  execution: Record<PersonaLevel, string>;
}

export interface CalibrationRequest {
  user_id: string;
  responses: CalibrationResponse[];
}

export interface CalibrationResponse {
  question_id: string;
  answer: string;
  confidence?: number;
}

export interface PersonaCalibrationResult {
  persona_level: PersonaLevel;
  confidence_score: number;
  reasoning: string;
}
