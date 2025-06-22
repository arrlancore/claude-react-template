import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/learning/session-manager'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    await sessionManager.deactivateSession(sessionId)

    return NextResponse.json({
      message: 'Session deactivated successfully'
    })
  } catch (error) {
    console.error('Deactivate session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
