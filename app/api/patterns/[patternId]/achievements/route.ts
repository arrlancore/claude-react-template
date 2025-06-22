import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { patternId: string } }
) {
  try {
    const { patternId } = params

    // Load achievements for the pattern
    const achievementsPath = path.join(
      process.cwd(),
      'patterns',
      patternId,
      'achievements',
      'definitions.json'
    )

    const achievementsContent = await fs.readFile(achievementsPath, 'utf-8')
    const achievementsData = JSON.parse(achievementsContent)

    return NextResponse.json({
      pattern_id: patternId,
      achievements: achievementsData.achievements,
      categories: achievementsData.categories,
      rarity_config: achievementsData.rarity_config
    })

  } catch (error) {
    console.error('Error loading achievements:', error)

    // Return fallback achievements
    return NextResponse.json({
      pattern_id: params.patternId,
      achievements: [
        {
          id: 'first_problem',
          name: 'Getting Started',
          description: 'Complete your first problem',
          category: 'milestone',
          icon: '🎯',
          unlock_condition: 'problems_completed >= 1',
          points: 100,
          rarity: 'common'
        },
        {
          id: 'speed_learner',
          name: 'Quick Learner',
          description: 'Complete a problem in under 15 minutes',
          category: 'speed',
          icon: '⚡',
          unlock_condition: 'completion_time < 15',
          points: 200,
          rarity: 'uncommon'
        }
      ],
      categories: {
        milestone: { name: 'Milestone', description: 'Major learning objectives', color: '#FF4500' },
        speed: { name: 'Speed', description: 'Fast problem solving', color: '#FFD700' }
      },
      rarity_config: {
        common: { color: '#808080', multiplier: 1.0 },
        uncommon: { color: '#00FF00', multiplier: 1.2 }
      }
    })
  }
}
