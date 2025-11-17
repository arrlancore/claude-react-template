import { useLearningStore } from "./store";
import { AttemptRecord, LearningSession, AIContext } from "./types";

/**
 * React hooks for learning session management
 */

export const useLearningSession = (userId: string) => {
  const {
    currentSession,
    isLoading,
    syncStatus,
    error,
    resumeOrCreateSession,
    completeLevel,
    completeSession,
    clearError,
    reset,
  } = useLearningStore();

  return {
    session: currentSession,
    isLoading,
    syncStatus,
    error,
    resumeOrCreateSession: (patternId: string, personaType?: string) =>
      resumeOrCreateSession(userId, patternId),
    completeLevel,
    completeSession,
    clearError,
    reset,

    // Derived state
    isSessionActive: !!currentSession && !currentSession.completed_at,
    currentPattern: currentSession?.pattern_id,
    currentLevel: currentSession?.current_level,
    currentStage: currentSession?.current_stage,
    understandingLevel: currentSession?.understanding_level || 0,
    masteryScore: currentSession?.mastery_scores?.overall || 0,
  };
};

export const useProgress = () => {
  const {
    currentSession,
    updateUnderstanding,
    recordAttempt,
    addStruggleIndicator,
    unlockAchievement,
    saveProgress,
  } = useLearningStore();

  return {
    // Current progress metrics
    understandingLevel: currentSession?.understanding_level || 0,
    masteryScores: currentSession?.mastery_scores,
    strugglesCount: currentSession?.struggle_indicators?.length || 0,
    problemsCompleted: currentSession?.stage_progress?.problems_completed || [],
    achievements: currentSession?.stage_progress?.achievements_unlocked || [],

    // Progress actions
    updateUnderstanding,
    recordAttempt,
    addStruggleIndicator,
    unlockAchievement,
    saveProgress,

    // Progress analysis
    isStruggling: (currentSession?.struggle_indicators?.length || 0) >= 3,
    needsSupport: (currentSession?.understanding_level || 0) < 40,
    isExcelling: (currentSession?.understanding_level || 0) > 80,
  };
};

export const useProblemNavigation = () => {
  const { currentSession, startProblem, completeProblem, moveToNextStage } =
    useLearningStore();

  return {
    currentProblem: currentSession?.stage_progress.current_problem,
    currentStep: currentSession?.stage_progress.current_step || 1,
    problemsCompleted: currentSession?.stage_progress?.problems_completed || [],

    startProblem,
    completeProblem,
    moveToNextStage,

    // Navigation helpers
    isOnProblem: (problemId: string) =>
      currentSession?.stage_progress.current_problem === problemId,
    isProblemCompleted: (problemId: string) =>
      currentSession?.stage_progress?.problems_completed.includes(problemId) ||
      false,
  };
};

export const useInteractiveState = () => {
  const {
    currentSession,
    setInteractiveState,
    clearInteractiveState,
    recordInteractiveResponse,
  } = useLearningStore();

  return {
    currentInteractive: currentSession?.stage_progress.current_interactive,

    setInteractiveState,
    clearInteractiveState,
    recordInteractiveResponse,

    // Interactive helpers
    isInteractiveActive: !!currentSession?.stage_progress.current_interactive,
    interactiveType: currentSession?.stage_progress.current_interactive?.type,
    interactiveStartTime:
      currentSession?.stage_progress.current_interactive?.started_at,
  };
};

export const useAIContext = () => {
  const { getAIContext } = useLearningStore();

  return {
    getAIContext,

    // Helper to get context for API calls
    getContextForAPI: (): AIContext | null => {
      return getAIContext();
    },
  };
};

/**
 * Utility hooks for specific use cases
 */

export const useSessionMetrics = () => {
  const { currentSession } = useLearningStore();

  if (!currentSession) {
    return {
      totalAttempts: 0,
      successRate: 0,
      averageTime: 0,
      hintsUsed: 0,
      timeSpent: 0,
    };
  }

  const attempts = currentSession.attempt_history;
  const successfulAttempts = attempts.filter((a) => a.success);

  return {
    totalAttempts: attempts.length,
    successRate:
      attempts.length > 0
        ? (successfulAttempts.length / attempts.length) * 100
        : 0,
    averageTime:
      attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.time_spent_seconds, 0) /
          attempts.length
        : 0,
    hintsUsed: currentSession.stage_progress.hints_used,
    timeSpent: currentSession.stage_progress.time_spent_minutes,
  };
};

export const useAchievements = () => {
  const { currentSession, unlockAchievement } = useLearningStore();

  const achievements =
    currentSession?.stage_progress.achievements_unlocked || [];

  return {
    achievements,
    unlockAchievement,

    // Achievement checkers
    hasAchievement: (achievement: string) => achievements.includes(achievement),
    achievementCount: achievements.length,

    // Achievement analysis
    isSpeedLearner: achievements.includes("speed_learner"),
    isPatternSpotter: achievements.includes("pattern_spotter"),
    isFirstTry: achievements.includes("first_try"),
  };
};

/**
 * Hook for managing calibration and user preferences
 */
export const useCalibration = () => {
  const { currentSession } = useLearningStore();

  return {
    guidanceLevel: currentSession?.stage_progress.guidance_level || "balanced",
    aiPersona:
      currentSession?.stage_progress.ai_persona || "encouraging_mentor",
    learningPace: currentSession?.stage_progress.learning_pace || "balanced",

    // Calibration status
    isCalibrated: !!currentSession?.stage_progress.guidance_level,

    // Preference helpers
    needsDetailedGuidance:
      currentSession?.stage_progress.guidance_level === "detailed",
    needsMinimalGuidance:
      currentSession?.stage_progress.guidance_level === "minimal",
    prefersFastPace: currentSession?.stage_progress.learning_pace === "fast",
  };
};
