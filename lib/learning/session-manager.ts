import { SessionState, UserProgress, PersonaType } from "@/lib/types/learning";
import { supabase } from "@/lib/supabase/client";

export class SessionManager {
  private supabase = supabase;

  async createSession(
    userId: string,
    patternId: string,
    level: number = 1,
    personaType?: string
  ): Promise<SessionState> {
    const sessionData = {
      user_id: userId,
      pattern_id: patternId,
      level,
      is_active: true,
      best_score: 0,
      current_score: 0,
      attempts_count: 0,
      persona_type: personaType || "balanced_learner",
      started_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      progress_data: {
        problems_completed: [],
        understanding_level: 50,
        pattern_recognition_times: [],
        implementation_times: [],
        hints_used_per_problem: {},
        achievements_unlocked: [],
      },
    };

    const { data, error } = await this.supabase
      .from("learning_sessions")
      .insert(sessionData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);

    return {
      session_id: data.id,
      ...sessionData,
    };
  }

  async getActiveSession(
    userId: string,
    patternId: string
  ): Promise<SessionState | null> {
    const { data, error } = await this.supabase
      .from("learning_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("pattern_id", patternId)
      .eq("is_active", true)
      .order("last_activity_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      session_id: data.id,
      user_id: data.user_id,
      pattern_id: data.pattern_id,
      level: data.level,
      current_problem_id: data.current_problem_id,
      is_active: data.is_active,
      best_score: data.best_score || 0,
      current_score: data.current_score || 0,
      attempts_count: data.attempts_count || 0,
      persona_type: data.persona_type || "balanced_learner",
      started_at: data.started_at,
      last_activity_at: data.last_activity_at,
      progress_data: data.progress_data || {
        problems_completed: [],
        understanding_level: 50,
        pattern_recognition_times: [],
        implementation_times: [],
        hints_used_per_problem: {},
        achievements_unlocked: [],
      },
    };
  }

  async resumeOrCreateSession(
    userId: string,
    patternId: string,
    personaType?: string
  ): Promise<SessionState> {
    const existingSession = await this.getActiveSession(userId, patternId);

    if (existingSession) {
      // Update last activity
      await this.updateLastActivity(existingSession.session_id);
      return existingSession;
    }

    return this.createSession(userId, patternId, 1, personaType);
  }

  async updateSession(
    sessionId: string,
    updates: Partial<SessionState>
  ): Promise<void> {
    const updateData = {
      ...updates,
      last_activity_at: new Date().toISOString(),
    };

    const { error } = await this.supabase
      .from("learning_sessions")
      .update(updateData)
      .eq("id", sessionId);

    if (error) throw new Error(`Failed to update session: ${error.message}`);
  }

  async updateScore(sessionId: string, newScore: number): Promise<void> {
    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error("Session not found");

    const updates: Partial<SessionState> = {
      current_score: newScore,
      attempts_count: session.attempts_count + 1,
    };

    // Update best score if this is better
    if (newScore > session.best_score) {
      updates.best_score = newScore;
    }

    await this.updateSession(sessionId, updates);
  }

  async updateProgress(
    sessionId: string,
    progressUpdate: {
      problemId?: string;
      completionTime?: number;
      hintsUsed?: number;
      recognitionTime?: number;
      understandingLevel?: number;
      achievement?: string;
    }
  ): Promise<void> {
    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error("Session not found");

    const progressData = { ...session.progress_data };

    if (progressUpdate.problemId) {
      if (!progressData.problems_completed.includes(progressUpdate.problemId)) {
        progressData.problems_completed.push(progressUpdate.problemId);
      }
      session.current_problem_id = progressUpdate.problemId;
    }

    if (progressUpdate.completionTime) {
      progressData.implementation_times.push(progressUpdate.completionTime);
    }

    if (progressUpdate.recognitionTime) {
      progressData.pattern_recognition_times.push(
        progressUpdate.recognitionTime
      );
    }

    if (progressUpdate.hintsUsed !== undefined && progressUpdate.problemId) {
      progressData.hints_used_per_problem[progressUpdate.problemId] =
        progressUpdate.hintsUsed;
    }

    if (progressUpdate.understandingLevel !== undefined) {
      progressData.understanding_level = progressUpdate.understandingLevel;
    }

    if (
      progressUpdate.achievement &&
      !progressData.achievements_unlocked.includes(progressUpdate.achievement)
    ) {
      progressData.achievements_unlocked.push(progressUpdate.achievement);
    }

    await this.updateSession(sessionId, {
      progress_data: progressData,
      current_problem_id: session.current_problem_id,
    });
  }

  async getSessionById(sessionId: string): Promise<SessionState | null> {
    const { data, error } = await this.supabase
      .from("learning_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !data) return null;

    return {
      session_id: data.id,
      user_id: data.user_id,
      pattern_id: data.pattern_id,
      level: data.level,
      current_problem_id: data.current_problem_id,
      is_active: data.is_active,
      best_score: data.best_score || 0,
      current_score: data.current_score || 0,
      attempts_count: data.attempts_count || 0,
      persona_type: data.persona_type || "balanced_learner",
      started_at: data.started_at,
      last_activity_at: data.last_activity_at,
      progress_data: data.progress_data || {
        problems_completed: [],
        understanding_level: 50,
        pattern_recognition_times: [],
        implementation_times: [],
        hints_used_per_problem: {},
        achievements_unlocked: [],
      },
    };
  }

  async completeLevel(sessionId: string, level: number): Promise<void> {
    const session = await this.getSessionById(sessionId);
    if (!session) throw new Error("Session not found");

    await this.updateSession(sessionId, {
      level: level + 1,
      current_problem_id: undefined, // Reset for next level
    });
  }

  async getUserProgress(
    userId: string,
    patternId: string
  ): Promise<UserProgress | null> {
    const session = await this.getActiveSession(userId, patternId);
    if (!session) return null;

    const avgRecognitionTime =
      session.progress_data.pattern_recognition_times.length > 0
        ? session.progress_data.pattern_recognition_times.reduce(
            (a, b) => a + b,
            0
          ) / session.progress_data.pattern_recognition_times.length
        : 0;

    const avgImplementationTime =
      session.progress_data.implementation_times.length > 0
        ? session.progress_data.implementation_times.reduce(
            (a, b) => a + b,
            0
          ) / session.progress_data.implementation_times.length
        : 0;

    const totalHints = Object.values(
      session.progress_data.hints_used_per_problem
    ).reduce((a, b) => a + b, 0);

    const totalTimeSpent = session.progress_data.implementation_times.reduce(
      (a, b) => a + b,
      0
    );

    return {
      user_id: userId,
      pattern_id: patternId,
      level: session.level,
      problems_completed: session.progress_data.problems_completed.length,
      total_problems: this.getTotalProblemsForLevel(session.level),
      understanding_level: session.progress_data.understanding_level,
      pattern_recognition_speed: avgRecognitionTime,
      implementation_accuracy: session.current_score,
      hints_used: totalHints,
      total_time_spent: totalTimeSpent,
      achievements: [], // Will be populated by achievement engine
      persona_type: undefined, // Will be populated by calibration engine
    };
  }

  private getTotalProblemsForLevel(level: number): number {
    const problemCounts = {
      1: 8, // Level 1: Interview Ready
      2: 4, // Level 2: Additional problems
      3: 4, // Level 3: Expert level
    };
    return problemCounts[level as keyof typeof problemCounts] || 8;
  }

  async updateLastActivity(sessionId: string): Promise<void> {
    const { error } = await this.supabase
      .from("learning_sessions")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("id", sessionId);

    if (error) {
      console.error("Failed to update last activity:", error);
    }
  }

  async deactivateSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, { is_active: false });
  }

  async getUserSessions(userId: string): Promise<SessionState[]> {
    const { data, error } = await this.supabase
      .from("learning_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("last_activity_at", { ascending: false });

    if (error) throw new Error(`Failed to get user sessions: ${error.message}`);

    return data.map((session) => ({
      session_id: session.id,
      user_id: session.user_id,
      pattern_id: session.pattern_id,
      level: session.level,
      current_problem_id: session.current_problem_id,
      is_active: session.is_active,
      best_score: session.best_score || 0,
      current_score: session.current_score || 0,
      attempts_count: session.attempts_count || 0,
      persona_type: session.persona_type || "balanced_learner",
      started_at: session.started_at,
      last_activity_at: session.last_activity_at,
      progress_data: session.progress_data || {
        problems_completed: [],
        understanding_level: 50,
        pattern_recognition_times: [],
        implementation_times: [],
        hints_used_per_problem: {},
        achievements_unlocked: [],
      },
    }));
  }
}

export const sessionManager = new SessionManager();
