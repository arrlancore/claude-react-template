import type { UserProfile, AIUsageTracking } from './types';

export class AIUtils {
  // Cost management utilities
  static calculateMonthlyCost(usageRecords: AIUsageTracking[]): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return usageRecords
      .filter(record => record.timestamp >= monthStart)
      .reduce((total, record) => total + record.cost_estimate, 0);
  }

  static isNearCostLimit(usageRecords: AIUsageTracking[], monthlyLimit: number = 3.0): boolean {
    const monthlyCost = this.calculateMonthlyCost(usageRecords);
    const warningThreshold = parseFloat(process.env.AI_COST_WARNING_THRESHOLD || '0.8');
    return monthlyCost >= (monthlyLimit * warningThreshold);
  }

  static formatCost(cost: number): string {
    return `$${cost.toFixed(4)}`;
  }

  // User profile utilities
  static adaptPromptToUser(basePrompt: string, profile: UserProfile): string {
    let adaptedPrompt = basePrompt;

    // Adjust for learning pace
    const paceInstructions = {
      fast: 'Keep explanations concise and move quickly to the core concept.',
      balanced: 'Provide balanced explanations with examples.',
      thorough: 'Give detailed explanations with multiple examples and edge cases.'
    };

    // Adjust for preferred style
    const styleInstructions = {
      visual: 'Use visual metaphors and step-by-step breakdowns.',
      conceptual: 'Focus on the underlying concepts and why they work.',
      practical: 'Emphasize practical application and real-world examples.'
    };

    const paceInstruction = paceInstructions[profile.learning_pace];
    const styleInstruction = styleInstructions[profile.preferred_style];

    adaptedPrompt += `\n\nAdaptation Instructions:
- Learning pace: ${paceInstruction}
- Learning style: ${styleInstruction}
- Experience level: Adjust complexity for ${profile.experience_level} level`;

    return adaptedPrompt;
  }

  static determineOptimalModel(operation: string, userProfile: UserProfile): 'pro' | 'flash' {
    // Use Pro model for:
    // - Initial assessments
    // - Solution validation
    // - Complex pattern explanations for beginners

    if (operation === 'assessment' || operation === 'validation') {
      return 'pro';
    }

    if (operation === 'guidance' && userProfile.experience_level === 'beginner') {
      return 'pro';
    }

    // Use Flash model for:
    // - Chat interactions
    // - Simple hints
    // - Quick responses for advanced users
    return 'flash';
  }

  // Response quality utilities
  static validateResponseQuality(response: string, expectedLength: number = 100): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (!response || response.trim().length === 0) {
      issues.push('Empty response');
    }

    if (response.length < expectedLength * 0.5) {
      issues.push('Response too short');
    }

    if (response.length > expectedLength * 3) {
      issues.push('Response too long');
    }

    if (response.includes('[object Object]') || response.includes('undefined')) {
      issues.push('Contains formatting errors');
    }

    if (response.includes('I cannot') || response.includes('I am unable')) {
      issues.push('AI declined to respond');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static sanitizeAIResponse(response: string): string {
    return response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*{\s*|\s*}\s*$/g, match => match.trim())
      .trim();
  }

  // Token estimation utilities
  static estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  static truncateToTokenLimit(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(text);
    if (estimatedTokens <= maxTokens) {
      return text;
    }

    const maxChars = maxTokens * 4;
    return text.substring(0, maxChars - 3) + '...';
  }

  // Conversation utilities
  static formatConversationHistory(messages: { role: string; content: string; timestamp: Date }[]): string {
    return messages
      .slice(-10) // Last 10 messages to stay within token limits
      .map(msg => {
        const time = msg.timestamp.toLocaleTimeString();
        return `[${time}] ${msg.role}: ${msg.content}`;
      })
      .join('\n');
  }

  static extractCodeFromResponse(response: string): string | null {
    // Extract code blocks from AI responses
    const codeBlockRegex = /```(?:javascript|typescript|js|ts)?\s*([\s\S]*?)```/i;
    const match = response.match(codeBlockRegex);
    return match ? match[1].trim() : null;
  }

  // Pattern utilities
  static formatPatternName(patternId: string): string {
    return patternId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static formatProblemName(problemId: string): string {
    return problemId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Error handling utilities
  static handleAIError(error: any): {
    message: string;
    shouldRetry: boolean;
    fallbackResponse?: string;
  } {
    const errorMessage = error.message || 'Unknown AI error';

    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return {
        message: 'AI service temporarily unavailable due to usage limits',
        shouldRetry: false,
        fallbackResponse: 'Please try again later or contact support if this persists.'
      };
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return {
        message: 'Network connection issue',
        shouldRetry: true,
        fallbackResponse: 'Please check your connection and try again.'
      };
    }

    if (errorMessage.includes('invalid') || errorMessage.includes('malformed')) {
      return {
        message: 'Invalid request format',
        shouldRetry: false,
        fallbackResponse: 'There was an issue with your request. Please try rephrasing.'
      };
    }

    return {
      message: 'AI service error',
      shouldRetry: true,
      fallbackResponse: 'Something went wrong. Please try again.'
    };
  }

  // Performance utilities
  static measurePerformance<T>(operation: () => Promise<T>): Promise<{
    result: T;
    duration: number;
  }> {
    const start = Date.now();
    return operation().then(result => ({
      result,
      duration: Date.now() - start
    }));
  }

  static createRateLimiter(requestsPerMinute: number) {
    const requests: number[] = [];

    return {
      canMakeRequest(): boolean {
        const now = Date.now();
        const minuteAgo = now - 60000;

        // Remove old requests
        while (requests.length > 0 && requests[0] < minuteAgo) {
          requests.shift();
        }

        return requests.length < requestsPerMinute;
      },

      recordRequest(): void {
        requests.push(Date.now());
      }
    };
  }

  // Caching utilities
  static createSimpleCache<T>(maxSize: number = 100) {
    const cache = new Map<string, { value: T; timestamp: number }>();

    return {
      get(key: string, maxAge: number = 300000): T | null { // 5 min default
        const entry = cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > maxAge) {
          cache.delete(key);
          return null;
        }

        return entry.value;
      },

      set(key: string, value: T): void {
        if (cache.size >= maxSize) {
          // Remove oldest entry
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }

        cache.set(key, { value, timestamp: Date.now() });
      },

      clear(): void {
        cache.clear();
      }
    };
  }
}

