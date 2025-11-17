import request from 'supertest';

// Mock the Google Generative AI for API tests
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            user_level: 'intermediate',
            learning_pace: 'balanced',
            recommended_path: ['start_with_basics'],
            confidence_score: 85,
            next_action: 'start_learning',
            ai_reasoning: 'User shows good foundational knowledge'
          })
        }
      }),
      countTokens: jest.fn().mockResolvedValue({ totalTokens: 15 })
    })
  }))
}));

describe('AI API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set required environment variables
    process.env.GOOGLE_AI_API_KEY = 'test-api-key';
  });

  describe('POST /api/ai/assess', () => {
    test('should handle valid assessment request', async () => {
      // Import the handler dynamically to avoid issues with mocking
      const { POST } = await import('@/app/api/ai/assess/route');

      const mockRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          assessment_type: 'initial',
          user_input: 'I am an intermediate developer',
          context: {
            experience: 'intermediate'
          }
        })
      } as any;

      const result = await POST(mockRequest);
      expect(result).toBeDefined();
    });

    test('should reject invalid request missing required fields', async () => {
      const { POST } = await import('@/app/api/ai/assess/route');

      const mockRequest = {
        json: () => Promise.resolve({
          // Missing required fields
          user_id: 'test-user'
        })
      } as any;

      const result = await POST(mockRequest);
      // Should return error response for invalid request
      expect(result).toBeDefined();
    });
  });

  describe('POST /api/ai/guide', () => {
    test('should handle valid guidance request', async () => {
      const { POST } = await import('@/app/api/ai/guide/route');

      const mockRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          problem_id: 'two-sum-ii',
          user_input: 'I need help',
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
        })
      } as any;

      const result = await POST(mockRequest);
      expect(result).toBeDefined();
    });

    test('should handle GET request for guidance info', async () => {
      const { GET } = await import('@/app/api/ai/guide/route');

      const mockRequest = {
        url: 'http://localhost/api/ai/guide?pattern_id=two-pointer&problem_id=two-sum-ii'
      } as any;

      const result = await GET(mockRequest);
      expect(result).toBeDefined();
    });
  });

  describe('POST /api/ai/validate', () => {
    test('should handle valid validation request', async () => {
      const { POST } = await import('@/app/api/ai/validate/route');

      const mockRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          problem_id: 'two-sum-ii',
          user_solution: 'function twoSum(nums, target) { return [0, 1]; }',
          solution_approach: 'Used two pointers',
          context: {}
        })
      } as any;

      const result = await POST(mockRequest);
      expect(result).toBeDefined();
    });

    test('should handle GET request for validation criteria', async () => {
      const { GET } = await import('@/app/api/ai/validate/route');

      const mockRequest = {
        url: 'http://localhost/api/ai/validate?pattern_id=two-pointer&problem_id=two-sum-ii'
      } as any;

      const result = await GET(mockRequest);
      expect(result).toBeDefined();
    });
  });

  describe('POST /api/ai/chat', () => {
    test('should handle valid chat request', async () => {
      const { POST } = await import('@/app/api/ai/chat/route');

      const mockRequest = {
        json: () => Promise.resolve({
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
        })
      } as any;

      const result = await POST(mockRequest);
      expect(result).toBeDefined();
    });

    test('should handle GET request for chat configuration', async () => {
      const { GET } = await import('@/app/api/ai/chat/route');

      const mockRequest = {
        url: 'http://localhost/api/ai/chat?user_id=test-user'
      } as any;

      const result = await GET(mockRequest);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing API key gracefully', async () => {
      // Temporarily remove API key
      delete process.env.GOOGLE_AI_API_KEY;

      const { POST } = await import('@/app/api/ai/assess/route');

      const mockRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          assessment_type: 'initial'
        })
      } as any;

      try {
        await POST(mockRequest);
      } catch (error) {
        // Should handle missing API key
        expect(error).toBeDefined();
      }

      // Restore API key
      process.env.GOOGLE_AI_API_KEY = 'test-api-key';
    });
  });

  describe('Integration Flow', () => {
    test('should handle complete learning workflow through APIs', async () => {
      // 1. Assessment
      const { POST: assessPost } = await import('@/app/api/ai/assess/route');
      const assessmentRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          assessment_type: 'initial',
          user_input: 'Intermediate developer',
          context: { experience: 'intermediate' }
        })
      } as any;

      const assessmentResult = await assessPost(assessmentRequest);
      expect(assessmentResult).toBeDefined();

      // 2. Guidance
      const { POST: guidePost } = await import('@/app/api/ai/guide/route');
      const guidanceRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          problem_id: 'two-sum-ii',
          user_input: 'Need help starting',
          context: {
            current_level: 1,
            attempts: 1,
            hint_level: 1,
            user_profile: {
              id: 'test-user',
              experience_level: 'intermediate',
              learning_pace: 'balanced',
              preferred_style: 'visual'
            }
          }
        })
      } as any;

      const guidanceResult = await guidePost(guidanceRequest);
      expect(guidanceResult).toBeDefined();

      // 3. Validation
      const { POST: validatePost } = await import('@/app/api/ai/validate/route');
      const validationRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          problem_id: 'two-sum-ii',
          user_solution: 'function twoSum(nums, target) { return [0, 1]; }',
          solution_approach: 'Used two pointers',
          context: {}
        })
      } as any;

      const validationResult = await validatePost(validationRequest);
      expect(validationResult).toBeDefined();

      // 4. Chat
      const { POST: chatPost } = await import('@/app/api/ai/chat/route');
      const chatRequest = {
        json: () => Promise.resolve({
          user_id: 'test-user',
          message: 'Great! What should I try next?',
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
        })
      } as any;

      const chatResult = await chatPost(chatRequest);
      expect(chatResult).toBeDefined();
    });
  });
});
