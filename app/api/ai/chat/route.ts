import { NextRequest, NextResponse } from 'next/server';
import { createAdaptiveEngine } from '@/lib/ai/adaptive-engine';
import { AIUtils, validateEnvironmentVars } from '@/lib/ai/utils';
import type { ChatRequest, ChatMessage } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    validateEnvironmentVars();

    const body = await request.json() as ChatRequest;

    // Validate required fields
    if (!body.user_id || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, message' },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long. Maximum 1000 characters allowed.' },
        { status: 400 }
      );
    }

    // Validate conversation history length
    if (body.context?.conversation_history && body.context.conversation_history.length > 20) {
      // Truncate to last 10 messages to stay within token limits
      body.context.conversation_history = body.context.conversation_history.slice(-10);
    }

    const adaptiveEngine = createAdaptiveEngine();

    const { result: chatResponse, duration } = await AIUtils.measurePerformance(
      () => adaptiveEngine.handleChat(body)
    );

    // Validate response quality
    const qualityCheck = AIUtils.validateResponseQuality(chatResponse.message, 20);

    return NextResponse.json({
      success: true,
      data: chatResponse,
      metadata: {
        response_time: duration,
        message_length: chatResponse.message.length,
        quality_score: qualityCheck.isValid ? 100 : 70,
        context: {
          pattern_id: body.context?.pattern_id,
          problem_id: body.context?.problem_id,
          conversation_length: body.context?.conversation_history?.length || 0,
        },
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);

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

// GET endpoint for chat status and configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    return NextResponse.json({
      success: true,
      data: {
        chat_available: true,
        user_id,
        features: {
          real_time_responses: true,
          pattern_aware: true,
          adaptive_personality: true,
          conversation_memory: true,
        },
        limits: {
          max_message_length: 1000,
          max_conversation_history: 20,
          rate_limit_per_minute: 30,
        },
        supported_contexts: [
          'pattern_learning',
          'problem_solving',
          'general_questions',
          'debugging_help',
          'concept_clarification',
        ],
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get chat configuration' },
      { status: 500 }
    );
  }
}

// Helper function to create a system message for chat context
export function createSystemMessage(
  patternId?: string,
  problemId?: string,
  userProfile?: any
): ChatMessage {
  let systemContent = "You are an encouraging and knowledgeable DSA (Data Structures and Algorithms) tutor. ";

  if (patternId) {
    const patternName = AIUtils.formatPatternName(patternId);
    systemContent += `You're currently helping the user learn the ${patternName} pattern. `;
  }

  if (problemId) {
    const problemName = AIUtils.formatProblemName(problemId);
    systemContent += `They're working on the "${problemName}" problem. `;
  }

  if (userProfile) {
    systemContent += `Adapt your responses to their ${userProfile.learning_pace} learning pace and ${userProfile.preferred_style} learning style. `;
  }

  systemContent += "Be supportive, ask guiding questions, and help them discover solutions rather than giving direct answers. Focus on building their algorithmic thinking skills.";

  return {
    role: 'system',
    content: systemContent,
    timestamp: new Date(),
    metadata: {
      pattern_id: patternId,
      problem_id: problemId,
      message_type: 'system',
    },
  };
}
