import { createGeminiClient } from './gemini';
import { getPromptManager } from './prompt-templates';
import { PersonaManager } from './persona-manager';
import { TeachingStepManager } from './teaching-steps';
import type {
  AssessmentRequest,
  AssessmentResponse,
  GuidanceRequest,
  GuidanceResponse,
  ValidationRequest,
  ValidationResponse,
  ChatRequest,
  ChatResponse,
  UserProfile,
  AIUsageTracking,
  PersonaLevel,
} from './types';

export class AdaptiveEngine {
  private geminiClient = createGeminiClient();
  private promptManager = getPromptManager();

  // Assessment Methods
  async assessUser(request: AssessmentRequest): Promise<AssessmentResponse> {
    const templateId = this.getAssessmentTemplate(request.assessment_type);
    const variables = this.buildAssessmentVariables(request);

    const rendered = this.promptManager.renderTemplate(templateId, variables);
    if (!rendered) {
      throw new Error(`Assessment template ${templateId} not found`);
    }

    const response = await this.geminiClient.generateResponse(
      rendered.prompt,
      {
        model: rendered.template.model_preference === 'flash' ? 'flash' : 'pro',
        maxTokens: rendered.template.max_tokens,
        temperature: rendered.template.temperature,
      }
    );

    // Track usage
    await this.trackUsage({
      user_id: request.user_id,
      operation_type: 'assessment',
      pattern_id: request.pattern_id,
      input_tokens: response.usage.inputTokens,
      output_tokens: response.usage.outputTokens,
      response_time: response.responseTime,
    });

    return this.parseAssessmentResponse(response.content);
  }

  // Guidance Methods
  async provideGuidance(request: GuidanceRequest): Promise<GuidanceResponse> {
    const templateId = this.getGuidanceTemplate(request.context.hint_level);
    const variables = this.buildGuidanceVariables(request);

    const rendered = this.promptManager.renderTemplate(templateId, variables);
    if (!rendered) {
      throw new Error(`Guidance template ${templateId} not found`);
    }

    const response = await this.geminiClient.generateResponse(
      rendered.prompt,
      {
        model: 'flash', // Use fast model for real-time guidance
        maxTokens: rendered.template.max_tokens,
        temperature: rendered.template.temperature,
      }
    );

    await this.trackUsage({
      user_id: request.user_id,
      operation_type: 'guidance',
      pattern_id: request.pattern_id,
      problem_id: request.problem_id,
      input_tokens: response.usage.inputTokens,
      output_tokens: response.usage.outputTokens,
      response_time: response.responseTime,
    });

    return this.parseGuidanceResponse(response, request.context.hint_level);
  }

  // Validation Methods
  async validateSolution(request: ValidationRequest): Promise<ValidationResponse> {
    const variables = this.buildValidationVariables(request);

    const rendered = this.promptManager.renderTemplate('solution_validation', variables);
    if (!rendered) {
      throw new Error('Solution validation template not found');
    }

    const response = await this.geminiClient.generateResponse(
      rendered.prompt,
      {
        model: 'pro', // Use powerful model for thorough validation
        maxTokens: rendered.template.max_tokens,
        temperature: rendered.template.temperature,
      }
    );

    await this.trackUsage({
      user_id: request.user_id,
      operation_type: 'validation',
      pattern_id: request.pattern_id,
      problem_id: request.problem_id,
      input_tokens: response.usage.inputTokens,
      output_tokens: response.usage.outputTokens,
      response_time: response.responseTime,
    });

    return this.parseValidationResponse(response.content);
  }

  // Chat Methods
  async handleChat(request: ChatRequest): Promise<ChatResponse> {
    // Get user's persona level (fallback to balanced if not set)
    const personaLevel = await this.getUserPersonaLevel(request.user_id);

    // Determine current teaching step
    const currentStepId = TeachingStepManager.determineCurrentStep(request.context);
    const currentStep = TeachingStepManager.getStep(currentStepId);

    if (!currentStep) {
      throw new Error(`Invalid teaching step: ${currentStepId}`);
    }

    // Build persona-aware context
    const personaContext = {
      pattern_name: request.context.pattern_id?.replace('-', ' ') || 'general DSA',
      current_problem: request.context.problem_id?.replace('-', ' ') || 'none',
      user_message: request.message,
      step_objective: currentStep.objective,
      conversation_history: request.context.conversation_history
        .slice(-5)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')
    };

    // Generate persona-aware prompt
    const personaPrompt = PersonaManager.buildPersonaPrompt(personaLevel, currentStep, personaContext);

    const response = await this.geminiClient.generateResponse(
      personaPrompt,
      {
        model: 'flash',
        maxTokens: 400,
        temperature: 0.7,
      }
    );

    await this.trackUsage({
      user_id: request.user_id,
      operation_type: 'chat',
      pattern_id: request.context.pattern_id,
      problem_id: request.context.problem_id,
      input_tokens: response.usage.inputTokens,
      output_tokens: response.usage.outputTokens,
      response_time: response.responseTime,
    });

    return this.parseChatResponse(response);
  }

  // Helper Methods
  private getAssessmentTemplate(type: string): string {
    const templates = {
      initial: 'initial_assessment',
      progress: 'progress_assessment',
      mastery: 'progress_assessment', // Use same for now
    };
    return templates[type as keyof typeof templates] || 'initial_assessment';
  }

  private async getUserPersonaLevel(userId: string): Promise<PersonaLevel> {
    // TODO: Get from Supabase user profile
    // For now, return default
    return 'balanced_learner';
  }

  private getGuidanceTemplate(hintLevel: number): string {
    return hintLevel <= 2 ? 'socratic_guidance' : 'adaptive_hint';
  }

