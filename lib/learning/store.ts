import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import {
  LearningSession,
  AttemptRecord,
  AIContext,
  SyncStatus,
  SessionCreateRequest,
  ProgressSaveRequest,
  MasteryScores,
  LearningStage,
  LearningLevel
} from './types';

interface LearningStore {
  // Core State
  currentSession: LearningSession | null;
  isLoading: boolean;
  syncStatus: SyncStatus;
  lastSyncAt?: Date;
  error?: string;

  // Session Management
  resumeOrCreateSession: (userId: string, patternId: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  completeLevel: (level: LearningLevel) => Promise<void>;
  completeSession: () => Promise<void>;

  // Progress Tracking (real-time updates)
  updateUnderstanding: (delta: number) => void;
  recordAttempt: (attempt: Omit<AttemptRecord, 'id' | 'timestamp'>) => void;
  addStruggleIndicator: (indicator: string) => void;
  unlockAchievement: (achievement: string) => void;

  // Problem Navigation
  startProblem: (problemId: string) => void;
  completeProblem: (problemId: string, success: boolean) => void;
  moveToNextStage: (stage: LearningStage) => void;

  // Interactive State Management
  setInteractiveState: (type: string, data: any) => void;
  clearInteractiveState: () => void;
  recordInteractiveResponse: (response: any) => void;

  // AI Context Generation
  getAIContext: () => AIContext | null;

  // Persistence & Sync
  saveProgress: () => Promise<void>;
  syncWithBackend: () => Promise<void>;

  // Utility Actions
  clearError: () => void;
  reset: () => void;
}

const initialMasteryScores: MasteryScores = {
  concept_understanding: 0,
  problem_solving: 0,
  pattern_recognition: 0,
  overall: 0
};

export const useLearningStore = create<LearningStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial State
        currentSession: null,
        isLoading: false,
        syncStatus: 'synced',
        lastSyncAt: undefined,
        error: undefined,

