'use client'

import { useState, useEffect } from 'react'

interface SessionData {
  id: string
  pattern_id: string
  current_stage: string
  current_level: number
  understanding_level: number
  stage_progress: {
    problems_completed: string[]
    current_problem: string | null
    level: number
    mastery_score: number
    time_spent_minutes: number
    hints_used: number
  }
}

interface UseProgressReturn {
  session: SessionData | null
  isLoading: boolean
  error: string | null
  createSession: (patternId: string, problemId?: string) => Promise<void>
  updateProgress: (updates: ProgressUpdate) => Promise<void>
  completeProblem: (problemId: string, score: number) => Promise<void>
}

interface ProgressUpdate {
  understanding_level?: number
  hints_used?: number
  time_spent_minutes?: number
}

export function useProgress(patternId?: string): UseProgressReturn {
  const [session, setSession] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing session on mount
  useEffect(() => {
    if (patternId) {
      loadSession(patternId)
    }
  }, [patternId])

  const loadSession = async (patternId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/learning/sessions?pattern_id=${patternId}`)
      const data = await response.json()

      if (data.session) {
        setSession(data.session)
      }
    } catch (err) {
      setError('Failed to load session')
    } finally {
      setIsLoading(false)
    }
  }

  const createSession = async (patternId: string, problemId?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/learning/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern_id: patternId, problem_id: problemId })
      })

      const data = await response.json()

      if (response.ok) {
        setSession(data.session)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (updates: ProgressUpdate) => {
    if (!session) return

    try {
      const response = await fetch(`/api/learning/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (response.ok) {
        setSession(data.session)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress')
    }
  }

  const completeProblem = async (problemId: string, score: number) => {
    if (!session) return

    try {
      const response = await fetch(`/api/learning/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_completed: problemId,
          score
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSession(data.session)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete problem')
    }
  }

  return {
    session,
    isLoading,
    error,
    createSession,
    updateProgress,
    completeProblem
  }
}
