import { Achievement, UserProgress } from '@/lib/types/learning'

export class AchievementEngine {

  async loadAchievements(patternId: string): Promise<Achievement[]> {
    try {
      const response = await fetch(`/api/patterns/${patternId}/achievements`)
      if (!response.ok) throw new Error('Failed to load achievements')

      const data = await response.json()
      return data.achievements
    } catch (error) {
      console.error('Error loading achievements:', error)
      return []
    }
  }

  checkAchievementUnlocks(
    userProgress: UserProgress,
    availableAchievements: Achievement[],
    sessionData: {
      problem_id?: string
      completion_time?: number
      hints_used?: number
      score?: number
      recognition_time?: number
    }
  ): Achievement[] {
    const newlyUnlocked: Achievement[] = []
    const alreadyUnlocked = new Set(userProgress.achievements.map(a => a.id))

    availableAchievements.forEach(achievement => {
      if (alreadyUnlocked.has(achievement.id)) return

      if (this.evaluateCondition(achievement.unlock_condition, userProgress, sessionData)) {
        newlyUnlocked.push({
          ...achievement,
          unlocked_at: new Date().toISOString()
        })
      }
    })

    return newlyUnlocked
  }

  private evaluateCondition(
    condition: string,
    progress: UserProgress,
    sessionData: any
  ): boolean {
    try {
      // Create safe evaluation context
      const context = {
        average_time: progress.total_time_spent / Math.max(progress.problems_completed, 1),
        recognition_time: sessionData.recognition_time || 0,
        hints_used: sessionData.hints_used || 0,
        transfer_success_rate: progress.implementation_accuracy,
        level_completion_time: progress.total_time_spent,
        expected_time: this.getExpectedTime(progress.level),
        problem_id: sessionData.problem_id,
        score: sessionData.score || 0,
        level_1_assessment_score: progress.understanding_level,
        level_2_completion: progress.level >= 2,
        level_3_completion: progress.level >= 3,
        optimization_score: progress.understanding_level,
        can_explain_to_ai: progress.understanding_level > 90
      }

      // Simple condition parsing (secure)
      return this.parseCondition(condition, context)
    } catch (error) {
      console.error('Error evaluating achievement condition:', error)
      return false
    }
  }

  private parseCondition(condition: string, context: Record<string, any>): boolean {
    // Handle simple comparisons safely
    const patterns = [
      /^(\w+)\s*<\s*(\d+)$/,           // average_time < 30
      /^(\w+)\s*>\s*(\d+)$/,           // score > 85
      /^(\w+)\s*>=\s*(\d+)$/,          // level_1_assessment_score >= 80
      /^(\w+)\s*==\s*(\d+)$/,          // hints_used == 0
      /^(\w+)\s*==\s*'([^']+)'$/,      // problem_id == '3sum'
      /^(\w+)\s*==\s*true$/,           // level_2_completion == true
      /^(\w+)\s*<\s*(\w+)\s*\*\s*([\d.]+)$/ // level_completion_time < expected_time * 0.6
    ]

    for (const pattern of patterns) {
      const match = condition.match(pattern)
      if (match) {
        const [, key, value, multiplier] = match

        if (pattern === patterns[6]) { // Complex expression
          const leftValue = context[key] || 0
          const rightValue = (context[value] || 0) * parseFloat(multiplier)
          return leftValue < rightValue
        }

        const contextValue = context[key]
        if (contextValue === undefined) return false

        if (pattern === patterns[0]) return contextValue < parseFloat(value)
        if (pattern === patterns[1]) return contextValue > parseFloat(value)
        if (pattern === patterns[2]) return contextValue >= parseFloat(value)
        if (pattern === patterns[3]) return contextValue === parseInt(value)
        if (pattern === patterns[4]) return contextValue === value
        if (pattern === patterns[5]) return contextValue === true
      }
    }

    return false
  }

  private getExpectedTime(level: number): number {
    const expectedTimes = {
      1: 480, // 8 hours for Level 1
      2: 240, // 4 hours for Level 2
      3: 300  // 5 hours for Level 3
    }
    return expectedTimes[level as keyof typeof expectedTimes] || 480
  }

  async saveAchievements(userId: string, achievements: Achievement[]): Promise<void> {
    try {
      await fetch('/api/learning/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          achievements
        })
      })
    } catch (error) {
      console.error('Error saving achievements:', error)
    }
  }

  formatAchievementNotification(achievement: Achievement): string {
    const rarityEmoji = {
      common: '🥉',
      uncommon: '🥈',
      rare: '🥇',
      epic: '💜',
      legendary: '🧡',
      mythic: '💖'
    }

    return `${rarityEmoji[achievement.rarity as keyof typeof rarityEmoji] || '🏆'} **${achievement.name}** unlocked! ${achievement.description} (+${achievement.points} points)`
  }
}

export const achievementEngine = new AchievementEngine()
