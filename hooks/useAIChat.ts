'use client'

import { useState } from 'react'

interface UseAIChatProps {
  patternId: string
  problemId?: string
  sessionId?: string
}

interface UseAIChatReturn {
  sendMessage: (message: string) => Promise<string>
  isLoading: boolean
  error: string | null
}

export function useAIChat({ patternId, problemId, sessionId }: UseAIChatProps): UseAIChatReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: {
            pattern_id: patternId,
            problem_id: problemId,
            session_id: sessionId,
            interaction_type: 'learning_chat'
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.response || 'I apologize, but I couldn\'t generate a response. Please try again.'

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { sendMessage, isLoading, error }
}
