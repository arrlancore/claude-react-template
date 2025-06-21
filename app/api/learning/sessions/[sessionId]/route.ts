import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/progress/session-manager'

interface Props {
  params: {
    sessionId: string
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Temporary: Skip auth for MVP testing
    const userId = 'test-user-123'

    const session = await sessionManager.getSession(params.sessionId)

    if (!session || session.user_id !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Session get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    // Temporary: Skip auth for MVP testing
    const userId = 'test-user-123'

    const body = await request.json()
    const {
      problem_completed,
      score,
      understanding_level,
      hints_used,
      time_spent_minutes
    } = body

    const session = await sessionManager.getSession(params.sessionId)

    if (!session || session.user_id !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update session data
    const updates: any = {}

    if (understanding_level !== undefined) {
      updates.understanding_level = understanding_level
    }

    if (Object.keys(updates).length > 0) {
      await sessionManager.updateSession(params.sessionId, updates)
    }

    // Update progress data
    const progressUpdates: any = {}

    if (hints_used !== undefined) {
      progressUpdates.hints_used = hints_used
    }

    if (time_spent_minutes !== undefined) {
      progressUpdates.time_spent_minutes = time_spent_minutes
    }

    if (Object.keys(progressUpdates).length > 0) {
      await sessionManager.updateProgress(params.sessionId, progressUpdates)
    }

    // Handle problem completion
    if (problem_completed && score !== undefined) {
      await sessionManager.completeProblem(params.sessionId, problem_completed, score)
    }

    const updatedSession = await sessionManager.getSession(params.sessionId)
    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Temporary: Skip auth for MVP testing
    const userId = 'test-user-123'

    const session = await sessionManager.getSession(params.sessionId)

    if (!session || session.user_id !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    await sessionManager.completeSession(params.sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session complete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
