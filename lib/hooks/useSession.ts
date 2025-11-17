'use client'

import { useState, useEffect } from 'react'
import { SessionState, UserProgress } from '@/lib/types/learning'

interface UseSessionProps {
  userId: string
  patternId: string
  personaType?: string
}

interface SessionHookState {
  session: SessionState | null
  progress: UserProgress | null
  isLoading: boolean
  error: string | null
}

export function useSession({ userId, patternId, personaType }: UseSessionProps) {
  const [state, setState] = useState<SessionHookState>({
    session: null,
    progress: null,
    isLoading: true,
    error: null
  })

  // Initialize or resume session
  useEffect(() => {
    if (userId && patternId) {
      initializeSession()
    }
  }, [userId, patternId, personaType])

  const initializeSession = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Create or resume session
      const response = await fetch('/api/learning/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          pattern_id: patternId,
          persona_type: personaType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to initialize session')
      }

      const sessionData = await response.json()

      setState(prev => ({
        ...prev,
        session: sessionData.session,
        progress: sessionData.progress,
        isLoading: false
      }))

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      }))
    }
  }

  const updateProgress = async (progressUpdate: {
    problemId?: string
    completionTime?: number
    hintsUsed?: number
    recognitionTime?: number
    understandingLevel?: number
    achievement?: string
  }) => {
    if (!state.session) return

    try {
      const response = await fetch(`/api/learning/sessions/${state.session.session_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress_update: progressUpdate
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update progress')
      }

      const updatedSession = await response.json()

      setState(prev => ({
        ...prev,
        session: updatedSession.session,
        progress: updatedSession.progress
      }))

      return updatedSession

    } catch (error) {
      console.error('Failed to update progress:', error)
      throw error
    }
  }

  const updateScore = async (newScore: number) => {
    if (!state.session) return

    try {
      const response = await fetch(`/api/learning/sessions/${state.session.session_id}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: newScore })
      })

      if (!response.ok) {
        throw new Error('Failed to update score')
      }

      const updatedSession = await response.json()

      setState(prev => ({
        ...prev,
        session: updatedSession.session
      }))

      return updatedSession

    } catch (error) {
      console.error('Failed to update score:', error)
      throw error
    }
  }

  const completeLevel = async (level: number) => {
    if (!state.session) return

    try {
      const response = await fetch(`/api/learning/sessions/${state.session.session_id}/complete-level`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level })
      })

      if (!response.ok) {
        throw new Error('Failed to complete level')
      }

      const updatedSession = await response.json()

      setState(prev => ({
        ...prev,
        session: updatedSession.session,
        progress: updatedSession.progress
      }))

      return updatedSession

    } catch (error) {
      console.error('Failed to complete level:', error)
      throw error
    }
  }

  const deactivateSession = async () => {
    if (!state.session) return

    try {
      await fetch(`/api/learning/sessions/${state.session.session_id}/deactivate`, {
        method: 'POST'
      })

      setState(prev => ({
        ...prev,
        session: prev.session ? { ...prev.session, is_active: false } : null
      }))

    } catch (error) {
      console.error('Failed to deactivate session:', error)
    }
  }

  const getProgressPercentage = () => {
    if (!state.progress) return 0

    const { problems_completed, total_problems } = state.progress
    return Math.round((problems_completed / total_problems) * 100)
  }

  const getTimeSpentFormatted = () => {
    if (!state.progress) return '0 minutes'

    const minutes = Math.round(state.progress.total_time_spent / 60)

    if (minutes < 60) {
      return `${minutes} minutes`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}h ${remainingMinutes}m`
  }

  const getAverageRecognitionTime = () => {
    if (!state.session?.progress_data.pattern_recognition_times.length) return 0

    const times = state.session.progress_data.pattern_recognition_times
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  const getAverageImplementationTime = () => {
    if (!state.session?.progress_data.implementation_times.length) return 0

    const times = state.session.progress_data.implementation_times
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }

  const getTotalHintsUsed = () => {
    if (!state.session?.progress_data.hints_used_per_problem) return 0

    return Object.values(state.session.progress_data.hints_used_per_problem)
      .reduce((total, hints) => total + hints, 0)
  }

  const isReadyForNextLevel = () => {
    if (!state.progress) return false

    // Level 1 completion criteria: 8 problems completed + 80% understanding
    if (state.session?.level === 1) {
      return state.progress.problems_completed >= 8 &&
             state.progress.understanding_level >= 80
    }

    // Level 2 completion criteria: all problems + 85% understanding
    if (state.session?.level === 2) {
      return state.progress.problems_completed >= state.progress.total_problems &&
             state.progress.understanding_level >= 85
    }

    return false
  }

  return {
    // State
    session: state.session,
    progress: state.progress,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    updateProgress,
    updateScore,
    completeLevel,
    deactivateSession,
    initializeSession,

    // Computed values
    getProgressPercentage,
    getTimeSpentFormatted,
    getAverageRecognitionTime,
    getAverageImplementationTime,
    getTotalHintsUsed,
    isReadyForNextLevel
  }
}