  private buildAssessmentVariables(request: AssessmentRequest): Record<string, string> {
    return {
      pattern_name: request.pattern_id.replace('-', ' '),
      user_experience: request.context?.experience || 'unknown',
      coding_background: request.context?.background || 'unknown',
      self_assessment: request.user_input || 'not provided',
      pattern_description: request.context?.pattern_description || 'DSA pattern',
    };
  }

  private buildGuidanceVariables(request: GuidanceRequest): Record<string, string> {
    const userContext = this.promptManager.buildUserProfileContext(request.context.user_profile);

    return {
      pattern_name: request.pattern_id.replace('-', ' '),
      problem_description: request.context.problem_description || 'current problem',
      problem_title: request.problem_id.replace('-', ' '),
      user_input: request.user_input,
      user_approach: request.user_input,
      hint_level: request.context.hint_level.toString(),
      attempt_count: request.context.attempts.toString(),
      ...userContext,
    };
  }

  private buildValidationVariables(request: ValidationRequest): Record<string, string> {
    return {
      pattern_name: request.pattern_id.replace('-', ' '),
      problem_description: request.context.problem_description || 'current problem',
      user_solution: request.user_solution,
      user_explanation: request.solution_approach,
    };
  }

  private buildChatVariables(request: ChatRequest): Record<string, string> {
    const userContext = this.promptManager.buildUserProfileContext(request.context.user_profile);
    const historyText = request.context.conversation_history
      .slice(-5) // Last 5 messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return {
      pattern_name: request.context.pattern_id?.replace('-', ' ') || 'general',
      current_problem: request.context.problem_id?.replace('-', ' ') || 'none',
      recent_progress: 'making good progress', // TODO: Get from user data
      user_message: request.message,
      conversation_history: historyText,
      ...userContext,
    };
  }

  // Response Parsers
  private parseAssessmentResponse(content: string): AssessmentResponse {
    try {
      const parsed = JSON.parse(content);
      return {
        user_level: parsed.user_level || 'beginner',
        learning_pace: parsed.learning_pace || 'balanced',
        recommended_path: parsed.recommended_path || [],
        confidence_score: parsed.confidence_score || 70,
        next_action: parsed.next_action || 'start_learning',
        ai_reasoning: parsed.ai_reasoning || 'Assessment completed',
      };
    } catch {
      // Fallback parsing
      return {
        user_level: 'beginner',
        learning_pace: 'balanced',
        recommended_path: ['start_with_basics'],
        confidence_score: 60,
        next_action: 'start_learning',
        ai_reasoning: 'Unable to parse detailed assessment, using defaults',
      };
    }
  }

  private parseGuidanceResponse(response: any, hintLevel: number): GuidanceResponse {
    return {
      response_type: this.determineResponseType(response.content),
      content: response.content,
      hint_level: hintLevel,
      confidence_score: 85, // TODO: Extract from response
      suggested_action: 'continue',
      metadata: {
        response_time: response.responseTime,
        token_usage: response.usage.outputTokens,
        cost_estimate: this.geminiClient.calculateCost(
          response.usage.inputTokens,
          response.usage.outputTokens,
          'flash'
        ),
      },
    };
  }

  private parseValidationResponse(content: string): ValidationResponse {
    try {
      const parsed = JSON.parse(content);
      return {
        is_correct: parsed.is_correct || false,
        pattern_recognition: parsed.pattern_recognition || false,
        efficiency_score: parsed.efficiency_score || 50,
        understanding_level: parsed.understanding_level || 'surface',
        feedback: parsed.feedback || 'Solution evaluated',
        improvement_suggestions: parsed.improvement_suggestions || [],
        transfer_likelihood: parsed.transfer_likelihood || 50,
        mastery_indicators: parsed.mastery_indicators || [],
      };
    } catch {
      return {
        is_correct: false,
        pattern_recognition: false,
        efficiency_score: 40,
        understanding_level: 'surface',
        feedback: 'Could not fully evaluate solution',
        improvement_suggestions: ['Review the pattern fundamentals'],
        transfer_likelihood: 30,
        mastery_indicators: [],
      };
    }
  }

  private parseChatResponse(response: any): ChatResponse {
    return {
      message: response.content,
      response_type: 'answer',
      suggested_actions: [], // TODO: Extract from response
      metadata: {
        confidence: 85,
        token_usage: response.usage.outputTokens,
        cost_estimate: this.geminiClient.calculateCost(
          response.usage.inputTokens,
          response.usage.outputTokens,
          'flash'
        ),
      },
    };
  }

  private determineResponseType(content: string): 'hint' | 'explanation' | 'encouragement' | 'correction' | 'next_step' {
    const lower = content.toLowerCase();
    if (lower.includes('try') || lower.includes('think about')) return 'hint';
    if (lower.includes('great') || lower.includes('excellent')) return 'encouragement';
    if (lower.includes('actually') || lower.includes('however')) return 'correction';
    if (lower.includes('next') || lower.includes('now')) return 'next_step';
    return 'explanation';
  }

  private async trackUsage(usage: Omit<AIUsageTracking, 'session_id' | 'timestamp' | 'cost_estimate'>): Promise<void> {
    const fullUsage: AIUsageTracking = {
      ...usage,
      session_id: this.generateSessionId(),
      timestamp: new Date(),
      cost_estimate: this.geminiClient.calculateCost(usage.input_tokens, usage.output_tokens),
    };

    // TODO: Store in Supabase
    console.log('AI Usage:', fullUsage);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return await this.geminiClient.healthCheck();
  }
}

// Singleton instance
let adaptiveEngine: AdaptiveEngine | null = null;

export function createAdaptiveEngine(): AdaptiveEngine {
  if (!adaptiveEngine) {
    adaptiveEngine = new AdaptiveEngine();
  }
  return adaptiveEngine;
}

export { adaptiveEngine };
