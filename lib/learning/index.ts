/**
 * Learning System Index
 * Exports all learning-related functionality
 */

// Core types
export type {
  LearningSession,
  AttemptRecord,
  MasteryScores,
  StageProgress,
  AIContext,
  LearningStage,
  LearningLevel,
  GuidanceLevel,
  LearningPace,
  SyncStatus,
  SessionCreateRequest,
  SessionUpdateRequest,
  ProgressSaveRequest
} from './types';

// Store and state management
export { useLearningStore } from './store';

// React hooks
export {
  useLearningSession,
  useProgress,
  useProblemNavigation,
  useInteractiveState,
  useAIContext,
  useSessionMetrics,
  useAchievements,
  useCalibration
} from './hooks';

// Utility functions
export {
  calculateMasteryScores,
  isReadyForNextLevel,
  checkForAchievements,
  analyzeStrugglePatterns,
  getNextRecommendedAction,
  formatTimeSpent,
  calculateLearningVelocity,
  estimateTimeToCompletion
} from './utils';

/**
 * Helper function to initialize learning session
 * Convenience wrapper for common use case
 */
export const initializeLearningSession = async (userId: string, patternId: string) => {
  const store = useLearningStore.getState();
  await store.resumeOrCreateSession(userId, patternId);
  return store.currentSession;
};

/**
 * Helper function to get complete AI context
 * Convenience wrapper for AI integration
 */
export const getCompleteAIContext = () => {
  const store = useLearningStore.getState();
  return store.getAIContext();
};

/**
 * Helper function to record user interaction
 * Convenience wrapper for interactive elements
 */
export const recordUserInteraction = (response: any, problemId?: string) => {
  const store = useLearningStore.getState();
  const session = store.currentSession;

  if (!session) return;

  // Record as attempt if we have a problem context
  const currentProblem = problemId || session.stage_progress.current_problem;
  if (currentProblem) {
    store.recordAttempt({
      problem_id: currentProblem,
      success: response.correct || response.selectedOption === 'correct',
      time_spent_seconds: 30, // Default for quick interactions
      response_data: response,
      hints_used: 0,
      understanding_before: session.understanding_level,
      understanding_after: session.understanding_level
    });
  }

  // Clear interactive state if active
  if (session.stage_progress.current_interactive) {
    store.recordInteractiveResponse(response);
  }
};

/**
 * Helper function to update understanding with automatic achievement checking
 */
export const updateUnderstandingWithAchievements = (delta: number) => {
  const store = useLearningStore.getState();
  const session = store.currentSession;

  if (!session) return;

  // Update understanding
  store.updateUnderstanding(delta);

  // Check for new achievements
  const newAchievements = checkForAchievements(store.currentSession!);
  newAchievements.forEach(achievement => {
    store.unlockAchievement(achievement);
  });

  // Auto-save progress
  setTimeout(() => store.saveProgress(), 1000);
};
