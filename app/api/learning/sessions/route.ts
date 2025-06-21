import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/progress/session-manager'

export async function POST(request: NextRequest) {
  try {
    // Temporary: Skip auth for MVP testing
    const userId = 'test-user-123' // TODO: Replace with actual auth

    const body = await request.json()
    const { pattern_id, problem_id } = body

    if (!pattern_id) {
      return NextResponse.json({ error: 'Pattern ID required' }, { status: 400 })
    }

    // Check for existing active session
    let session = await sessionManager.getUserActiveSession(userId, pattern_id)

    if (!session) {
      session = await sessionManager.createSession(userId, pattern_id, problem_id)
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Session create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Temporary: Skip auth for MVP testing
    const userId = 'test-user-123' // TODO: Replace with actual auth

    const { searchParams } = new URL(request.url)
    const patternId = searchParams.get('pattern_id')

    if (patternId) {
      const session = await sessionManager.getUserActiveSession(userId, patternId)
      return NextResponse.json({ session })
    }

    const stats = await sessionManager.getUserStats(userId)
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Session get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
