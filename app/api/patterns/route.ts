import { NextRequest, NextResponse } from 'next/server'
import { patternLoader } from '@/lib/patterns/loader'

// List all available patterns
export async function GET() {
  try {
    const patternIds = await patternLoader.listAvailablePatterns()
    const patterns = []

    for (const patternId of patternIds) {
      const pattern = await patternLoader.loadPattern(patternId)
      if (pattern) {
        patterns.push({
          id: pattern.config.patternId,
          name: pattern.config.metadata.name,
          description: pattern.config.metadata.description,
          difficulty: pattern.config.metadata.difficulty,
          estimatedTime: pattern.config.metadata.estimatedTime,
          companies: pattern.config.metadata.companies,
          interviewFrequency: pattern.config.metadata.interviewFrequency,
          totalProblems: Object.keys(pattern.problems).length
        })
      }
    }

    return NextResponse.json({ patterns })
  } catch (error) {
    console.error('Patterns list API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
