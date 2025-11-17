// Main AI service exports
export { GeminiClient, createGeminiClient } from './gemini';
export { AdaptiveEngine, createAdaptiveEngine } from './adaptive-engine';
export { PromptTemplateManager, getPromptManager } from './prompt-templates';
export { AIUtils, validateEnvironmentVars, AI_CONSTANTS } from './utils';

// Type exports
export type {
  AIConfig,
  UserProfile,
  AssessmentRequest,
  AssessmentResponse,
  GuidanceRequest,
  GuidanceResponse,
  ValidationRequest,
  ValidationResponse,
  ChatRequest,
  ChatResponse,
  ChatMessage,
  AIUsageTracking,
  PromptTemplate,
} from './types';

// Quick setup function for the entire AI system
export function initializeAISystem() {
  try {
    validateEnvironmentVars();
    const engine = createAdaptiveEngine();
    const client = createGeminiClient();
    const promptManager = getPromptManager();

    return {
      engine,
      client,
      promptManager,
      isReady: true,
    };
  } catch (error) {
    console.error('Failed to initialize AI system:', error);
    return {
      engine: null,
      client: null,
      promptManager: null,
      isReady: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Health check for the entire AI system
export async function checkAISystemHealth() {
  try {
    const { engine, isReady } = initializeAISystem();

    if (!isReady || !engine) {
      return {
        status: 'unhealthy',
        message: 'AI system not properly initialized',
        components: {
          gemini: false,
          prompts: false,
          engine: false,
        },
      };
    }

    const geminiHealthy = await engine.healthCheck();

    return {
      status: geminiHealthy ? 'healthy' : 'degraded',
      message: geminiHealthy ? 'All systems operational' : 'Gemini API issues detected',
      components: {
        gemini: geminiHealthy,
        prompts: true,
        engine: true,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Health check failed',
      components: {
        gemini: false,
        prompts: false,
        engine: false,
      },
    };
  }
}
