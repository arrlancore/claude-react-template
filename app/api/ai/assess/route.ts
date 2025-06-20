import { NextRequest, NextResponse } from 'next/server';
import { createAdaptiveEngine } from '@/lib/ai/adaptive-engine';
import { AIUtils, validateEnvironmentVars } from '@/lib/ai/utils';
import type { AssessmentRequest } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvironmentVars();

    const body = await request.json() as AssessmentRequest;

    // Validate required fields
    if (!body.user_id || !body.pattern_id || !body.assessment_type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, pattern_id, assessment_type' },
        { status: 400 }
      );
    }

    const adaptiveEngine = createAdaptiveEngine();

    // Perform assessment with performance measurement
    const { result: assessment, duration } = await AIUtils.measurePerformance(
      () => adaptiveEngine.assessUser(body)
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      metadata: {
        response_time: duration,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Assessment API Error:', error);

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

export async function GET(request: NextRequest) {
  try {
    const adaptiveEngine = createAdaptiveEngine();
    const isHealthy = await adaptiveEngine.healthCheck();

    return NextResponse.json({
      success: true,
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, status: 'error', error: 'Health check failed' },
      { status: 500 }
    );
  }
}
