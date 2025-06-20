import { GeminiClient } from '@/lib/ai/gemini';
import { createAdaptiveEngine } from '@/lib/ai/adaptive-engine';
import { AIUtils } from '@/lib/ai/utils';

// Mock the Google Generative AI module
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mocked AI response: The two-pointer technique uses two pointers to efficiently solve array problems.'
        }
      }),
      countTokens: jest.fn().mockResolvedValue({ totalTokens: 15 })
    })
  }))
}));

describe('AI System Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GeminiClient', () => {
    let client: GeminiClient;

    beforeEach(() => {
      client = new GeminiClient({
        apiKey: 'test-key',
        proModel: 'gemini-1.5-pro',
        flashModel: 'gemini-1.5-flash'
      });
    });

    test('should generate response successfully', async () => {
      const response = await client.generateResponse('Test prompt', {
        model: 'pro',
        maxTokens: 100,
        temperature: 0.3
      });

      expect(response).toHaveProperty('content');
      expect(response).toHaveProperty('usage');
      expect(response).toHaveProperty('responseTime');
      expect(response.content).toContain('two-pointer technique');
      expect(typeof response.responseTime).toBe('number');
    });

    test('should calculate cost correctly', () => {
      const cost = client.calculateCost(100, 50, 'pro');
      expect(typeof cost).toBe('number');
      expect(cost).toBeGreaterThan(0);
    });

    test('should handle different models', async () => {
      const proResponse = await client.generateResponse('Test', { model: 'pro' });
      const flashResponse = await client.generateResponse('Test', { model: 'flash' });

      expect(proResponse.content).toBeDefined();
      expect(flashResponse.content).toBeDefined();
    });
  });

  describe('AdaptiveEngine', () => {
    let engine: ReturnType<typeof createAdaptiveEngine>;

    beforeEach(() => {
      engine = createAdaptiveEngine();
    });

    test('should assess user successfully', async () => {
      const assessment = await engine.assessUser({
        user_id: 'test-user',
        pattern_id: 'two-pointer',
        assessment_type: 'initial',
        user_input: 'I am an intermediate developer',
        context: {
          experience: 'intermediate',
          background: 'Web development'
        }
      });

      expect(assessment).toHaveProperty('user_level');
      expect(assessment).toHaveProperty('learning_pace');
      expect(assessment).toHaveProperty('confidence_score');
      expect(assessment).toHaveProperty('recommended_path');
      expect(assessment).toHaveProperty('next_action');

      // Validate response structure
      expect(['beginner', 'intermediate', 'advanced']).toContain(assessment.user_level);
      expect(['fast', 'balanced', 'thorough']).toContain(assessment.learning_pace);
      expect(typeof assessment.confidence_score).toBe('number');
      expect(Array.isArray(assessment.recommended_path)).toBe(true);
    });

    test('should provide guidance successfully', async () => {
      const guidance = await engine.provideGuidance({
        user_id: 'test-user',
        pattern_id: 'two-pointer',
        problem_id: 'two-sum-ii',
        user_input: 'I need help with this problem',
        context: {
          current_level: 1,
          attempts: 1,
          hint_level: 2,
          user_profile: {
            id: 'test-user',
            experience_level: 'intermediate',
            learning_pace: 'balanced',
            preferred_style: 'visual'
          }
        }
      });

      expect(guidance).toHaveProperty('response_type');
      expect(guidance).toHaveProperty('content');
      expect(guidance).toHaveProperty('hint_level');
      expect(guidance).toHaveProperty('suggested_action');
      expect(guidance).toHaveProperty('metadata');

      // Validate response structure
      expect(['hint', 'explanation', 'encouragement', 'correction', 'next_step']).toContain(guidance.response_type);
      expect(typeof guidance.content).toBe('string');
      expect(guidance.content.length).toBeGreaterThan(0);
      expect(guidance.metadata).toHaveProperty('token_usage');
      expect(guidance.metadata).toHaveProperty('cost_estimate');
    });

    test('should validate solution successfully', async () => {
      const validation = await engine.validateSolution({
        user_id: 'test-user',
        pattern_id: 'two-pointer',
        problem_id: 'two-sum-ii',
        user_solution: 'function twoSum(nums, target) { /* solution */ }',
        solution_approach: 'Used two pointers from start and end',
        context: {}
      });

      expect(validation).toHaveProperty('is_correct');
      expect(validation).toHaveProperty('pattern_recognition');
      expect(validation).toHaveProperty('efficiency_score');
      expect(validation).toHaveProperty('understanding_level');
      expect(validation).toHaveProperty('feedback');
      expect(validation).toHaveProperty('improvement_suggestions');
      expect(validation).toHaveProperty('transfer_likelihood');

      // Validate response structure
      expect(typeof validation.is_correct).toBe('boolean');
      expect(typeof validation.pattern_recognition).toBe('boolean');
      expect(typeof validation.efficiency_score).toBe('number');
      expect(['surface', 'functional', 'deep']).toContain(validation.understanding_level);
      expect(Array.isArray(validation.improvement_suggestions)).toBe(true);
    });

    test('should handle chat successfully', async () => {
      const chatResponse = await engine.handleChat({
        user_id: 'test-user',
        message: 'Can you explain the two-pointer technique?',
        context: {
          pattern_id: 'two-pointer',
          conversation_history: [],
          user_profile: {
            id: 'test-user',
            experience_level: 'intermediate',
            learning_pace: 'balanced',
            preferred_style: 'conceptual'
          }
        }
      });

      expect(chatResponse).toHaveProperty('message');
      expect(chatResponse).toHaveProperty('response_type');
      expect(chatResponse).toHaveProperty('suggested_actions');
      expect(chatResponse).toHaveProperty('metadata');

      expect(typeof chatResponse.message).toBe('string');
      expect(chatResponse.message.length).toBeGreaterThan(0);
      expect(['answer', 'question', 'guidance', 'encouragement']).toContain(chatResponse.response_type);
      expect(Array.isArray(chatResponse.suggested_actions)).toBe(true);
    });
  });

  describe('AIUtils', () => {
    test('should format cost correctly', () => {
      expect(AIUtils.formatCost(0.1234)).toBe('$0.1234');
      expect(AIUtils.formatCost(0.0001)).toBe('$0.0001');
      expect(AIUtils.formatCost(1)).toBe('$1.0000');
    });

    test('should estimate tokens correctly', () => {
      const text = 'This is a test message';
      const tokens = AIUtils.estimateTokens(text);
      expect(typeof tokens).toBe('number');
      expect(tokens).toBeGreaterThan(0);
    });

    test('should validate response quality', () => {
      const goodResponse = 'This is a comprehensive response that provides valuable information to the user.';
      const badResponse = '';

      const goodResult = AIUtils.validateResponseQuality(goodResponse, 50);
      const badResult = AIUtils.validateResponseQuality(badResponse, 50);

      expect(goodResult.isValid).toBe(true);
      expect(goodResult.issues).toHaveLength(0);

      expect(badResult.isValid).toBe(false);
      expect(badResult.issues.length).toBeGreaterThan(0);
    });

    test('should handle AI errors correctly', () => {
      const quotaError = new Error('Quota exceeded');
      const networkError = new Error('Network timeout');
      const unknownError = new Error('Unknown error');

      const quotaResult = AIUtils.handleAIError(quotaError);
      const networkResult = AIUtils.handleAIError(networkError);
      const unknownResult = AIUtils.handleAIError(unknownError);

      expect(quotaResult.shouldRetry).toBe(false);
      expect(networkResult.shouldRetry).toBe(true);
      expect(unknownResult.shouldRetry).toBe(true);

      expect(quotaResult.fallbackResponse).toBeDefined();
      expect(networkResult.fallbackResponse).toBeDefined();
      expect(unknownResult.fallbackResponse).toBeDefined();
    });
  });

  describe('Integration Flow', () => {
    test('should complete full learning flow', async () => {
      const engine = createAdaptiveEngine();

      // 1. Initial assessment
      const assessment = await engine.assessUser({
        user_id: 'test-user',
        pattern_id: 'two-pointer',
        assessment_type: 'initial',
        user_input: 'Intermediate developer, familiar with arrays',
        context: {}
      });

      expect(assessment.user_level).toBeDefined();

      // 2. Provide guidance based on assessment
      const guidance = await engine.provideGuidance({
        user_id: 'test-user',
        pattern_id: 'two-pointer',
        problem_id: 'two-sum-ii',
        user_input: 'Not sure how to start',
        context: {
          current_level: 1,
          attempts: 1,
          hint_level: 1,
          user_profile: {
            id: 'test-user',
            experience_level: assessment.user_level,
            learning_pace: assessment.learning_pace,
            preferred_style: 'visual'
          }
        }
      });

      expect(guidance.content).toBeDefined();

      // 3. Validate solution
      const validation = await engine.validateSolution({
        user_id: 'test-user',
        pattern_id: 'two-pointer',
        problem_id: 'two-sum-ii',
        user_solution: 'function twoSum(nums, target) { return [0, 1]; }',
        solution_approach: 'Used two pointers',
        context: {}
      });

      expect(validation.feedback).toBeDefined();

      // Verify the flow makes sense
      expect(assessment.recommended_path).toEqual(expect.any(Array));
      expect(guidance.suggested_action).toEqual(expect.any(String));
      expect(validation.understanding_level).toEqual(expect.any(String));
    });
  });
});
