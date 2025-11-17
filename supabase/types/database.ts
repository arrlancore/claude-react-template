export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          subscription_status:
            | "trial"
            | "active"
            | "canceled"
            | "past_due"
            | "unpaid";
          subscription_tier: string;
          trial_ends_at: string | null;
          monthly_ai_usage_limit: number;
          current_month_ai_cost: number;
          learning_preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          subscription_status?:
            | "trial"
            | "active"
            | "canceled"
            | "past_due"
            | "unpaid";
          subscription_tier?: string;
          trial_ends_at?: string | null;
          monthly_ai_usage_limit?: number;
          current_month_ai_cost?: number;
          learning_preferences?: Record<string, any>;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          subscription_status?:
            | "trial"
            | "active"
            | "canceled"
            | "past_due"
            | "unpaid";
          subscription_tier?: string;
          trial_ends_at?: string | null;
          monthly_ai_usage_limit?: number;
          current_month_ai_cost?: number;
          learning_preferences?: Record<string, any>;
        };
      };
      patterns: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_active?: boolean;
        };
      };
      learning_sessions: {
        Row: {
          id: string;
          user_id: string;
          pattern_id: string;
          current_problem_id: string | null;
          is_active: boolean;
          best_score: number;
          current_score: number;
          attempts_count: number;
          persona_type: string;
          started_at: string;
          last_activity_at: string;
          progress_data: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          pattern_id: string;
          current_problem_id?: string | null;
          is_active?: boolean;
          best_score?: number;
          current_score?: number;
          attempts_count?: number;
          persona_type?: string;
          started_at?: string;
          last_activity_at?: string;
          progress_data?: Record<string, any>;
        };
        Update: {
          current_problem_id?: string | null;
          is_active?: boolean;
          best_score?: number;
          current_score?: number;
          attempts_count?: number;
          persona_type?: string;
          started_at?: string;
          last_activity_at?: string;
          progress_data?: Record<string, any>;
        };
      };
      user_calibrations: {
        Row: {
          id: string;
          user_id: string;
          calibration_type: string;
          calibration_data: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          calibration_type: string;
          calibration_data?: Record<string, any>;
        };
        Update: {
          calibration_data?: Record<string, any>;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_name: string;
          achievement_data: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          achievement_name: string;
          achievement_data?: Record<string, any>;
        };
        Update: {
          achievement_data?: Record<string, any>;
        };
      };
      pattern_progress: {
        Row: {
          id: string;
          user_id: string;
          pattern_id: string;
          level_completed: number;
          mastery_score: number;
          completed_stages: string[];
          time_spent_minutes: number;
          problems_solved: number;
          hints_used: number;
          last_review_at: string | null;
          next_review_at: string | null;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          pattern_id: string;
          level_completed: number;
          mastery_score: number;
          completed_stages: string[];
          time_spent_minutes?: number;
          problems_solved?: number;
          hints_used?: number;
          last_review_at?: string | null;
          next_review_at?: string | null;
          review_count?: number;
        };
        Update: {
          mastery_score?: number;
          completed_stages?: string[];
          time_spent_minutes?: number;
          problems_solved?: number;
          hints_used?: number;
          last_review_at?: string | null;
          next_review_at?: string | null;
          review_count?: number;
        };
      };
      ai_interactions: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          interaction_type: string;
          prompt_tokens: number;
          completion_tokens: number;
          model_used: string;
          cost_usd: number;
          response_quality_score: number | null;
          user_feedback: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          session_id?: string | null;
          interaction_type: string;
          prompt_tokens: number;
          completion_tokens: number;
          model_used: string;
          cost_usd: number;
          response_quality_score?: number | null;
          user_feedback?: number | null;
        };
        Update: {
          response_quality_score?: number | null;
          user_feedback?: number | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: string;
          plan_name: string;
          plan_price_cents: number;
          current_period_start: string | null;
          current_period_end: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status: string;
          plan_name: string;
          plan_price_cents: number;
          current_period_start?: string | null;
          current_period_end?: string | null;
          canceled_at?: string | null;
        };
        Update: {
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          plan_name?: string;
          plan_price_cents?: number;
          current_period_start?: string | null;
          current_period_end?: string | null;
          canceled_at?: string | null;
        };
      };
      payment_history: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          stripe_payment_intent_id: string | null;
          amount_cents: number;
          currency: string;
          status: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          subscription_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount_cents: number;
          currency?: string;
          status: string;
          description?: string | null;
        };
      };
    };
    Views: {
      monthly_ai_usage: {
        Row: {
          user_id: string;
          month: string;
          interaction_count: number;
          total_prompt_tokens: number;
          total_completion_tokens: number;
          total_cost_usd: number;
          avg_quality_score: number | null;
        };
      };
    };
    Functions: {
      calculate_mastery_score: {
        Args: { p_user_id: string; p_pattern_id: string };
        Returns: number;
      };
      update_learning_progress: {
        Args: {
          p_user_id: string;
          p_session_id: string;
          p_progress_data: Record<string, any>;
          p_understanding_delta?: number;
        };
        Returns: Record<string, any>;
      };
      track_ai_usage: {
        Args: {
          p_user_id: string;
          p_session_id: string;
          p_interaction_type: string;
          p_prompt_tokens: number;
          p_completion_tokens: number;
          p_model_used: string;
          p_cost_usd: number;
        };
        Returns: Record<string, any>;
      };
      refresh_monthly_ai_usage: {
        Args: {};
        Returns: void;
      };
      reset_monthly_ai_costs: {
        Args: {};
        Returns: void;
      };
    };
  };
};

