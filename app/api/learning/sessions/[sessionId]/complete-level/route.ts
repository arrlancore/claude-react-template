import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/learning/session-manager'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()
    const { level } = body

    if (typeof level !== 'number') {
      return NextResponse.json({ error: 'Valid level required' }, { status: 400 })
    }

    await sessionManager.completeLevel(sessionId, level)

    const session = await sessionManager.getSessionById(sessionId)
    const progress = session ? await sessionManager.getUserProgress(session.user_id, session.pattern_id) : null

    return NextResponse.json({
      session,
      progress,
      message: `Level ${level} completed successfully`
    })
  } catch (error) {
    console.error('Complete level error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
