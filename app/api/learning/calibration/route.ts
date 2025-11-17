import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, pattern_id, calibration_result } = body

    if (!user_id || !pattern_id || !calibration_result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Save calibration result
    const { data, error } = await supabase
      .from('user_calibrations')
      .upsert({
        user_id,
        pattern_id,
        persona_type: calibration_result.persona_type.id,
        total_score: calibration_result.total_score,
        responses: calibration_result.user_responses,
        guidance_config: calibration_result.guidance_config,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save calibration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      calibration_id: data?.[0]?.id,
      persona_type: calibration_result.persona_type.id
    })

  } catch (error) {
    console.error('Calibration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const patternId = searchParams.get('pattern_id')

    if (!userId || !patternId) {
      return NextResponse.json(
        { error: 'Missing user_id or pattern_id' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from('user_calibrations')
      .select('*')
      .eq('user_id', userId)
      .eq('pattern_id', patternId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Calibration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      calibration_id: data.id,
      persona_type: data.persona_type,
      total_score: data.total_score,
      responses: data.responses,
      guidance_config: data.guidance_config,
      created_at: data.created_at
    })

  } catch (error) {
    console.error('Get calibration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
