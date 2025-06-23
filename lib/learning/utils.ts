/**
 * Utility functions for learning session calculations and analysis
 */

import {
  LearningSession,
  AttemptRecord,
  MasteryScores,
  LearningStage,
  LearningLevel
} from './types';

/**
 * Calculate mastery scores based on curriculum weights
 * Concept Understanding: 40%, Problem Solving: 35%, Pattern Recognition: 25%
 */
export const calculateMasteryScores = (session: LearningSession): MasteryScores => {
  const { understanding_level, attempt_history, stage_progress } = session;

  // Concept Understanding (40% weight) - based on understanding level
  const conceptScore = Math.min(understanding_level, 100);

  // Problem Solving (35% weight) - based on success rate and efficiency
  const problemScore = calculateProblemSolvingScore(attempt_history);

  // Pattern Recognition (25% weight) - based on speed and transfer
  const patternScore = calculatePatternRecognitionScore(attempt_history, stage_progress);

  // Overall weighted score
  const overall = Math.round(
    (conceptScore * 0.4) + (problemScore * 0.35) + (patternScore * 0.25)
  );

  return {
    concept_understanding: Math.round(conceptScore),
    problem_solving: Math.round(problemScore),
    pattern_recognition: Math.round(patternScore),
    overall: Math.max(0, Math.min(100, overall))
  };
};

const calculateProblemSolvingScore = (attempts: AttemptRecord[]): number => {
  if (attempts.length === 0) return 0;

  const recentAttempts = attempts.slice(-10); // Last 10 attempts
  const successRate = recentAttempts.filter(a => a.success).length / recentAttempts.length;
  const avgTime = recentAttempts.reduce((sum, a) => sum + a.time_spent_seconds, 0) / recentAttempts.length;

  // Score based on success rate (70%) and efficiency (30%)
  const successScore = successRate * 100;
  const efficiencyScore = Math.max(0, 100 - (avgTime / 60)); // Penalty for taking too long

  return (successScore * 0.7) + (efficiencyScore * 0.3);
};

const calculatePatternRecognitionScore = (attempts: AttemptRecord[], stageProgress: any): number => {
  if (attempts.length === 0) return 0;

  // Look for quick recognition (first attempts that succeed quickly)
  const quickRecognitions = attempts.filter(a =>
    a.success && a.time_spent_seconds < 300 && a.hints_used === 0
  );

  const recognitionRate = quickRecognitions.length / Math.max(attempts.length, 1);
  const transferSuccess = (stageProgress.problems_completed?.length || 0) / 8; // Assuming 8 problems per level

  return Math.min(100, (recognitionRate * 60) + (transferSuccess * 40));
};

/**
 * Determine if user is ready for next level based on curriculum criteria
 */
export const isReadyForNextLevel = (session: LearningSession): boolean => {
  const masteryScores = calculateMasteryScores(session);
  const { current_level, stage_progress } = session;

  const levelRequirements = {
    1: { // Interview Ready → Fluent Mastery
      minOverallScore: 80,
      minProblemsCompleted: 8,
      minUnderstanding: 75
    },
    2: { // Fluent Mastery → Expert
      minOverallScore: 85,
      minProblemsCompleted: 4,
      minUnderstanding: 80
    },
    3: { // Expert (already at max)
      minOverallScore: 100,
      minProblemsCompleted: 999,
      minUnderstanding: 100
    }
  };

  const requirements = levelRequirements[current_level as keyof typeof levelRequirements];
  const problemsCompleted = stage_progress.problems_completed?.length || 0;

  return (
    masteryScores.overall >= requirements.minOverallScore &&
    problemsCompleted >= requirements.minProblemsCompleted &&
    session.understanding_level >= requirements.minUnderstanding
  );
};

/**
 * Check what achievements user should unlock based on performance
 */
export const checkForAchievements = (session: LearningSession): string[] => {
  const newAchievements: string[] = [];
  const existing = session.stage_progress.achievements_unlocked || [];
  const recentAttempts = session.attempt_history.slice(-5);

  // Speed Learner - complete problems quickly
  if (!existing.includes('speed_learner')) {
    const fastCompletions = recentAttempts.filter(a => a.success && a.time_spent_seconds < 1800); // 30 minutes
    if (fastCompletions.length >= 3) {
      newAchievements.push('speed_learner');
    }
  }

  // Pattern Spotter - instant recognition
  if (!existing.includes('pattern_spotter')) {
    const instantRecognitions = recentAttempts.filter(a =>
      a.success && a.time_spent_seconds < 300 && a.hints_used === 0
    );
    if (instantRecognitions.length >= 2) {
      newAchievements.push('pattern_spotter');
    }
  }

  // First Try - no hints needed
  if (!existing.includes('first_try')) {
    const noHintSuccesses = recentAttempts.filter(a => a.success && a.hints_used === 0);
    if (noHintSuccesses.length >= 3) {
      newAchievements.push('first_try');
    }
  }

  // Transfer Master - cross-pattern connections
  if (!existing.includes('transfer_master') && session.current_level >= 2) {
    const problemsCompleted = session.stage_progress.problems_completed?.length || 0;
    if (problemsCompleted >= 10) {
      newAchievements.push('transfer_master');
    }
  }

  // Interview Ready - passed assessment
  if (!existing.includes('interview_ready')) {
    const masteryScores = calculateMasteryScores(session);
    if (masteryScores.overall >= 80 && session.current_level >= 1) {
      newAchievements.push('interview_ready');
    }
  }

  return newAchievements;
};

