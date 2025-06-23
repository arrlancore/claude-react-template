/**
 * Progress Tracking System for Two Pointer Pattern Learning
 * Real-time analytics and adaptive learning metrics
 */

export interface LearningMetrics {
  // Pattern Recognition Metrics
  patternRecognitionSpeed: number        // Average seconds to identify pattern
  patternRecognitionAccuracy: number     // % correct first-time identification
  patternTransferSuccess: number         // % success applying to new contexts

  // Implementation Metrics
  averageImplementationTime: number      // Minutes to working solution
  codeQuality: number                   // Average code quality score (0-100)
  firstAttemptSuccess: number           // % solved without hints on first try
  bugFixSpeed: number                   // Average time to fix compilation errors

  // Learning Efficiency Metrics
  hintsPerProblem: number               // Average hints needed per problem
  conceptRetention: number              // Score on spaced repetition tests
  learningVelocity: number              // Problems mastered per hour
  difficultyProgression: number         // Rate of tackling harder problems

  // Understanding Depth Metrics
  explanationQuality: number            // Quality of approach explanations (0-100)
  optimizationAwareness: number         // % of times discusses optimization
  edgeCaseHandling: number              // % of solutions handling edge cases
  complexityAnalysis: number            // Accuracy of time/space complexity analysis

  // Engagement Metrics
  sessionDuration: number               // Average learning session length (minutes)
  sessionFrequency: number              // Sessions per week
  totalTimeInvested: number             // Total learning time (hours)
  streakLength: number                  // Days of consecutive learning
}

export interface AdaptiveTrigger {
  type: 'speed_up' | 'slow_down' | 'increase_support' | 'reduce_guidance' | 'review_concept'
  reason: string
  suggestedAction: string
  priority: 'low' | 'medium' | 'high'
}

export interface ProgressSnapshot {
  timestamp: Date
  userId: string
  patternId: string
  levelId: string

  // Current State
  understandingLevel: number            // 0-100 current understanding
  masteryScore: number                  // 0-100 overall mastery
  problemsCompleted: number
  totalProblems: number

  // Performance Trends
  learningTrend: 'improving' | 'stable' | 'declining'
  velocityTrend: 'accelerating' | 'steady' | 'slowing'
  confidenceTrend: 'building' | 'stable' | 'uncertain'

  // Adaptive Insights
  recommendedActions: string[]
  strugglingConcepts: string[]
  strengthAreas: string[]
  nextMilestone: string
  estimatedCompletionTime: number       // Hours to level completion
}

export class ProgressTracker {
  private metrics = new Map<string, LearningMetrics>()
  private snapshots: ProgressSnapshot[] = []
  private adaptiveTriggers: Map<string, AdaptiveTrigger[]> = new Map()

  /**
   * Check for adaptive learning triggers based on recognition performance
   */
  private checkRecognitionAdaptiveTriggers(
    userId: string,
    patternId: string,
    timeSeconds: number,
    isCorrect: boolean
  ): AdaptiveTrigger[] {
    const triggers: AdaptiveTrigger[] = []
    const metrics = this.getMetrics(userId, patternId)

    if (!metrics) return triggers

    // Speed-based triggers
    if (timeSeconds < 15 && isCorrect) {
      triggers.push({
        type: 'speed_up',
        reason: 'Extremely fast pattern recognition',
        suggestedAction: 'Offer speed mode with reduced explanations',
        priority: 'medium'
      })
    } else if (timeSeconds > 120 || !isCorrect) {
      triggers.push({
        type: 'increase_support',
        reason: 'Slow or incorrect pattern recognition',
        suggestedAction: 'Provide additional pattern examples and analogies',
        priority: 'high'
      })
    }

    // Accuracy-based triggers
    if (metrics.patternRecognitionAccuracy < 60) {
      triggers.push({
        type: 'review_concept',
        reason: 'Low pattern recognition accuracy',
        suggestedAction: 'Review core Two Pointer concepts before continuing',
        priority: 'high'
      })
    }

    this.updateAdaptiveTriggers(userId, patternId, triggers)
    return triggers
  }

  /**
   * Check for adaptive learning triggers based on implementation performance
   */
  private checkImplementationAdaptiveTriggers(
    userId: string,
    patternId: string,
    timeMinutes: number,
    hintsUsed: number
  ): AdaptiveTrigger[] {
    const triggers: AdaptiveTrigger[] = []
    const metrics = this.getMetrics(userId, patternId)

    if (!metrics) return triggers

    // Implementation speed triggers
    if (timeMinutes < 10 && hintsUsed === 0) {
      triggers.push({
        type: 'reduce_guidance',
        reason: 'Very fast implementation without hints',
        suggestedAction: 'Switch to minimal guidance mode',
        priority: 'medium'
      })
    } else if (timeMinutes > 45 || hintsUsed > 4) {
      triggers.push({
        type: 'increase_support',
        reason: 'Struggling with implementation',
        suggestedAction: 'Provide step-by-step implementation guidance',
        priority: 'high'
      })
    }

    // Hint usage triggers
    if (metrics.hintsPerProblem > 3) {
      triggers.push({
        type: 'slow_down',
        reason: 'High hint usage indicates conceptual gaps',
        suggestedAction: 'Spend more time on pattern discovery before coding',
        priority: 'medium'
      })
    }

    this.updateAdaptiveTriggers(userId, patternId, triggers)
    return triggers
  }

