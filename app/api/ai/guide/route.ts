import { NextRequest, NextResponse } from 'next/server';
import { createAdaptiveEngine } from '@/lib/ai/adaptive-engine';
import { AIUtils, validateEnvironmentVars } from '@/lib/ai/utils';
import type { GuidanceRequest } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    validateEnvironmentVars();

    const body = await request.json() as GuidanceRequest;

    // Validate required fields
    if (!body.user_id || !body.pattern_id || !body.problem_id || !body.user_input) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, pattern_id, problem_id, user_input' },
        { status: 400 }
      );
    }

    // Validate context structure
    if (!body.context || typeof body.context.hint_level !== 'number') {
      return NextResponse.json(
        { error: 'Invalid context: hint_level is required' },
        { status: 400 }
      );
    }

    const adaptiveEngine = createAdaptiveEngine();

    // Check rate limiting (optional - can be implemented with Redis later)
    // const rateLimiter = AIUtils.createRateLimiter(60); // 60 requests per minute
    // if (!rateLimiter.canMakeRequest()) {
    //   return NextResponse.json(
    //     { error: 'Rate limit exceeded. Please slow down.' },
    //     { status: 429 }
    //   );
    // }

    const { result: guidance, duration } = await AIUtils.measurePerformance(
      () => adaptiveEngine.provideGuidance(body)
    );

    // Validate response quality
    const qualityCheck = AIUtils.validateResponseQuality(guidance.content, 50);
    if (!qualityCheck.isValid) {
      console.warn('Low quality guidance response:', qualityCheck.issues);
    }

    return NextResponse.json({
      success: true,
      data: guidance,
      metadata: {
        response_time: duration,
        quality_score: qualityCheck.isValid ? 100 : 60,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Guidance API Error:', error);

    const errorInfo = AIUtils.handleAIError(error);

    return NextResponse.json(
      {
        success: false,
        error: errorInfo.message,
        fallback_response: errorInfo.fallbackResponse,
        should_retry: errorInfo.shouldRetry,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for guidance templates or status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pattern_id = searchParams.get('pattern_id');
    const problem_id = searchParams.get('problem_id');

    if (!pattern_id || !problem_id) {
      return NextResponse.json(
        { error: 'pattern_id and problem_id query parameters are required' },
        { status: 400 }
      );
    }

    // Return guidance context information
    return NextResponse.json({
      success: true,
      data: {
        pattern_id,
        problem_id,
        available_hint_levels: [1, 2, 3, 4, 5],
        guidance_types: ['socratic', 'direct', 'encouraging'],
        max_attempts: 10,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get guidance info' },
      { status: 500 }
    );
  }
}
