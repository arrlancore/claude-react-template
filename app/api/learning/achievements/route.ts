import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, achievements } = body

    if (!user_id || !achievements || !Array.isArray(achievements)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Save achievements
    const achievementRecords = achievements.map(achievement => ({
      user_id,
      achievement_id: achievement.id,
      achievement_name: achievement.name,
      achievement_data: achievement,
      unlocked_at: achievement.unlocked_at || new Date().toISOString(),
      created_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('user_achievements')
      .upsert(achievementRecords, {
        onConflict: 'user_id,achievement_id',
        ignoreDuplicates: true
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save achievements' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      saved_count: data?.length || 0
    })

  } catch (error) {
    console.error('Achievements API error:', error)
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

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    let query = supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    if (patternId) {
      // Filter by pattern if specified
      query = query.filter('achievement_data->pattern_id', 'eq', patternId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      )
    }

    const achievements = data?.map(record => ({
      ...record.achievement_data,
      unlocked_at: record.unlocked_at
    })) || []

    return NextResponse.json({
      achievements,
      total_count: achievements.length,
      total_points: achievements.reduce((sum, ach) => sum + (ach.points || 0), 0)
    })

  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