/**
 * Analyze user's struggle patterns and recommend interventions
 */
export const analyzeStrugglePatterns = (session: LearningSession): {
  strugglesDetected: string[];
  recommendations: string[];
  needsIntervention: boolean;
} => {
  const { struggle_indicators, understanding_level, attempt_history } = session;
  const recentAttempts = attempt_history.slice(-5);

  const strugglesDetected: string[] = [];
  const recommendations: string[] = [];

  // Low understanding level
  if (understanding_level < 40) {
    strugglesDetected.push('low_understanding');
    recommendations.push('Review core concepts with additional examples');
  }

  // Multiple failures
  const recentFailures = recentAttempts.filter(a => !a.success);
  if (recentFailures.length >= 3) {
    strugglesDetected.push('multiple_failures');
    recommendations.push('Take a break and review pattern fundamentals');
  }

  // High hint usage
  const avgHints = recentAttempts.reduce((sum, a) => sum + a.hints_used, 0) / Math.max(recentAttempts.length, 1);
  if (avgHints > 2) {
    strugglesDetected.push('high_hint_usage');
    recommendations.push('Focus on building independent problem-solving skills');
  }

  // Slow progress
  const avgTime = recentAttempts.reduce((sum, a) => sum + a.time_spent_seconds, 0) / Math.max(recentAttempts.length, 1);
  if (avgTime > 3600) { // More than 1 hour per problem
    strugglesDetected.push('slow_progress');
    recommendations.push('Consider switching to guided mode for more support');
  }

  // Pattern from struggle indicators
  const commonStruggles = struggle_indicators.reduce((acc, indicator) => {
    acc[indicator] = (acc[indicator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(commonStruggles).forEach(([pattern, count]) => {
    if (count >= 2) {
      strugglesDetected.push(pattern);
      recommendations.push(`Address recurring difficulty with ${pattern.replace('_', ' ')}`);
    }
  });

  return {
    strugglesDetected,
    recommendations,
    needsIntervention: strugglesDetected.length >= 2 || understanding_level < 30
  };
};

/**
 * Calculate optimal next action based on current state
 */
export const getNextRecommendedAction = (session: LearningSession): {
  action: 'continue_problem' | 'next_problem' | 'review_concept' | 'take_break' | 'level_up' | 'complete_session';
  reason: string;
  data?: any;
} => {
  const masteryScores = calculateMasteryScores(session);
  const { current_stage, stage_progress, understanding_level } = session;
  const isReady = isReadyForNextLevel(session);
  const struggles = analyzeStrugglePatterns(session);

  // Need intervention
  if (struggles.needsIntervention) {
    return {
      action: 'take_break',
      reason: 'Multiple struggle patterns detected. Take a break and review fundamentals.',
      data: { struggles: struggles.strugglesDetected }
    };
  }

  // Ready for next level
  if (isReady && current_stage === 'mastery') {
    if (session.current_level >= 3) {
      return {
        action: 'complete_session',
        reason: 'Congratulations! You have achieved expert-level mastery.',
        data: { masteryScores }
      };
    } else {
      return {
        action: 'level_up',
        reason: `Ready to advance to Level ${session.current_level + 1}!`,
        data: { nextLevel: session.current_level + 1 }
      };
    }
  }

  // Low understanding - review
  if (understanding_level < 50) {
    return {
      action: 'review_concept',
      reason: 'Understanding level is low. Review core concepts before continuing.',
      data: { currentUnderstanding: understanding_level }
    };
  }

  // Has current problem
  if (stage_progress.current_problem) {
    return {
      action: 'continue_problem',
      reason: 'Continue working on current problem.',
      data: { problemId: stage_progress.current_problem }
    };
  }

  // Default - next problem
  return {
    action: 'next_problem',
    reason: 'Ready for the next problem in your learning journey.',
    data: { currentStage: current_stage }
  };
};

/**
 * Format time for display
 */
export const formatTimeSpent = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

/**
 * Calculate learning velocity (problems per hour)
 */
export const calculateLearningVelocity = (session: LearningSession): number => {
  const { attempt_history, stage_progress } = session;
  const problemsCompleted = stage_progress.problems_completed?.length || 0;
  const totalTime = stage_progress.time_spent_minutes || 1; // Avoid division by zero

  return problemsCompleted / (totalTime / 60); // problems per hour
};

/**
 * Estimate time to completion based on current progress
 */
export const estimateTimeToCompletion = (session: LearningSession): {
  estimatedMinutes: number;
  confidence: 'high' | 'medium' | 'low';
} => {
  const { current_level, stage_progress } = session;
  const problemsCompleted = stage_progress.problems_completed?.length || 0;
  const velocity = calculateLearningVelocity(session);

  const problemsRemaining = {
    1: 8 - problemsCompleted, // Level 1: 8 problems
    2: 4 - problemsCompleted, // Level 2: 4 problems
    3: 2 - problemsCompleted  // Level 3: 2 problems
  }[current_level] || 0;

  const estimatedMinutes = velocity > 0 ? (problemsRemaining / velocity) * 60 : 240; // Default 4 hours

  // Confidence based on data points
  const attempts = session.attempt_history.length;
  const confidence = attempts >= 10 ? 'high' : attempts >= 5 ? 'medium' : 'low';

  return {
    estimatedMinutes: Math.max(30, Math.round(estimatedMinutes)), // Minimum 30 minutes
    confidence
  };
};
