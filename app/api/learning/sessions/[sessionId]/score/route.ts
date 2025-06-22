import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/learning/session-manager'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()
    const { score } = body

    if (typeof score !== 'number') {
      return NextResponse.json({ error: 'Valid score required' }, { status: 400 })
    }

    await sessionManager.updateScore(sessionId, score)

    const session = await sessionManager.getSessionById(sessionId)

    return NextResponse.json({
      session,
      message: 'Score updated successfully'
    })
  } catch (error) {
    console.error('Update score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