// Utility types for easier usage
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Pattern = Database["public"]["Tables"]["patterns"]["Row"];
export type LearningSession =
  Database["public"]["Tables"]["learning_sessions"]["Row"];
export type PatternProgress =
  Database["public"]["Tables"]["pattern_progress"]["Row"];
export type AIInteraction =
  Database["public"]["Tables"]["ai_interactions"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type PaymentHistory =
  Database["public"]["Tables"]["payment_history"]["Row"];
export type MonthlyAIUsage =
  Database["public"]["Views"]["monthly_ai_usage"]["Row"];

// Learning specific types
export type LearningStage =
  | "introduction"
  | "knowledge_check"
  | "hands_on_practice"
  | "mastery_assessment";
export type SubscriptionStatus =
  | "trial"
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid";

// Two Pointer Pattern specific types for MVP
export type TwoPointerProblem =
  | "two-sum-ii"
  | "valid-palindrome"
  | "container-with-water"
  | "move-zeroes"
  | "three-sum"
  | "remove-duplicates"
  | "sort-colors"
  | "remove-nth-node";

export type TwoPointerLevel = 1 | 2 | 3;

export interface TwoPointerSessionProgress {
  current_problem?: TwoPointerProblem;
  problems_completed: TwoPointerProblem[];
  level_1_problems: TwoPointerProblem[];
  introduction_completed: boolean;
  knowledge_check_passed: boolean;
  current_problem_attempts: number;
  hints_used_current_problem: number;
}

export interface AttemptRecord {
  timestamp: number;
  stage: LearningStage;
  score?: number;
  time_taken?: number;
  understanding_before: number;
  understanding_after: number;
  problem_id?: TwoPointerProblem;
  hints_used?: number;
}

export interface AIUsageResult {
  success: boolean;
  error?: "subscription_inactive" | "usage_limit_exceeded";
  message?: string;
  interaction_id?: string;
  new_monthly_cost?: number;
  remaining_budget?: number;
  usage_percentage?: number;
  warning?: "approaching_limit";
  warning_message?: string;
}

export interface MasteryCalculation {
  concept_understanding: number;
  problem_solving: number;
  pattern_recognition: number;
  overall_score: number;
}