// Validation helpers
export function validateEnvironmentVars(): void {
  const required = ['GOOGLE_AI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Response type guards
export function isValidAssessmentResponse(obj: any): boolean {
  return (
    obj &&
    typeof obj === 'object' &&
    ['beginner', 'intermediate', 'advanced'].includes(obj.user_level) &&
    ['fast', 'balanced', 'thorough'].includes(obj.learning_pace) &&
    Array.isArray(obj.recommended_path) &&
    typeof obj.confidence_score === 'number'
  );
}

export function isValidGuidanceResponse(obj: any): boolean {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.content === 'string' &&
    typeof obj.hint_level === 'number' &&
    ['hint', 'explanation', 'encouragement', 'correction', 'next_step'].includes(obj.response_type)
  );
}

// Export commonly used constants
export const AI_CONSTANTS = {
  DEFAULT_MAX_TOKENS: 1000,
  DEFAULT_TEMPERATURE: 0.7,
  FLASH_MAX_TOKENS: 500,
  PRO_MAX_TOKENS: 1500,
  MAX_CONVERSATION_HISTORY: 10,
  COST_WARNING_THRESHOLD: 0.8,
  DEFAULT_MONTHLY_LIMIT: 3.0,
  RATE_LIMIT_PER_MINUTE: 60,
  CACHE_TTL: 300000, // 5 minutes
} as const;
