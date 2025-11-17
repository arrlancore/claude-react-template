import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface LearningSession {
  id: string
  user_id: string
  pattern_id: string
  current_stage: string
  current_level: number
  stage_progress: Record<string, any>
  understanding_level: number
  attempt_history: any[]
  struggle_indicators: string[]
  mastery_scores: Record<string, any>
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface SessionProgress {
  problems_completed: string[]
  current_problem: string | null
  level: number
  mastery_score: number
  time_spent_minutes: number
  hints_used: number
}

export class SessionManager {
  async createSession(
    userId: string,
    patternId: string,
    problemId?: string
  ): Promise<LearningSession> {
    const session = {
      user_id: userId,
      pattern_id: patternId,
      current_stage: 'introduction',
      current_level: 1,
      stage_progress: {
        problems_completed: [],
        current_problem: problemId,
        level: 1,
        mastery_score: 0,
        time_spent_minutes: 0,
        hints_used: 0
      },
      understanding_level: 50.0,
      attempt_history: [],
      struggle_indicators: [],
      mastery_scores: {}
    }

    const { data, error } = await supabase
      .from('learning_sessions')
      .insert(session)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getSession(sessionId: string): Promise<LearningSession | null> {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) return null
    return data
  }

  async getUserActiveSession(
    userId: string,
    patternId: string
  ): Promise<LearningSession | null> {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('pattern_id', patternId)
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) return null
    return data
  }

  async updateSession(
    sessionId: string,
    updates: Partial<LearningSession>
  ): Promise<LearningSession> {
    const { data, error } = await supabase
      .from('learning_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateProgress(
    sessionId: string,
    progress: Partial<SessionProgress>
  ): Promise<void> {
    const session = await this.getSession(sessionId)
    if (!session) throw new Error('Session not found')

    const updatedProgress = {
      ...session.stage_progress,
      ...progress
    }

    await this.updateSession(sessionId, {
      stage_progress: updatedProgress
    })
  }

  async completeProblem(
    sessionId: string,
    problemId: string,
    score: number
  ): Promise<void> {
    const session = await this.getSession(sessionId)
    if (!session) throw new Error('Session not found')

    const progress = session.stage_progress as SessionProgress
    const completedProblems = new Set(progress.problems_completed || [])
    completedProblems.add(problemId)

    await this.updateProgress(sessionId, {
      problems_completed: Array.from(completedProblems),
      mastery_score: Math.max(progress.mastery_score || 0, score)
    })
  }

  async completeSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, {
      completed_at: new Date().toISOString()
    })
  }

  async getUserStats(userId: string): Promise<{
    totalSessions: number
    completedSessions: number
    patternsStarted: number
    averageScore: number
  }> {
    const { data: sessions } = await supabase
      .from('learning_sessions')
      .select('completed_at, stage_progress')
      .eq('user_id', userId)

    if (!sessions) return { totalSessions: 0, completedSessions: 0, patternsStarted: 0, averageScore: 0 }

    const completed = sessions.filter(s => s.completed_at).length
    const scores = sessions
      .map(s => s.stage_progress?.mastery_score || 0)
      .filter(score => score > 0)

    return {
      totalSessions: sessions.length,
      completedSessions: completed,
      patternsStarted: sessions.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    }
  }
}

export const sessionManager = new SessionManager()