        // Session Management
        resumeOrCreateSession: async (userId: string, patternId: string) => {
          set({ isLoading: true, error: undefined });

          try {
            // First try to load existing session
            const response = await fetch('/api/learning/sessions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'resume_or_create',
                user_id: userId,
                pattern_id: patternId
              })
            });

            if (!response.ok) {
              throw new Error('Failed to load session');
            }

            const session: LearningSession = await response.json();
            set({
              currentSession: session,
              isLoading: false,
              syncStatus: 'synced',
              lastSyncAt: new Date()
            });

          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Unknown error',
              isLoading: false,
              syncStatus: 'error'
            });
          }
        },

        loadSession: async (sessionId: string) => {
          set({ isLoading: true, error: undefined });

          try {
            const response = await fetch(`/api/learning/sessions/${sessionId}`);
            if (!response.ok) {
              throw new Error('Session not found');
            }

            const session: LearningSession = await response.json();
            set({
              currentSession: session,
              isLoading: false,
              syncStatus: 'synced',
              lastSyncAt: new Date()
            });

          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Unknown error',
              isLoading: false,
              syncStatus: 'error'
            });
          }
        },

        completeLevel: async (level: LearningLevel) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedSession = {
            ...currentSession,
            current_level: Math.min(3, level + 1) as LearningLevel,
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
          await get().syncWithBackend();
        },

        completeSession: async () => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedSession = {
            ...currentSession,
            completed_at: new Date(),
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
          await get().syncWithBackend();
        },

        // Progress Tracking
        updateUnderstanding: (delta: number) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const newLevel = Math.max(0, Math.min(100, currentSession.understanding_level + delta));
          const updatedSession = {
            ...currentSession,
            understanding_level: newLevel,
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });

          // Auto-save after understanding changes
          setTimeout(() => get().saveProgress(), 1000);
        },

        recordAttempt: (attemptData: Omit<AttemptRecord, 'id' | 'timestamp'>) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const attempt: AttemptRecord = {
            ...attemptData,
            id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
          };

          const updatedSession = {
            ...currentSession,
            attempt_history: [...currentSession.attempt_history, attempt],
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
        },

        addStruggleIndicator: (indicator: string) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedIndicators = [...currentSession.struggle_indicators];
          if (!updatedIndicators.includes(indicator)) {
            updatedIndicators.push(indicator);
          }

          const updatedSession = {
            ...currentSession,
            struggle_indicators: updatedIndicators,
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
        },

        unlockAchievement: (achievement: string) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const achievements = currentSession.stage_progress.achievements_unlocked || [];
          if (!achievements.includes(achievement)) {
            const updatedSession = {
              ...currentSession,
              stage_progress: {
                ...currentSession.stage_progress,
                achievements_unlocked: [...achievements, achievement]
              },
              updated_at: new Date()
            };

            set({ currentSession: updatedSession, syncStatus: 'pending' });
          }
        },

        // Problem Navigation
        startProblem: (problemId: string) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedSession = {
            ...currentSession,
            stage_progress: {
              ...currentSession.stage_progress,
              current_problem: problemId,
              current_step: 1
            },
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
        },

        completeProblem: (problemId: string, success: boolean) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const completedProblems = currentSession.stage_progress.problems_completed || [];
          const updatedProblems = success && !completedProblems.includes(problemId)
            ? [...completedProblems, problemId]
            : completedProblems;

          const updatedSession = {
            ...currentSession,
            stage_progress: {
              ...currentSession.stage_progress,
              problems_completed: updatedProblems,
              current_problem: undefined
            },
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
        },

        moveToNextStage: (stage: LearningStage) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedSession = {
            ...currentSession,
            current_stage: stage,
            stage_progress: {
              ...currentSession.stage_progress,
              current_step: 1
            },
            updated_at: new Date()
          };

          set({ currentSession: updatedSession, syncStatus: 'pending' });
        },

        // Interactive State Management
        setInteractiveState: (type: string, data: any) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedSession = {
            ...currentSession,
            stage_progress: {
              ...currentSession.stage_progress,
              current_interactive: {
                type,
                data,
                started_at: new Date()
              }
            },
            updated_at: new Date()
          };

          set({ currentSession: updatedSession });
        },

        clearInteractiveState: () => {
          const { currentSession } = get();
          if (!currentSession) return;

          const updatedSession = {
            ...currentSession,
            stage_progress: {
              ...currentSession.stage_progress,
              current_interactive: undefined
            },
            updated_at: new Date()
          };

          set({ currentSession: updatedSession });
        },

        recordInteractiveResponse: (response: any) => {
          const { currentSession } = get();
          if (!currentSession?.stage_progress.current_interactive) return;

          // Record as attempt if we have current problem
          if (currentSession.stage_progress.current_problem) {
            const interactiveStartTime = currentSession.stage_progress.current_interactive.started_at;
            const timeSpent = Math.round((Date.now() - interactiveStartTime.getTime()) / 1000);

            get().recordAttempt({
              problem_id: currentSession.stage_progress.current_problem,
              success: response.correct || false,
              time_spent_seconds: timeSpent,
              response_data: response,
              hints_used: 0, // Interactive elements don't use hints
              understanding_before: currentSession.understanding_level,
              understanding_after: currentSession.understanding_level
            });
          }

          get().clearInteractiveState();
        },

        // AI Context Generation
        getAIContext: (): AIContext | null => {
          const { currentSession } = get();
          if (!currentSession) return null;

          const recentAttempts = currentSession.attempt_history
            .slice(-5) // Last 5 attempts
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          return {
            session_id: currentSession.id,
            pattern_id: currentSession.pattern_id,
            current_stage: currentSession.current_stage,
            current_level: currentSession.current_level,
            understanding_level: currentSession.understanding_level,
            mastery_scores: currentSession.mastery_scores,
            recent_attempts: recentAttempts,
            struggle_patterns: currentSession.struggle_indicators,
            problems_completed: currentSession.stage_progress.problems_completed,
            current_problem: currentSession.stage_progress.current_problem,
            guidance_level: currentSession.stage_progress.guidance_level,
            ai_persona: currentSession.stage_progress.ai_persona,
            learning_pace: currentSession.stage_progress.learning_pace,
            hints_preference: currentSession.stage_progress.hints_used,
            current_interactive: currentSession.stage_progress.current_interactive ? {
              type: currentSession.stage_progress.current_interactive.type,
              started_at: currentSession.stage_progress.current_interactive.started_at,
              attempts: recentAttempts.length
            } : undefined
          };
        },

        // Persistence & Sync
        saveProgress: async () => {
          const { currentSession, syncStatus } = get();
          if (!currentSession || syncStatus === 'syncing') return;

          set({ syncStatus: 'syncing' });

          try {
            const progressData: ProgressSaveRequest = {
              session_id: currentSession.id,
              // Include latest attempt if any
              ...(currentSession.attempt_history.length > 0 && {
                attempt: currentSession.attempt_history[currentSession.attempt_history.length - 1]
              })
            };

            const response = await fetch('/api/learning/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(progressData)
            });

            if (!response.ok) {
              throw new Error('Failed to save progress');
            }

            set({
              syncStatus: 'synced',
              lastSyncAt: new Date(),
              error: undefined
            });

          } catch (error) {
            set({
              syncStatus: 'error',
              error: error instanceof Error ? error.message : 'Sync failed'
            });
          }
        },

        syncWithBackend: async () => {
          const { currentSession } = get();
          if (!currentSession) return;

          set({ syncStatus: 'syncing' });

          try {
            const response = await fetch(`/api/learning/sessions/${currentSession.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                current_stage: currentSession.current_stage,
                current_level: currentSession.current_level,
                stage_progress: currentSession.stage_progress,
                understanding_level: currentSession.understanding_level,
                mastery_scores: currentSession.mastery_scores,
                struggle_indicators: currentSession.struggle_indicators,
                completed_at: currentSession.completed_at
              })
            });

            if (!response.ok) {
              throw new Error('Failed to sync with backend');
            }

            set({
              syncStatus: 'synced',
              lastSyncAt: new Date(),
              error: undefined
            });

          } catch (error) {
            set({
              syncStatus: 'error',
              error: error instanceof Error ? error.message : 'Sync failed'
            });
          }
        },

        // Utility Actions
        clearError: () => {
          set({ error: undefined });
        },

        reset: () => {
          set({
            currentSession: null,
            isLoading: false,
            syncStatus: 'synced',
            lastSyncAt: undefined,
            error: undefined
          });
        }
      }),
      {
        name: 'learning-store',
        partialize: (state) => ({
          currentSession: state.currentSession,
          lastSyncAt: state.lastSyncAt
        })
      }
    )
  )
);

// Auto-sync every 30 seconds if there are pending changes
useLearningStore.subscribe(
  (state) => state.syncStatus,
  (syncStatus) => {
    if (syncStatus === 'pending') {
      setTimeout(() => {
        const currentStatus = useLearningStore.getState().syncStatus;
        if (currentStatus === 'pending') {
          useLearningStore.getState().syncWithBackend();
        }
      }, 30000);
    }
  }
);
