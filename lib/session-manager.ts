/**
 * Session Management System for Two Pointer Pattern Learning
 * Handles session resumption, progress tracking, and adaptive learning
 */

export interface LearningSession {
  id: string
  userId: string
  patternId: string
  levelId: string
  currentProblemId: string | null
  startedAt: Date
  lastActiveAt: Date
  completedAt: Date | null
  isActive: boolean

  // Progress tracking
  currentStage: 'introduction' | 'discovery' | 'implementation' | 'assessment'
  understandingLevel: number  // 0-100
  currentScore: number        // Current session score
  bestScore: number          // Best score across all attempts

  // Problem completion
  completedProblems: string[]
  currentProblemAttempts: number
  totalAttempts: number

  // Learning metrics
  totalTimeSpent: number      // minutes
  avgProblemTime: number      // minutes
  hintUsageCount: number
  patternRecognitionSpeed: number  // seconds

  // Adaptive learning state
  currentGuidanceLevel: 'minimal' | 'balanced' | 'detailed'
  currentPersona: 'fast_track' | 'encouraging' | 'supportive'
  strugglingAreas: string[]
  strengthAreas: string[]

  // Session metadata
  sessionData: Record<string, any>
  adaptiveFlags: Record<string, boolean>
}

export interface ProblemAttempt {
  id: string
  sessionId: string
  problemId: string
  attemptNumber: number
  startedAt: Date
  completedAt: Date | null

  // Performance metrics
  timeToRecognition: number | null    // seconds to identify pattern
  timeToImplementation: number | null // minutes to working solution
  hintsUsed: number
  accuracy: number                    // 0-100
  codeQuality: number                // 0-100

  // Learning progression
  discoverySteps: DiscoveryStep[]
  implementationAttempts: ImplementationAttempt[]
  assessmentResults: AssessmentResult[]

  // AI interaction tracking
  aiInteractions: AIInteraction[]
  totalTokensUsed: number
  costUsd: number

  // Final state
  isCompleted: boolean
  finalScore: number
  masteryAchieved: boolean
  nextRecommendation: string | null
}

export interface DiscoveryStep {
  stepId: string
  questionAsked: string
  userResponse: string
  aiResponse: string
  understandingGained: number  // -10 to +20
  timeSpent: number           // seconds
  hintsNeeded: number
  isCorrect: boolean
}

export interface ImplementationAttempt {
  attemptId: string
  code: string
  testResults: TestResult[]
  feedback: string
  score: number
  timeSpent: number
  hintsUsed: number
  isWorking: boolean
}

export interface AssessmentResult {
  type: 'pattern_recognition' | 'implementation' | 'explanation' | 'transfer'
  score: number
  maxScore: number
  feedback: string
  timeSpent: number
  passed: boolean
}

export interface AIInteraction {
  id: string
  timestamp: Date
  type: 'socratic_question' | 'hint' | 'feedback' | 'assessment'
  prompt: string
  response: string
  tokensUsed: { input: number; output: number }
  costUsd: number
  userSatisfaction?: number  // 1-5 rating if provided
}

export class SessionManager {
  private sessions = new Map<string, LearningSession>()
  private attempts = new Map<string, ProblemAttempt[]>()

  /**
   * Create or resume a learning session
   */
  async createOrResumeSession(
    userId: string,
    patternId: string,
    levelId: string
  ): Promise<LearningSession> {
    // Check for existing active session
    const existingSession = await this.findActiveSession(userId, patternId, levelId)

    if (existingSession) {
      existingSession.lastActiveAt = new Date()
      await this.saveSession(existingSession)
      return existingSession
    }

    // Create new session
    const session: LearningSession = {
      id: this.generateSessionId(),
      userId,
      patternId,
      levelId,
      currentProblemId: null,
      startedAt: new Date(),
      lastActiveAt: new Date(),
      completedAt: null,
      isActive: true,

      currentStage: 'introduction',
      understandingLevel: 50, // Start neutral
      currentScore: 0,
      bestScore: 0,

      completedProblems: [],
      currentProblemAttempts: 0,
      totalAttempts: 0,

      totalTimeSpent: 0,
      avgProblemTime: 0,
      hintUsageCount: 0,
      patternRecognitionSpeed: 0,

      currentGuidanceLevel: 'balanced', // Will be adjusted after calibration
      currentPersona: 'encouraging',
      strugglingAreas: [],
      strengthAreas: [],

      sessionData: {},
      adaptiveFlags: {}
    }

    await this.saveSession(session)
    return session
  }

  /**
   * Start a new problem attempt within a session
   */
  async startProblemAttempt(
    sessionId: string,
    problemId: string
  ): Promise<ProblemAttempt> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Get attempt number for this problem
    const existingAttempts = await this.getProblemAttempts(sessionId, problemId)
    const attemptNumber = existingAttempts.length + 1