  /**
   * Analyze learning trends over time
   */
  private analyzeLearningTrend(
    snapshots: ProgressSnapshot[],
    currentLevel: number
  ): 'improving' | 'stable' | 'declining' {
    if (snapshots.length < 2) return 'stable'

    const recentSnapshots = snapshots.slice(-3)
    const levelChanges = recentSnapshots.map((snapshot, index) => {
      if (index === 0) return 0
      return snapshot.understandingLevel - recentSnapshots[index - 1].understandingLevel
    }).filter(change => change !== 0)

    if (levelChanges.length === 0) return 'stable'

    const averageChange = levelChanges.reduce((sum, change) => sum + change, 0) / levelChanges.length

    if (averageChange > 5) return 'improving'
    if (averageChange < -5) return 'declining'
    return 'stable'
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    metrics: LearningMetrics | null,
    understandingLevel: number,
    masteryScore: number
  ): string[] {
    const recommendations: string[] = []

    if (!metrics) return recommendations

    // Understanding level recommendations
    if (understandingLevel < 40) {
      recommendations.push("Focus on core concepts before attempting more problems")
      recommendations.push("Review pattern introduction and examples")
    } else if (understandingLevel > 80) {
      recommendations.push("Ready for advanced variations and optimizations")
      recommendations.push("Consider moving to next level or pattern")
    }

    // Recognition speed recommendations
    if (metrics.patternRecognitionSpeed > 60) {
      recommendations.push("Practice pattern recognition with timed exercises")
      recommendations.push("Review pattern characteristics and signals")
    } else if (metrics.patternRecognitionSpeed < 20) {
      recommendations.push("Excellent pattern recognition! Try harder variations")
    }

    // Implementation recommendations
    if (metrics.averageImplementationTime > 40) {
      recommendations.push("Break down implementation into smaller steps")
      recommendations.push("Practice with simpler problems first")
    }

    if (metrics.hintsPerProblem > 3) {
      recommendations.push("Spend more time understanding before coding")
      recommendations.push("Try explaining approach in words first")
    }

    // Code quality recommendations
    if (metrics.codeQuality < 70) {
      recommendations.push("Focus on clean, readable code structure")
      recommendations.push("Add comments explaining your logic")
    }

    return recommendations
  }

  /**
   * Identify struggling concepts based on metrics
   */
  private identifyStrugglingConcepts(metrics: LearningMetrics | null): string[] {
    const struggling: string[] = []

    if (!metrics) return struggling

    if (metrics.patternRecognitionAccuracy < 60) {
      struggling.push("Pattern recognition")
    }

    if (metrics.optimizationAwareness < 50) {
      struggling.push("Time/space complexity optimization")
    }

    if (metrics.edgeCaseHandling < 60) {
      struggling.push("Edge case identification")
    }

    if (metrics.complexityAnalysis < 70) {
      struggling.push("Algorithm complexity analysis")
    }

    if (metrics.firstAttemptSuccess < 40) {
      struggling.push("Independent problem solving")
    }

    return struggling
  }

  /**
   * Identify strength areas based on metrics
   */
  private identifyStrengthAreas(metrics: LearningMetrics | null): string[] {
    const strengths: string[] = []

    if (!metrics) return strengths

    if (metrics.patternRecognitionSpeed < 30) {
      strengths.push("Fast pattern recognition")
    }

    if (metrics.codeQuality > 85) {
      strengths.push("Clean code implementation")
    }

    if (metrics.firstAttemptSuccess > 70) {
      strengths.push("Independent problem solving")
    }

    if (metrics.optimizationAwareness > 80) {
      strengths.push("Optimization thinking")
    }

    if (metrics.explanationQuality > 85) {
      strengths.push("Clear technical communication")
    }

    if (metrics.learningVelocity > 1.0) {
      strengths.push("Fast learning pace")
    }

    return strengths
  }

  /**
   * Estimate time to completion based on current progress and velocity
   */
  private estimateCompletionTime(
    metrics: LearningMetrics | null,
    problemsCompleted: number,
    totalProblems: number
  ): number {
    if (!metrics || metrics.learningVelocity === 0) {
      // Default estimate based on average
      const remainingProblems = totalProblems - problemsCompleted
      return remainingProblems * 0.75 // 45 minutes per problem average
    }

    const remainingProblems = totalProblems - problemsCompleted
    const hoursRemaining = remainingProblems / metrics.learningVelocity

    // Factor in current understanding level (higher understanding = faster progress)
    const understandingFactor = Math.max(0.5, 1.0) // Placeholder - would use actual understanding level

    return hoursRemaining * understandingFactor
  }

