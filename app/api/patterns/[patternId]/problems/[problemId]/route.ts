import { NextRequest, NextResponse } from 'next/server'
import { patternLoader } from '@/lib/patterns/loader'

export async function GET(
  request: NextRequest,
  { params }: { params: { patternId: string; problemId: string } }
) {
  try {
    const { patternId, problemId } = params
    const problem = await patternLoader.loadProblem(patternId, problemId)

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      problem: {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        estimatedTime: problem.estimatedTime,
        category: problem.category,
        description: problem.description,
        objectives: problem.objectives,
        content: problem.markdown
      }
    })
  } catch (error) {
    console.error('Problem API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
