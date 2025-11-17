import { NextRequest, NextResponse } from 'next/server';
import { createAdaptiveEngine } from '@/lib/ai/adaptive-engine';
import { AIUtils, validateEnvironmentVars, isValidAssessmentResponse } from '@/lib/ai/utils';
import type { ValidationRequest } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    validateEnvironmentVars();

    const body = await request.json() as ValidationRequest;

    // Validate required fields
    if (!body.user_id || !body.pattern_id || !body.problem_id || !body.user_solution) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, pattern_id, problem_id, user_solution' },
        { status: 400 }
      );
    }

    // Validate solution length (prevent abuse)
    if (body.user_solution.length > 5000) {
      return NextResponse.json(
        { error: 'Solution too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    const adaptiveEngine = createAdaptiveEngine();

    const { result: validation, duration } = await AIUtils.measurePerformance(
      () => adaptiveEngine.validateSolution(body)
    );

    // Additional validation metrics
    const codeExtracted = AIUtils.extractCodeFromResponse(body.user_solution);
    const hasCode = !!codeExtracted;

    return NextResponse.json({
      success: true,
      data: {
        ...validation,
        has_code: hasCode,
        solution_length: body.user_solution.length,
      },
      metadata: {
        response_time: duration,
        validation_timestamp: new Date().toISOString(),
        pattern_formatted: AIUtils.formatPatternName(body.pattern_id),
        problem_formatted: AIUtils.formatProblemName(body.problem_id),
      },
    });

  } catch (error: any) {
    console.error('Validation API Error:', error);

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

// GET endpoint for validation criteria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pattern_id = searchParams.get('pattern_id');
    const problem_id = searchParams.get('problem_id');

    if (!pattern_id) {
      return NextResponse.json(
        { error: 'pattern_id query parameter is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pattern_id,
        problem_id,
        validation_criteria: {
          correctness: 'Solution produces correct output for all test cases',
          pattern_recognition: 'Demonstrates understanding of the pattern',
          efficiency: 'Uses optimal time and space complexity',
          code_quality: 'Clean, readable, and well-structured code',
          edge_cases: 'Handles edge cases appropriately',
        },
        understanding_levels: {
          surface: 'Basic solution that works but shows limited understanding',
          functional: 'Good solution with clear pattern application',
          deep: 'Excellent solution with optimization and thorough understanding',
        },
        scoring: {
          efficiency_score: 'Scored 0-100 based on time/space complexity',
          transfer_likelihood: 'Probability of applying pattern to new problems (0-100)',
        },
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get validation criteria' },
      { status: 500 }
    );
  }
}
