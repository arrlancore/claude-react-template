'use client'

import { useState, useEffect } from 'react'
import { Achievement, UserProgress } from '@/lib/types/learning'
import { achievementEngine } from '@/lib/learning/achievement-engine'

interface UseAchievementsProps {
  userId: string
  patternId: string
}

interface AchievementState {
  achievements: Achievement[]
  pendingNotifications: Achievement[]
  totalPoints: number
  isLoading: boolean
  error: string | null
}

export function useAchievements({ userId, patternId }: UseAchievementsProps) {
  const [state, setState] = useState<AchievementState>({
    achievements: [],
    pendingNotifications: [],
    totalPoints: 0,
    isLoading: true,
    error: null
  })

  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([])

  // Load available achievements for pattern
  useEffect(() => {
    loadAvailableAchievements()
  }, [patternId])

  // Load user's unlocked achievements
  useEffect(() => {
    loadUserAchievements()
  }, [userId, patternId])

  const loadAvailableAchievements = async () => {
    try {
      const achievements = await achievementEngine.loadAchievements(patternId)
      setAvailableAchievements(achievements)
    } catch (error) {
      console.error('Failed to load available achievements:', error)
    }
  }

  const loadUserAchievements = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(`/api/learning/achievements?user_id=${userId}&pattern_id=${patternId}`)

      if (!response.ok) {
        throw new Error('Failed to load achievements')
      }

      const data = await response.json()

      setState(prev => ({
        ...prev,
        achievements: data.achievements || [],
        totalPoints: data.total_points || 0,
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

  const checkForNewAchievements = async (
    userProgress: UserProgress,
    sessionData: {
      problem_id?: string
      completion_time?: number
      hints_used?: number
      score?: number
      recognition_time?: number
    }
  ) => {
    try {
      const newAchievements = achievementEngine.checkAchievementUnlocks(
        userProgress,
        availableAchievements,
        sessionData
      )

      if (newAchievements.length > 0) {
        // Save to database
        await achievementEngine.saveAchievements(userId, newAchievements)

        // Update state
        setState(prev => ({
          ...prev,
          achievements: [...prev.achievements, ...newAchievements],
          pendingNotifications: [...prev.pendingNotifications, ...newAchievements],
          totalPoints: prev.totalPoints + newAchievements.reduce((sum, ach) => sum + ach.points, 0)
        }))

        return newAchievements
      }

      return []
    } catch (error) {
      console.error('Failed to check achievements:', error)
      return []
    }
  }

  const dismissNotification = (achievementId: string) => {
    setState(prev => ({
      ...prev,
      pendingNotifications: prev.pendingNotifications.filter(ach => ach.id !== achievementId)
    }))
  }

  const getAchievementsByCategory = (category: string) => {
    return state.achievements.filter(ach => ach.category === category)
  }

  const getAchievementProgress = (achievementId: string) => {
    const isUnlocked = state.achievements.some(ach => ach.id === achievementId)
    const achievement = availableAchievements.find(ach => ach.id === achievementId)

    return {
      isUnlocked,
      achievement,
      progress: isUnlocked ? 100 : 0 // Could be enhanced with partial progress
    }
  }

  const getTotalPointsByRarity = () => {
    const pointsByRarity: Record<string, number> = {}

    state.achievements.forEach(achievement => {
      const rarity = achievement.rarity
      pointsByRarity[rarity] = (pointsByRarity[rarity] || 0) + achievement.points
    })

    return pointsByRarity
  }

  const getRecentAchievements = (limit: number = 5) => {
    return state.achievements
      .sort((a, b) => {
        const dateA = new Date(a.unlocked_at || 0)
        const dateB = new Date(b.unlocked_at || 0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, limit)
  }

  return {
    // State
    achievements: state.achievements,
    pendingNotifications: state.pendingNotifications,
    totalPoints: state.totalPoints,
    isLoading: state.isLoading,
    error: state.error,
    availableAchievements,

    // Actions
    checkForNewAchievements,
    dismissNotification,
    loadUserAchievements,

    // Helpers
    getAchievementsByCategory,
    getAchievementProgress,
    getTotalPointsByRarity,
    getRecentAchievements
  }
}
