import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/learning/session-manager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, pattern_id, persona_type, level } = body

    if (!user_id || !pattern_id) {
      return NextResponse.json({ error: 'User ID and Pattern ID required' }, { status: 400 })
    }

    // Resume existing session or create new one
    const session = await sessionManager.resumeOrCreateSession(user_id, pattern_id, persona_type)
    const progress = await sessionManager.getUserProgress(user_id, pattern_id)

    return NextResponse.json({
      session,
      progress,
      message: session.attempts_count > 0 ? 'Session resumed' : 'New session created'
    })
  } catch (error) {
    console.error('Session create/resume error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const patternId = searchParams.get('pattern_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (patternId) {
      // Get specific pattern session
      const session = await sessionManager.getActiveSession(userId, patternId)
      const progress = session ? await sessionManager.getUserProgress(userId, patternId) : null

      return NextResponse.json({ session, progress })
    }

    // Get all user sessions
    const sessions = await sessionManager.getUserSessions(userId)
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Session get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
