import { NextRequest, NextResponse } from 'next/server';
import { PersonaManager } from '@/lib/ai/persona-manager';
import type { CalibrationRequest, PersonaCalibrationResult } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CalibrationRequest;

    if (!body.user_id || !body.responses || body.responses.length !== 3) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, responses (3 required)' },
        { status: 400 }
      );
    }

    // Determine persona level from responses
    const personaLevel = PersonaManager.determinePersonaLevel(body.responses);

    // Calculate confidence score
    const experienceScore = body.responses.find(r => r.question_id === 'experience');
    const patternScore = body.responses.find(r => r.question_id === 'pattern_recognition');
    const timelineScore = body.responses.find(r => r.question_id === 'timeline');

    let confidence = 75; // baseline
    if (experienceScore?.answer.includes('20_plus')) confidence += 15;
    if (patternScore?.answer.includes('definitely')) confidence += 10;

    const result: PersonaCalibrationResult = {
      persona_level: personaLevel,
      confidence_score: Math.min(confidence, 95),
      reasoning: `Assigned ${personaLevel} based on experience level and pattern recognition ability`
    };

    // TODO: Store in Supabase user profile
    // await updateUserPersona(body.user_id, personaLevel);

    return NextResponse.json({
      success: true,
      data: result,
      calibration_questions: PersonaManager.getCalibrationQuestions(),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Calibration API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process calibration',
        fallback_persona: 'balanced_learner'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    return NextResponse.json({
      success: true,
      data: {
        calibration_available: true,
        user_id,
        questions: PersonaManager.getCalibrationQuestions(),
        estimated_time: "2-3 minutes",
        persona_levels: [
          {
            level: 'fast_learner',
            description: 'Quick comprehension, prefers challenges',
            characteristics: ['Minimal explanations', 'Advanced variations', 'Achievement-focused']
          },
          {
            level: 'balanced_learner',
            description: 'Standard learning pace, balanced approach',
            characteristics: ['Thorough explanations', 'Progressive hints', 'Momentum building']
          },
          {
            level: 'struggling_learner',
            description: 'Detailed guidance, patient approach',
            characteristics: ['Multiple analogies', 'Gentle hints', 'Confidence building']
          }
        ]
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get calibration info' },
      { status: 500 }
    );
  }
}