  /**
   * Calculate next milestone for motivation
   */
  private calculateNextMilestone(problemsCompleted: number, totalProblems: number): string {
    const remainingProblems = totalProblems - problemsCompleted

    if (remainingProblems === 0) {
      return "Level completed! Ready for next challenge"
    } else if (remainingProblems === 1) {
      return "One problem away from level completion!"
    } else if (remainingProblems <= 3) {
      return `${remainingProblems} problems until level mastery`
    } else if (problemsCompleted >= totalProblems / 2) {
      return "Halfway through level - great progress!"
    } else {
      return `${problemsCompleted}/${totalProblems} problems completed`
    }
  }

  /**
   * Get current metrics for user/pattern
   */
  private getMetrics(userId: string, patternId: string): LearningMetrics | null {
    return this.metrics.get(`${userId}:${patternId}`) || null
  }

  /**
   * Update metrics for user/pattern
   */
  private updateMetrics(userId: string, patternId: string, metrics: LearningMetrics): void {
    this.metrics.set(`${userId}:${patternId}`, metrics)
  }

  /**
   * Update rolling average for metrics
   */
  private updateRollingAverage(currentAvg: number, newValue: number, count: number): number {
    if (count <= 1) return newValue
    return ((currentAvg * (count - 1)) + newValue) / count
  }

  /**
   * Update adaptive triggers for user
   */
  private updateAdaptiveTriggers(userId: string, patternId: string, triggers: AdaptiveTrigger[]): void {
    const key = `${userId}:${patternId}`
    this.adaptiveTriggers.set(key, triggers)
  }

  /**
   * Get recent snapshots for trend analysis
   */
  private getRecentSnapshots(userId: string, patternId: string, count: number): ProgressSnapshot[] {
    return this.snapshots
      .filter(snapshot => snapshot.userId === userId && snapshot.patternId === patternId)
      .slice(-count)
  }

  // Placeholder methods for data that would come from session tracking
  private getRecognitionAttemptCount(userId: string, patternId: string): number {
    // Implementation would query actual attempt records
    return 1
  }

  private getImplementationCount(userId: string, patternId: string): number {
    // Implementation would query actual implementation records
    return 1
  }

  private getFirstAttemptCount(userId: string, patternId: string): number {
    // Implementation would query actual first attempt records
    return 1
  }

  private getBugFixCount(userId: string, patternId: string): number {
    // Implementation would query actual bug fix records
    return 1
  }

  private getSessionCount(userId: string, patternId: string): number {
    // Implementation would query actual session records
    return 1
  }

  private getAssessmentCount(userId: string, patternId: string): number {
    // Implementation would query actual assessment records
    return 1
  }

  private calculateStreakLength(userId: string, patternId: string): number {
    // Implementation would calculate based on session dates
    return 1
  }

  private calculateSessionFrequency(userId: string, patternId: string): number {
    // Implementation would calculate sessions per week
    return 3
  }

  private analyzeVelocityTrend(snapshots: ProgressSnapshot[], currentVelocity: number): 'accelerating' | 'steady' | 'slowing' {
    // Implementation would analyze velocity changes over time
    return 'steady'
  }

  private analyzeConfidenceTrend(snapshots: ProgressSnapshot[], currentMastery: number): 'building' | 'stable' | 'uncertain' {
    // Implementation would analyze mastery score changes
    return 'building'
  }

  /**
   * Public API: Get current progress summary
   */
  getProgressSummary(userId: string, patternId: string): {
    metrics: LearningMetrics | null,
    triggers: AdaptiveTrigger[],
    recentSnapshot: ProgressSnapshot | null
  } {
    const metrics = this.getMetrics(userId, patternId)
    const triggers = this.adaptiveTriggers.get(`${userId}:${patternId}`) || []
    const recentSnapshots = this.getRecentSnapshots(userId, patternId, 1)
    const recentSnapshot = recentSnapshots.length > 0 ? recentSnapshots[0] : null

    return { metrics, triggers, recentSnapshot }
  }

  /**
   * Public API: Get active adaptive triggers
   */
  getActiveTriggers(userId: string, patternId: string): AdaptiveTrigger[] {
    return this.adaptiveTriggers.get(`${userId}:${patternId}`) || []
  }

  /**
   * Public API: Clear adaptive triggers (after they've been acted upon)
   */
  clearTriggers(userId: string, patternId: string): void {
    this.adaptiveTriggers.set(`${userId}:${patternId}`, [])
  }
}

export const progressTracker = new ProgressTracker()
