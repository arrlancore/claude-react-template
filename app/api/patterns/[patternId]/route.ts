import { NextRequest, NextResponse } from 'next/server'
import { patternLoader } from '@/lib/patterns/loader'

export async function GET(
  request: NextRequest,
  { params }: { params: { patternId: string } }
) {
  try {
    const { patternId } = params
    const pattern = await patternLoader.loadPattern(patternId)

    if (!pattern) {
      return NextResponse.json(
        { error: 'Pattern not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      pattern: pattern.config,
      problems: Object.keys(pattern.problems).map(problemId => ({
        id: problemId,
        title: pattern.problems[problemId].title,
        difficulty: pattern.problems[problemId].difficulty,
        estimatedTime: pattern.problems[problemId].estimatedTime,
        category: pattern.problems[problemId].category,
        description: pattern.problems[problemId].description
      }))
    })
  } catch (error) {
    console.error('Pattern API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