    const attempt: ProblemAttempt = {
      id: this.generateAttemptId(),
      sessionId,
      problemId,
      attemptNumber,
      startedAt: new Date(),
      completedAt: null,

      timeToRecognition: null,
      timeToImplementation: null,
      hintsUsed: 0,
      accuracy: 0,
      codeQuality: 0,

      discoverySteps: [],
      implementationAttempts: [],
      assessmentResults: [],

      aiInteractions: [],
      totalTokensUsed: 0,
      costUsd: 0,

      isCompleted: false,
      finalScore: 0,
      masteryAchieved: false,
      nextRecommendation: null
    }

    // Update session
    session.currentProblemId = problemId
    session.currentProblemAttempts = attemptNumber
    session.totalAttempts++
    session.lastActiveAt = new Date()

    await this.saveSession(session)
    await this.saveAttempt(attempt)

    return attempt
  }

  /**
   * Record pattern recognition time
   */
  async recordPatternRecognition(
    attemptId: string,
    recognitionTimeSeconds: number,
    isCorrect: boolean
  ): Promise<void> {
    const attempt = await this.getAttempt(attemptId)
    if (!attempt) return

    attempt.timeToRecognition = recognitionTimeSeconds

    // Update session metrics
    const session = await this.getSession(attempt.sessionId)
    if (session) {
      if (isCorrect) {
        session.patternRecognitionSpeed = this.updateAverage(
          session.patternRecognitionSpeed,
          recognitionTimeSeconds,
          session.completedProblems.length + 1
        )
      }

      // Adaptive adjustment based on speed
      if (recognitionTimeSeconds < 30 && isCorrect) {
        session.adaptiveFlags.fastRecognition = true
        if (session.currentGuidanceLevel === 'detailed') {
          session.currentGuidanceLevel = 'balanced'
        } else if (session.currentGuidanceLevel === 'balanced') {
          session.currentGuidanceLevel = 'minimal'
        }
      } else if (recognitionTimeSeconds > 120 || !isCorrect) {
        session.adaptiveFlags.slowRecognition = true
        if (session.currentGuidanceLevel === 'minimal') {
          session.currentGuidanceLevel = 'balanced'
        } else if (session.currentGuidanceLevel === 'balanced') {
          session.currentGuidanceLevel = 'detailed'
        }
      }

      await this.saveSession(session)
    }

    await this.saveAttempt(attempt)
  }

  /**
   * Update understanding level based on student performance
   */
  async updateUnderstandingLevel(
    sessionId: string,
    delta: number,
    context: string
  ): Promise<number> {
    const session = await this.getSession(sessionId)
    if (!session) return 0

    const previousLevel = session.understandingLevel
    session.understandingLevel = Math.max(0, Math.min(100, previousLevel + delta))
    session.lastActiveAt = new Date()

    // Track what's causing understanding changes
    if (delta > 0) {
      session.strengthAreas.push(context)
    } else if (delta < 0) {
      session.strugglingAreas.push(context)
    }

    // Adaptive persona adjustment
    if (session.understandingLevel < 40) {
      session.currentPersona = 'supportive'
      session.currentGuidanceLevel = 'detailed'
    } else if (session.understandingLevel > 80) {
      session.currentPersona = 'fast_track'
      if (session.currentGuidanceLevel === 'detailed') {
        session.currentGuidanceLevel = 'balanced'
      }
    } else {
      session.currentPersona = 'encouraging'
    }

    await this.saveSession(session)
    return session.understandingLevel
  }

  /**
   * Complete a problem attempt
   */
  async completeProblemAttempt(
    attemptId: string,
    finalScore: number,
    masteryAchieved: boolean
  ): Promise<void> {
    const attempt = await this.getAttempt(attemptId)
    if (!attempt) return

    attempt.completedAt = new Date()
    attempt.isCompleted = true
    attempt.finalScore = finalScore
    attempt.masteryAchieved = masteryAchieved

    // Calculate implementation time
    if (attempt.startedAt) {
      const totalTime = (attempt.completedAt.getTime() - attempt.startedAt.getTime()) / (1000 * 60)
      attempt.timeToImplementation = totalTime
    }

    // Update session
    const session = await this.getSession(attempt.sessionId)
    if (session) {
      // Add to completed problems if mastery achieved
      if (masteryAchieved && !session.completedProblems.includes(attempt.problemId)) {
        session.completedProblems.push(attempt.problemId)
      }

      // Update best score
      if (finalScore > session.bestScore) {
        session.bestScore = finalScore
      }

      // Update current score
      session.currentScore = finalScore

      // Update average problem time
      if (attempt.timeToImplementation) {
        session.avgProblemTime = this.updateAverage(
          session.avgProblemTime,
          attempt.timeToImplementation,
          session.completedProblems.length
        )
      }

      // Update total time spent
      if (attempt.timeToImplementation) {
        session.totalTimeSpent += attempt.timeToImplementation
      }

      session.lastActiveAt = new Date()
      await this.saveSession(session)
    }

    await this.saveAttempt(attempt)
  }

  /**
   * Record AI interaction for cost tracking and analytics
   */
  async recordAIInteraction(
    attemptId: string,
    interaction: Omit<AIInteraction, 'id' | 'timestamp'>
  ): Promise<void> {
    const attempt = await this.getAttempt(attemptId)
    if (!attempt) return

    const aiInteraction: AIInteraction = {
      id: this.generateInteractionId(),
      timestamp: new Date(),
      ...interaction
    }

    attempt.aiInteractions.push(aiInteraction)
    attempt.totalTokensUsed += interaction.tokensUsed.input + interaction.tokensUsed.output
    attempt.costUsd += interaction.costUsd

    // Update session hint usage if this was a hint
    if (interaction.type === 'hint') {
      const session = await this.getSession(attempt.sessionId)
      if (session) {
        session.hintUsageCount++
        attempt.hintsUsed++

        // Adaptive adjustment for heavy hint usage
        if (attempt.hintsUsed > 3) {
          session.adaptiveFlags.needsMoreSupport = true
          if (session.currentGuidanceLevel === 'minimal') {
            session.currentGuidanceLevel = 'balanced'
          }
        }

        await this.saveSession(session)
      }
    }

    await this.saveAttempt(attempt)
  }

  /**
   * Get session progress report
   */
  async getProgressReport(sessionId: string): Promise<SessionProgressReport> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const attempts = await this.getAllAttempts(sessionId)

    // Calculate learning metrics
    const totalProblems = await this.getTotalProblemsInLevel(session.levelId)
    const completionRate = (session.completedProblems.length / totalProblems) * 100

    const averageScore = attempts.length > 0
      ? attempts.reduce((sum, attempt) => sum + attempt.finalScore, 0) / attempts.length
      : 0

    const averageRecognitionTime = attempts
      .filter(a => a.timeToRecognition !== null)
      .reduce((sum, a) => sum + a.timeToRecognition!, 0) /
      attempts.filter(a => a.timeToRecognition !== null).length || 0

    return {
      sessionId: session.id,
      currentLevel: session.levelId,
      completionRate,
      understandingLevel: session.understandingLevel,
      bestScore: session.bestScore,
      averageScore,
      totalTimeSpent: session.totalTimeSpent,
      averageRecognitionTime,
      completedProblems: session.completedProblems.length,
      totalProblems,
      hintUsageRate: session.hintUsageCount / session.totalAttempts,
      strengthAreas: this.analyzeStrengthAreas(session.strengthAreas),
      strugglingAreas: this.analyzeStrugglingAreas(session.strugglingAreas),
      nextRecommendation: this.generateNextRecommendation(session),
      isLevelComplete: session.completedProblems.length >= totalProblems,
      estimatedTimeToCompletion: this.estimateTimeToCompletion(session, totalProblems)
    }
  }

  /**
   * Pause session (user taking a break)
   */
  async pauseSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId)
    if (!session) return

    session.isActive = false
    session.lastActiveAt = new Date()
    await this.saveSession(session)
  }

  /**
   * Resume paused session
   */
  async resumeSession(sessionId: string): Promise<LearningSession> {
    const session = await this.getSession(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    session.isActive = true
    session.lastActiveAt = new Date()
    await this.saveSession(session)

    return session
  }

  // Helper methods
  private updateAverage(currentAvg: number, newValue: number, count: number): number {
    return ((currentAvg * (count - 1)) + newValue) / count
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateAttemptId(): string {
    return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateInteractionId(): string {
    return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Database operations (implement based on your database choice)
  private async saveSession(session: LearningSession): Promise<void> {
    // Implementation depends on database
  }

  private async getSession(sessionId: string): Promise<LearningSession | null> {
    // Implementation depends on database
    return null
  }

  private async saveAttempt(attempt: ProblemAttempt): Promise<void> {
    // Implementation depends on database
  }

  private async getAttempt(attemptId: string): Promise<ProblemAttempt | null> {
    // Implementation depends on database
    return null
  }

  // Additional helper methods for analytics and recommendations...
}

export interface SessionProgressReport {
  sessionId: string
  currentLevel: string
  completionRate: number
  understandingLevel: number
  bestScore: number
  averageScore: number
  totalTimeSpent: number
  averageRecognitionTime: number
  completedProblems: number
  totalProblems: number
  hintUsageRate: number
  strengthAreas: string[]
  strugglingAreas: string[]
  nextRecommendation: string
  isLevelComplete: boolean
  estimatedTimeToCompletion: number
}
