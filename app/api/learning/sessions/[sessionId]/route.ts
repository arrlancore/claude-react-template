import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/learning/session-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    const session = await sessionManager.getSessionById(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const progress = await sessionManager.getUserProgress(session.user_id, session.pattern_id)

    return NextResponse.json({ session, progress })
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()
    const { progress_update } = body

    if (!progress_update) {
      return NextResponse.json({ error: 'Progress update required' }, { status: 400 })
    }

    await sessionManager.updateProgress(sessionId, progress_update)

    const session = await sessionManager.getSessionById(sessionId)
    const progress = session ? await sessionManager.getUserProgress(session.user_id, session.pattern_id) : null

    return NextResponse.json({
      session,
      progress,
      message: 'Progress updated successfully'
    })
  } catch (error) {
    console.error('Update progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
